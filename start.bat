@echo off
title AnonDoubt Server
cd /d "%~dp0"
echo.
echo  ==========================================
echo   AnonDoubt Server Starting...
echo  ==========================================
echo.
echo  Please wait, opening browser in 3 seconds...
echo.
start /b cmd /c "timeout /t 3 /nobreak >nul && start http://localhost:3000"
npm run dev
pause

