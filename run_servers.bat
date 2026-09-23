@echo off
echo ===================================================
echo   Starting TRUSTBREAK AI Full-Stack Platform...
echo   "Break It Safely. Fix It. Trust It."
echo ===================================================
echo.

start "TRUSTBREAK AI - Backend" cmd /k "cd /d %~dp0backend && .\venv\Scripts\python.exe -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000"
start "TRUSTBREAK AI - Frontend" cmd /k "cd /d %~dp0frontend && npm run dev"

echo Waiting 3 seconds for servers to initialize...
timeout /t 3 /nobreak >nul

echo Opening TRUSTBREAK AI in your default web browser...
start http://localhost:5173

echo.
echo ===================================================
echo   Platform is running!
echo   Frontend: http://localhost:5173
echo   Backend Docs: http://localhost:8000/docs
echo.
echo   Demo Login:
echo     Email:    demo@trustbreak.ai
echo     Password: Demo@123
echo ===================================================
pause
