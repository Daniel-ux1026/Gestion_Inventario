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
import direccion_fija
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


def stop_tunnel(child):
    if child is not None and child.poll() is None:
        child.terminate()
        child.wait(timeout=10)
    for entry in list(iniciar.CHILDREN):
        if entry[1] is child:
            entry[2].close()
            iniciar.CHILDREN.remove(entry)


def pause(seconds):
    for _ in range(seconds):
        iniciar.check_stop()
        time.sleep(1)


def open_tunnel(binary, config):
    for attempt in range(3):
        iniciar.check_stop()
        (DATA / "cloudflare.log").write_text("", encoding="utf-8")
        child = iniciar.start("cloudflare", [binary, "tunnel", "--config", str(config), "--no-autoupdate",
                              "--protocol", "http2", "--url", "http://127.0.0.1:8088", "--metrics", "127.0.0.1:0"], ROOT, os.environ.copy())
        try:
            return child, tunnel_url(child)
        except RuntimeError:
            stop_tunnel(child)
            if attempt == 2:
                raise
            print("Cloudflare no respondio. Reintentando la conexion (" + str(attempt + 2) + "/3)...", flush=True)
            pause(3)


def monitor_tunnel(tunnel, origin, reconnect):
    failures = 0
    delay = 20
    while True:
        pause(delay)
        if tunnel is None or tunnel.poll() is not None:
            failures = 3
        elif iniciar.ready("http://127.0.0.1:8088/api/v1/health"):
            # cloudflared may keep running after its temporary tunnel disappears.
            failures = 0 if iniciar.ready(origin + "/api/v1/health") else failures + 1
        else:
            failures = 0
        if failures < 3:
            continue
        try:
            tunnel, origin = reconnect(tunnel)
            failures = 0
            delay = 20
        except (RuntimeError, OSError, subprocess.SubprocessError) as error:
            print("La conexion sigue sin estar disponible: " + str(error) +
                  ". Se reintentara en 60 segundos; los servicios locales siguen activos.", flush=True)
            tunnel = None
            delay = 60


def start_services(compose, environment, build_flag):
    build = iniciar.start("docker-build", compose + ["up", build_flag, "-d"], ROOT, environment)
    while build.poll() is None:
        iniciar.check_stop()
        time.sleep(0.5)
    if build.returncode:
        raise RuntimeError("Docker no pudo iniciar la prueba. Revisa .data/docker-build.log.")
    wait_ready("http://127.0.0.1:8088")


def save_publication(public, origin):
    LINK_FILE.write_text(public + "\n", encoding="utf-8")
    write_json(iniciar.ACTIVE_RUN.state, {"id": iniciar.ACTIVE_RUN.identifier, "pid": os.getpid(),
               "status": "running", "mode": "cloudflare", "url": public, "origin": origin})


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
    parser.add_argument("--reconstruir", action="store_true", help="Reconstruye las imagenes con los cambios locales")
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
        config = DATA / "cloudflare-quick.yml"
        config.write_text("{}\n", encoding="utf-8")
        tunnel, origin = open_tunnel(binary, config)
        public = direccion_fija.fixed_url() or origin
        values = load_settings()
        values.update({"SPRING_PROFILES_ACTIVE": "preview", "LIRIO_SAMPLE_CATALOG": "true",
                       "FRONTEND_URL": public, "CORS_ORIGINS": public + "," + origin + ",http://127.0.0.1:8088,http://localhost:8088",
                       "WEB_BIND_ADDRESS": "127.0.0.1", "WEB_PORT": "8088"})
        save_settings(values)
        environment = os.environ.copy()
        environment.update(values)
        print("Preparando los contenedores de pruebas. La primera ejecucion puede tardar varios minutos...", flush=True)
        stack_started = True
        images = [PROJECT + "-" + name + ":latest" for name in ("backend", "web", "chatbot")]
        existing = subprocess.run([docker, "image", "inspect", "--format", "{{.Id}}", *images],
                                  capture_output=True, timeout=20).returncode == 0
        build_flag = "--build" if args.reconstruir or not existing else "--no-build"
        start_services(compose, environment, build_flag)
        public = direccion_fija.connect(origin, iniciar.ACTIVE_RUN.identifier)
        print("Servicios listos. Comprobando el acceso por HTTPS...", flush=True)
        wait_ready(public)
        save_publication(public, origin)
        print("\nENLACE PARA TUS CLIENTES: " + public, flush=True)
        print("Acceso privado del administrador: .data/ACCESO_ADMINISTRADOR.txt", flush=True)
        print("Manten Docker y esta ventana abiertos. DETENER_PROYECTO.bat cierra la publicacion.", flush=True)
        if not args.sin_abrir:
            webbrowser.open(public)
        def reconnect(previous):
            nonlocal public
            print("La conexion de Cloudflare se perdio. Reconectando la tienda...", flush=True)
            stop_tunnel(previous)
            replacement, new_origin = open_tunnel(binary, config)
            try:
                new_public = direccion_fija.fixed_url() or new_origin
                values.update({"FRONTEND_URL": new_public,
                               "CORS_ORIGINS": new_public + "," + new_origin + ",http://127.0.0.1:8088,http://localhost:8088"})
                save_settings(values)
                environment.update(values)
                start_services(compose, environment, "--no-build")
                new_public = direccion_fija.connect(new_origin, iniciar.ACTIVE_RUN.identifier)
                wait_ready(new_public)
                public = new_public
                save_publication(public, new_origin)
                print("Conexion recuperada. ENLACE PARA TUS CLIENTES: " + public, flush=True)
                return replacement, new_origin
            except BaseException:
                stop_tunnel(replacement)
                raise

        monitor_tunnel(tunnel, origin, reconnect)
    finally:
        errors = iniciar.stop()
        if public:
            try:
                direccion_fija.disconnect(iniciar.ACTIVE_RUN.identifier)
            except (OSError, ValueError, RuntimeError, subprocess.SubprocessError) as error:
                print("El enlace fijo mostrara mantenimiento hasta la proxima conexion: " + str(error), file=sys.stderr)
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
                                 "\nEjecuta COMPARTIR_PROYECTO.bat para volver a publicar la tienda.\n", encoding="utf-8")
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
