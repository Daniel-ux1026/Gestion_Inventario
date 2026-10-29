"""Run the local demonstration with one command. Python 3.11+, Node 20.19+ and Java 21."""
from __future__ import annotations
import argparse
import os
from pathlib import Path
import shutil
import subprocess
import sys
import time
import urllib.request
import webbrowser
from ejecucion import ProjectRun, StopRequested

ROOT = Path(__file__).resolve().parent
DATA = ROOT / ".data"
FRONT = ROOT / "el-lirio-frontend"
WINDOWS = os.name == "nt"
CHILDREN = []
ACTIVE_RUN = None


def check_stop():
    if ACTIVE_RUN is not None:
        ACTIVE_RUN.check_stop()

def run(command, cwd=ROOT, env=None):
    subprocess.run(command, cwd=cwd, env=env, check=True, shell=False)

def locate_java():
    configured = os.environ.get("JAVA_HOME")
    candidates = ([Path(configured)] if configured else [])
    if WINDOWS:
        folder = Path(os.environ.get("ProgramFiles", "C:/Program Files")) / "Java"
        candidates += sorted(folder.glob("jdk-21*"), reverse=True)
    for folder in candidates:
        java = folder / "bin" / ("java.exe" if WINDOWS else "java")
        if java.is_file():
            return str(java), str(folder)
    java = shutil.which("java")
    if not java:
        raise RuntimeError("Instala Java 21 y configura JAVA_HOME.")
    result = subprocess.run([java, "-version"], capture_output=True, text=True, timeout=10)
    if 'version "21' not in result.stderr:
        raise RuntimeError("Este proyecto requiere Java 21. Configura JAVA_HOME con tu JDK 21.")
    return java, str(Path(java).resolve().parents[1])

def ready(url):
    try:
        with urllib.request.urlopen(url, timeout=2) as response:
            return response.status == 200
    except Exception:
        return False

def start(name, command, cwd, env):
    check_stop()
    log = (DATA / (name + ".log")).open("ab")
    flags = subprocess.CREATE_NO_WINDOW | subprocess.CREATE_NEW_PROCESS_GROUP if WINDOWS else 0
    child = subprocess.Popen(command, cwd=cwd, env=env, stdout=log, stderr=subprocess.STDOUT, creationflags=flags)
    CHILDREN.append((name, child, log))
    return child

def wait_service(name, url, child, seconds=75):
    deadline = time.monotonic() + seconds
    while time.monotonic() < deadline:
        check_stop()
        if child.poll() is not None:
            raise RuntimeError(name + " no pudo iniciar. Revisa .data/" + name + ".log")
        if ready(url):
            return
        time.sleep(1)
    raise RuntimeError(name + " no respondió a tiempo. Revisa su registro en .data/.")

def stop():
    errors = []
    for _, child, log in reversed(CHILDREN):
        try:
            if child.poll() is None:
                if WINDOWS:
                    subprocess.run(["taskkill", "/PID", str(child.pid), "/T", "/F"], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, timeout=10)
                else:
                    child.terminate()
                child.wait(timeout=10)
        except (OSError, subprocess.SubprocessError) as error:
            errors.append("PID " + str(child.pid) + ": " + str(error))
        finally:
            log.close()
    CHILDREN.clear()
    return errors

