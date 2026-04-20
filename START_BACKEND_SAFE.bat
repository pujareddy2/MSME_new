@echo off
setlocal enabledelayedexpansion

echo.
echo ========================================
echo Hackathon Backend Safe Start (Windows)
echo ========================================
echo.

set "ROOT_DIR=%~dp0"
set "BACKEND_DIR=%ROOT_DIR%backend"

if not exist "%BACKEND_DIR%\pom.xml" (
  echo ERROR: Could not find backend\pom.xml
  echo Run this script from the Hackathon root folder.
  pause
  exit /b 1
)

where java >nul 2>nul
if errorlevel 1 (
  echo ERROR: Java is not available in PATH.
  pause
  exit /b 1
)

set "DB_USERNAME=root"
set /p DB_USERNAME=Enter DB username [root]: 
if "%DB_USERNAME%"=="" set "DB_USERNAME=root"

set /p DB_PASSWORD=Enter DB password: 

set "PID_8080="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":8080" ^| findstr "LISTENING"') do (
  set "PID_8080=%%p"
)

if defined PID_8080 (
  echo.
  echo Port 8080 is in use by PID !PID_8080!.
  set /p KILL_EXISTING=Kill that process and continue? [Y/N]: 
  if /I "!KILL_EXISTING!"=="Y" (
    taskkill /PID !PID_8080! /F >nul 2>nul
    echo Killed PID !PID_8080!.
  ) else (
    echo Aborted. Backend not started.
    pause
    exit /b 1
  )
)

echo.
echo Starting backend...
echo DB_USERNAME=%DB_USERNAME%

set "DB_USERNAME=%DB_USERNAME%"
set "DB_PASSWORD=%DB_PASSWORD%"

call "%BACKEND_DIR%\mvnw.cmd" -f "%BACKEND_DIR%\pom.xml" spring-boot:run
