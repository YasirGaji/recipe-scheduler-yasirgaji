@echo off
setlocal enabledelayedexpansion

echo.
echo ===================================
echo Recipe Scheduler - Local Development
echo ===================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo pnpm is not installed. Installing pnpm...
    npm install -g pnpm
)

REM Check if Redis is available
where redis-cli >nul 2>nul
if %errorlevel% neq 0 (
    echo.
    echo Redis is not installed or not in PATH.
    echo Please install Redis or use Docker:
    echo   docker run -d -p 6379:6379 redis
    echo.
    pause
    exit /b 1
)

REM Check if Redis is running
redis-cli ping >nul 2>nul
if %errorlevel% neq 0 (
    echo Redis is not running. Please start Redis first.
    pause
    exit /b 1
)

REM Install dependencies if needed
if not exist "node_modules" (
    echo Installing dependencies...
    pnpm install
)

REM Create data directory
if not exist "apps\api\data" (
    mkdir "apps\api\data"
)

echo.
echo Starting services...
echo.

REM Start API
echo [API] Starting on port 3000...
start "Recipe Scheduler API" cmd /c "cd apps\api && pnpm dev"

REM Wait for API to start
timeout /t 3 /nobreak >nul

REM Start Worker
echo [WORKER] Starting reminder worker...
start "Recipe Scheduler Worker" cmd /c "cd apps\worker && pnpm dev"

REM Wait for Worker to start
timeout /t 2 /nobreak >nul

REM Start Mobile
echo [MOBILE] Starting Expo...
start "Recipe Scheduler Mobile" cmd /c "cd apps\mobile && pnpm start"

echo.
echo ===================================
echo All services are running!
echo ===================================
echo.
echo API: http://localhost:3000
echo Worker: Processing reminders
echo Mobile: Expo DevTools
echo.
echo Close this window to stop all services
echo.
pause