def main():
    global ACTIVE_RUN
    parser = argparse.ArgumentParser(description="Inicia la demostración local de El Lirio")
    parser.add_argument("--instalar", action="store_true", help="Instala dependencias y construye el backend")
    parser.add_argument("--sin-abrir", action="store_true", help="No abre una ventana de navegador")
    args = parser.parse_args()
    DATA.mkdir(exist_ok=True)
    java, java_home = locate_java()
    env = os.environ.copy()
    env["JAVA_HOME"] = java_home
    env["SPRING_PROFILES_ACTIVE"] = "demo"
    # A nonexistent local directory makes Java fall back from Unix sockets to TCP on Windows.
    # This avoids the Windows AF_UNIX loopback failure without changing OS settings.
    if WINDOWS:
        env["JAVA_TOOL_OPTIONS"] = env.get("JAVA_TOOL_OPTIONS", "") + " -Djdk.net.unixdomain.tmpdir=" + str(DATA / "tcp-fallback")
    npm = shutil.which("npm.cmd" if WINDOWS else "npm")
    node = shutil.which("node")
    if not npm or not node:
        raise RuntimeError("Instala Node.js 20.19 o superior.")
    venv_python = ROOT / ".venv" / ("Scripts/python.exe" if WINDOWS else "bin/python")
    jar = ROOT / "target/gestion-inventario-lirio-1.0.0.jar"
    if args.instalar:
        run([sys.executable, "-m", "venv", str(ROOT / ".venv")])
        run([str(venv_python), "-m", "pip", "install", "-r", str(ROOT / "chatbot/requirements.txt")])
        run([npm, "ci", "--no-fund"], cwd=FRONT)
        maven = shutil.which("mvn.cmd" if WINDOWS else "mvn")
        if maven:
            run([maven, "-B", "package"], env=env)
        elif WINDOWS:
            run([os.environ.get("COMSPEC", "cmd.exe"), "/d", "/c", str(ROOT / "mvnw.cmd"), "-B", "package"], env=env)
        else:
            run(["sh", str(ROOT / "mvnw"), "-B", "package"], env=env)
    if not jar.is_file() or not venv_python.is_file() or not (FRONT / "node_modules/vite").exists():
        raise RuntimeError("Primera ejecución: python iniciar.py --instalar")
    ACTIVE_RUN = ProjectRun().acquire()
    endpoints = [("backend", "http://127.0.0.1:8080/api/v1/health"), ("web", "http://127.0.0.1:5173"), ("chatbot", "http://127.0.0.1:8501/_stcore/health")]
    if any(ready(url) for _, url in endpoints):
        raise RuntimeError("Uno de los puertos 8080, 5173 o 8501 ya está en uso. Cierra tu ejecución anterior antes de iniciar otra.")
    backend = start("backend", [java, "-jar", str(jar)], ROOT, env)
    wait_service("backend", endpoints[0][1], backend)
    web = start("web", [node, str(FRONT / "node_modules/vite/bin/vite.js"), "--host", "127.0.0.1"], FRONT, env)
    wait_service("web", endpoints[1][1], web)
    chatbot = start("chatbot", [str(venv_python), "-m", "streamlit", "run", "app.py", "--server.address", "127.0.0.1", "--server.headless", "true"], ROOT / "chatbot", env)
    wait_service("chatbot", endpoints[2][1], chatbot)
    print("El Lirio está listo: http://127.0.0.1:5173")
    print("Administrador: admin@lirio.local / LirioDemo2026!")
    print("Cliente: cliente@lirio.local / ClienteDemo2026!")
    print("Demostración aislada. Registros: .data/. Usa DETENER_PROYECTO.bat o pulsa Ctrl+C para detener.")
    if not args.sin_abrir:
        webbrowser.open("http://127.0.0.1:5173")
    while True:
        check_stop()
        for name, child, _ in CHILDREN:
            if child.poll() is not None:
                raise RuntimeError(name + " se detuvo. Revisa .data/" + name + ".log")
        time.sleep(2)

if __name__ == "__main__":
    try:
        main()
    except KeyboardInterrupt:
        print("\nDeteniendo El Lirio…")
    except StopRequested:
        print("Deteniendo El Lirio desde DETENER_PROYECTO.bat…")
    except (RuntimeError, subprocess.SubprocessError, OSError) as error:
        print(str(error), file=sys.stderr)
        sys.exit(1)
    finally:
        errors = stop()
        if ACTIVE_RUN is not None:
            ACTIVE_RUN.finish(errors)
        if errors:
            print("No se pudo completar el cierre: " + "; ".join(errors), file=sys.stderr)
            sys.exit(1)
