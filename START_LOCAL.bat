@echo off
REM Hackathon Full Stack Startup Script for Windows
REM This script starts both backend and frontend simultaneously

setlocal enabledelayedexpansion

echo.
echo ========================================
echo Hackathon Portal Full Stack Startup
echo ========================================
echo.

REM Check if running from correct directory
if not exist "backend" (
    echo ERROR: Run this script from the Hackathon root directory (where backend/ and frontend/ folders are)
    pause
    exit /b 1
)

REM Get current directory
set ROOT_DIR=%cd%

REM Configure database credentials
set DB_USERNAME=root
set DB_PASSWORD=
set /p DB_PASSWORD="Enter MySQL password (press Enter if none): "

REM Configure Java
for /f "tokens=*" %%i in ('where java 2^>nul') do set JAVA_FOUND=1
if not defined JAVA_FOUND (
    echo ERROR: Java not found. Please install Java 21 and add to PATH
    pause
    exit /b 1
)

echo.
echo ✓ Java found
echo ✓ MySQL credentials set
echo.

REM Start backend in new terminal
echo Starting Backend on port 8080...
start cmd /k "cd /d %ROOT_DIR%\backend && ^
set JAVA_HOME=C:\Program Files\Java\jdk-21.0.10 && ^
set DB_USERNAME=%DB_USERNAME% && ^
set DB_PASSWORD=%DB_PASSWORD% && ^
echo. && ^
echo ========================================== && ^
echo Backend Server Starting... && ^
echo ========================================== && ^
echo. && ^
.\mvnw.cmd -q spring-boot:run && ^
pause"

REM Wait for backend to start
timeout /t 5 /nobreak

REM Start frontend in new terminal
echo Starting Frontend on port 3000...
start cmd /k "cd /d %ROOT_DIR%\frontend && ^
set REACT_APP_API_BASE_URL=http://localhost:8080/api && ^
echo. && ^
echo ========================================== && ^
echo Frontend Development Server Starting... && ^
echo ========================================== && ^
echo. && ^
call npm start && ^
pause"

echo.
echo ========================================
echo Both services are starting...
echo.
echo Frontend:  http://localhost:3000
echo Backend:   http://localhost:8080
echo API Base:  http://localhost:8080/api
echo.
echo Note: You now have 2 terminal windows running
echo Keep both open for full functionality
echo ========================================
echo.
pause
