@echo off
setlocal
cd /d "%~dp0"
python -u compartir.py %*
set "resultado=%errorlevel%"
if not "%resultado%"=="0" pause
exit /b %resultado%
