@echo off
setlocal
cd /d "%~dp0"
python iniciar.py %*
set "resultado=%errorlevel%"
if not "%resultado%"=="0" pause
exit /b %resultado%
