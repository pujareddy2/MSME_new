@echo off
REM Platform Setup Validation Script for Windows
REM This script checks all prerequisites before running the project

setlocal enabledelayedexpansion

cls
echo.
echo ========================================
echo MSME Innovation Platform Setup Validator
echo ========================================
echo.
echo This script will check if all required
echo components are installed and configured.
echo.

set all_good=1

REM Check Java
echo Checking Java...
java -version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('java -version 2^>^&1 ^| findstr /i "version"') do (
        echo   ✓ Java installed: %%i
    )
) else (
    echo   ✗ Java NOT found
    echo     Download from: https://www.oracle.com/java/technologies/downloads/
    set all_good=0
)

REM Check Node.js
echo.
echo Checking Node.js...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('node --version') do (
        echo   ✓ Node.js installed: %%i
    )
) else (
    echo   ✗ Node.js NOT found
    echo     Download from: https://nodejs.org/
    set all_good=0
)

REM Check npm
echo.
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('npm --version') do (
        echo   ✓ npm installed: %%i
    )
) else (
    echo   ✗ npm NOT found
    echo     Usually comes with Node.js
    set all_good=0
)

REM Check MySQL
echo.
echo Checking MySQL...
mysql --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('mysql --version') do (
        echo   ✓ MySQL installed: %%i
    )
) else (
    echo   ✗ MySQL NOT found
    echo     Download from: https://dev.mysql.com/downloads/mysql/
    set all_good=0
)

REM Check Git (optional but recommended)
echo.
echo Checking Git (optional)...
git --version >nul 2>&1
if %errorlevel% equ 0 (
    for /f "tokens=*" %%i in ('git --version') do (
        echo   ✓ Git installed: %%i
    )
) else (
    echo   ✓ Git not found (optional, but recommended)
    echo     Download from: https://git-scm.com/
)

REM Check folder structure
echo.
echo Checking project structure...
if exist "backend" (
    echo   ✓ backend folder found
) else (
    echo   ✗ backend folder NOT found
    set all_good=0
)

if exist "frontend" (
    echo   ✓ frontend folder found
) else (
    echo   ✗ frontend folder NOT found
    set all_good=0
)

REM Check if MySQL is running
echo.
echo Checking MySQL connection...
mysql -u root -e "SELECT 1" >nul 2>&1
if %errorlevel% equ 0 (
    echo   ✓ MySQL is running and accessible
) else (
    echo   ⚠ MySQL is not accessible (might need to start it)
    echo     Windows: Open Services and start MySQL80
    echo     Or run: net start MySQL80
)

REM Summary
echo.
echo ========================================
if %all_good% equ 1 (
    echo ✓ All critical prerequisites OK!
    echo.
    echo Next steps:
    echo 1. Create database (see DEPLOYMENT_GUIDE.md Part 3)
    echo 2. Run: START_LOCAL.bat
    echo.
) else (
    echo ✗ Some prerequisites are missing
    echo.
    echo Please install missing components above
    echo Re-run this script after installation
)
echo ========================================
echo.
pause
