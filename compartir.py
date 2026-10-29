"""Publish an isolated Docker preview through an HTTPS Quick Tunnel."""
from __future__ import annotations

import argparse
import hashlib
import os
from pathlib import Path
import re
import secrets
import shutil
import subprocess
import sys
import time
import urllib.request
import webbrowser

import iniciar
from ejecucion import ProjectRun, StopRequested, write_json

ROOT = iniciar.ROOT
DATA = iniciar.DATA
ENV_FILE = DATA / "cloudflare.env"
LINK_FILE = DATA / "enlace_publico.txt"
ADMIN_FILE = DATA / "ACCESO_ADMINISTRADOR.txt"
VERSION = "2026.10.5"
SHA256 = "db4e4c413612a0916f3e1679d3caaf376f94911952d163028fb726fb2e0516a9"
PROJECT = "lirio-quick-" + hashlib.sha256(str(ROOT).lower().encode()).hexdigest()[:8]
TUNNEL_PATTERN = re.compile(r"https://[a-z0-9-]+\.trycloudflare\.com(?=[\s|/]|$)")


def cloudflared():
    installed = shutil.which("cloudflared")
    if installed:
        return installed
    if os.name != "nt":
        raise RuntimeError("Instala cloudflared desde https://developers.cloudflare.com/tunnel/downloads/.")
    binary = DATA / "tools/cloudflared.exe"
    binary.parent.mkdir(parents=True, exist_ok=True)
    if not binary.exists():
        print("Descargando Cloudflare desde su repositorio oficial...", flush=True)
        temporary = binary.with_suffix(".download")
        try:
            with urllib.request.urlopen(
                f"https://github.com/cloudflare/cloudflared/releases/download/{VERSION}/cloudflared-windows-amd64.exe",
                timeout=60,
            ) as response, temporary.open("wb") as output:
                shutil.copyfileobj(response, output)
            if hashlib.sha256(temporary.read_bytes()).hexdigest() != SHA256:
                raise RuntimeError("La descarga de Cloudflare no coincide con la huella oficial.")
            temporary.replace(binary)
        finally:
            temporary.unlink(missing_ok=True)
    if hashlib.sha256(binary.read_bytes()).hexdigest() != SHA256:
        raise RuntimeError("El ejecutable local de Cloudflare no coincide con la version verificada.")
    return str(binary)


def load_settings():
    if ENV_FILE.exists():
        return dict(line.split("=", 1) for line in ENV_FILE.read_text(encoding="utf-8").splitlines()
                    if line and not line.startswith("#"))
    return {
        "DB_NAME": "lirio_pruebas", "DB_USER": "lirio",
        "DB_PASSWORD": secrets.token_urlsafe(32),
        "MYSQL_ROOT_PASSWORD": secrets.token_urlsafe(32),
        "JWT_SECRET": secrets.token_urlsafe(64),
        "ADMIN_EMAIL": "administracion@lirio.local",
        "ADMIN_PASSWORD": secrets.token_urlsafe(24),
    }


def save_settings(values):
    ENV_FILE.write_text("\n".join(f"{key}={value}" for key, value in sorted(values.items())) + "\n", encoding="utf-8")
    ADMIN_FILE.write_text(
        "ACCESO PRIVADO A LA ADMINISTRACION DE PRUEBAS\n\n"
        f"Correo: {values['ADMIN_EMAIL']}\nContrasena: {values['ADMIN_PASSWORD']}\n\n"
        "Abre el enlace de enlace_publico.txt y entra en /login.\n"
        "No compartas este archivo ni la carpeta .data con los clientes.\n",
        encoding="utf-8",
    )
    if os.name != "nt":
        ENV_FILE.chmod(0o600)
        ADMIN_FILE.chmod(0o600)


def tunnel_url(child):
    deadline = time.monotonic() + 90
    while time.monotonic() < deadline:
        iniciar.check_stop()
        if child.poll() is not None:
            raise RuntimeError("Cloudflare no pudo iniciar. Revisa .data/cloudflare.log.")
        content = (DATA / "cloudflare.log").read_text(encoding="utf-8", errors="replace")
        matches = TUNNEL_PATTERN.findall(content)
        if matches:
            return matches[-1]
        time.sleep(0.5)
    raise RuntimeError("Cloudflare no genero un enlace a tiempo. Revisa .data/cloudflare.log.")


def wait_ready(url, seconds=180):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        iniciar.check_stop()
        for name, child, _ in iniciar.CHILDREN:
            if name == "cloudflare" and child.poll() is not None:
                raise RuntimeError("El tunel se detuvo. Revisa .data/cloudflare.log.")
        if iniciar.ready(url + "/api/v1/health") and iniciar.ready(url + "/chatbot/_stcore/health"):
            return
        time.sleep(1)
    raise RuntimeError("La web no respondio a tiempo. Revisa .data/docker-build.log y los registros de Docker.")


