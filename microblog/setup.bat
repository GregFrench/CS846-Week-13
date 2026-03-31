@echo off
REM Microblogging Application - Quick Start Script for Windows

echo.
echo 🚀 Microblogging Application - Quick Start
echo ===========================================
echo.

REM Check Node.js
echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ from https://nodejs.org/
    exit /b 1
)
for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo ✓ Node.js %NODE_VERSION% found
echo.

REM Backend setup
echo Setting up backend...
cd backend

if not exist "node_modules" (
    echo Installing backend dependencies...
    call npm install
) else (
    echo ✓ Backend dependencies already installed
)

if not exist ".env" (
    echo Creating .env file...
    copy .env.example .env
    echo ✓ .env created (update if needed)
)

echo Initializing database...
call npm run db:init
echo ✓ Database initialized
echo.

cd ..

REM Frontend setup
echo Setting up frontend...
cd frontend

if not exist "node_modules" (
    echo Installing frontend dependencies...
    call npm install
) else (
    echo ✓ Frontend dependencies already installed
)

cd ..

echo.
echo ✅ Setup complete!
echo.
echo 🚀 Start the application:
echo   Terminal 1 (Backend):
echo     cd backend ^&^& npm run dev
echo   Terminal 2 (Frontend):
echo     cd frontend ^&^& npm run dev
echo.
echo 📖 Documentation:
echo   - Setup guide: SETUP.md
echo   - Requirements: REQUIREMENTS.md
echo   - Architecture: ARCHITECTURE.md
echo   - API docs: README.md
echo.
echo 🧪 Run tests:
echo   cd backend ^&^& npm test
echo   cd frontend ^&^& npm test
echo.
echo Happy coding! 🎉
echo.
pause
