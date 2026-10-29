@echo off
setlocal
cd /d "%~dp0"
python detener.py
set "resultado=%errorlevel%"
if not "%~1"=="--sin-pausa" pause
exit /b %resultado%
