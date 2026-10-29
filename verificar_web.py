"""Start/reuse local demo services, capture screenshots, run browser tests, stop owned services."""
import os
import shutil
import subprocess
import sys
from pathlib import Path
import iniciar

def main():
    root=iniciar.ROOT
    iniciar.DATA.mkdir(exist_ok=True)
    java,home=iniciar.locate_java()
    env=os.environ.copy()
    env["JAVA_HOME"]=home
    env["SPRING_PROFILES_ACTIVE"]="demo"
    if iniciar.WINDOWS:
        env["JAVA_TOOL_OPTIONS"]="-Djdk.net.unixdomain.tmpdir="+str(iniciar.DATA/"tcp-fallback")
    services=[
      ("backend","http://127.0.0.1:8080/api/v1/health",[java,"-jar",str(root/"target/gestion-inventario-lirio-1.0.0.jar")],root),
      ("web","http://127.0.0.1:5173",[shutil.which("node"),str(root/"el-lirio-frontend/node_modules/vite/bin/vite.js"),"--host","127.0.0.1"],root/"el-lirio-frontend"),
      ("chatbot","http://127.0.0.1:8501/_stcore/health",[str(root/".venv"/("Scripts/python.exe" if iniciar.WINDOWS else "bin/python")),"-m","streamlit","run","app.py","--server.address","127.0.0.1","--server.headless","true"],root/"chatbot"),
    ]
    for name,url,cmd,cwd in services:
        if not iniciar.ready(url):
            print("Iniciando "+name,flush=True)
            child=iniciar.start(name,cmd,cwd,env)
            iniciar.wait_service(name,url,child)
    print("Servicios listos. Capturando pantallas.",flush=True)
    iniciar.run([shutil.which("node"),"scripts/capture.mjs"],cwd=root/"el-lirio-frontend",env=env)
    if "--solo-capturas" in sys.argv:
        return
    print("Ejecutando pruebas de navegador.",flush=True)
    iniciar.run([shutil.which("npm.cmd" if iniciar.WINDOWS else "npm"),"run","test:e2e"],cwd=root/"el-lirio-frontend",env=env)

if __name__=="__main__":
    try: main()
    finally: iniciar.stop()