def main():
    parser = argparse.ArgumentParser(description="Comparte El Lirio con Cloudflare Quick Tunnel")
    parser.add_argument("--sin-abrir", action="store_true")
    args = parser.parse_args()
    DATA.mkdir(exist_ok=True)
    docker = shutil.which("docker")
    if not docker:
        raise RuntimeError("Instala Docker Desktop y activa su motor antes de compartir.")
    subprocess.run([docker, "info", "--format", "{{.ServerVersion}}"], check=True, capture_output=True, timeout=20)
    iniciar.ACTIVE_RUN = ProjectRun().acquire()
    compose = [docker, "compose", "--project-name", PROJECT, "--env-file", str(ENV_FILE), "-f", str(ROOT / "compose.yaml")]
    environment = None
    stack_started = False
    public = None
    try:
        binary = cloudflared()
        (DATA / "cloudflare.log").write_text("", encoding="utf-8")
        config = DATA / "cloudflare-quick.yml"
        config.write_text("{}\n", encoding="utf-8")
        tunnel = iniciar.start("cloudflare", [binary, "tunnel", "--config", str(config), "--no-autoupdate",
                               "--protocol", "http2", "--url", "http://127.0.0.1:8088", "--metrics", "127.0.0.1:0"], ROOT, os.environ.copy())
        public = tunnel_url(tunnel)
        values = load_settings()
        values.update({"SPRING_PROFILES_ACTIVE": "preview", "LIRIO_SAMPLE_CATALOG": "true",
                       "FRONTEND_URL": public, "CORS_ORIGINS": public + ",http://127.0.0.1:8088,http://localhost:8088",
                       "WEB_BIND_ADDRESS": "127.0.0.1", "WEB_PORT": "8088"})
        save_settings(values)
        environment = os.environ.copy()
        environment.update(values)
        print("Preparando los contenedores de pruebas. La primera ejecucion puede tardar varios minutos...", flush=True)
        stack_started = True
        build = iniciar.start("docker-build", compose + ["up", "--build", "-d"], ROOT, environment)
        while build.poll() is None:
            iniciar.check_stop()
            time.sleep(0.5)
        if build.returncode:
            raise RuntimeError("Docker no pudo iniciar la prueba. Revisa .data/docker-build.log.")
        wait_ready("http://127.0.0.1:8088")
        print("Servicios listos. Comprobando el acceso por HTTPS...", flush=True)
        wait_ready(public)
        LINK_FILE.write_text(public + "\n", encoding="utf-8")
        write_json(iniciar.ACTIVE_RUN.state, {"id": iniciar.ACTIVE_RUN.identifier, "pid": os.getpid(),
                   "status": "running", "mode": "cloudflare", "url": public})
        print("\nENLACE PARA TUS CLIENTES: " + public, flush=True)
        print("Acceso privado del administrador: .data/ACCESO_ADMINISTRADOR.txt", flush=True)
        print("Manten Docker y esta ventana abiertos. DETENER_PROYECTO.bat cierra la publicacion.", flush=True)
        if not args.sin_abrir:
            webbrowser.open(public)
        while True:
            iniciar.check_stop()
            if tunnel.poll() is not None:
                raise RuntimeError("El tunel se detuvo. Reinicia COMPARTIR_PROYECTO.bat para generar otro enlace.")
            time.sleep(1)
    finally:
        errors = iniciar.stop()
        if stack_started and environment is not None:
            try:
                with (DATA / "docker-stop.log").open("ab") as output:
                    result = subprocess.run(compose + ["down"], cwd=ROOT, env=environment,
                                            stdout=output, stderr=subprocess.STDOUT, timeout=60)
                if result.returncode:
                    errors.append("Docker no confirmo el cierre. Revisa .data/docker-stop.log.")
            except (OSError, subprocess.SubprocessError) as error:
                errors.append("Cierre de Docker: " + str(error))
        if public:
            LINK_FILE.write_text("PUBLICACION DETENIDA\nUltimo enlace: " + public +
                                 "\nEjecuta COMPARTIR_PROYECTO.bat para generar otro enlace.\n", encoding="utf-8")
        iniciar.ACTIVE_RUN.finish(errors)
        if errors:
            raise RuntimeError("; ".join(errors))


if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, StopRequested):
        print("Publicacion detenida. Los datos de pruebas se conservan en los volumenes de Docker.")
    except (RuntimeError, OSError, subprocess.SubprocessError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
