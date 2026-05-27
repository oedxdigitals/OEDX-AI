@echo off
REM OEDX AI - Setup Script for Windows

echo.
echo 🚀 OEDX AI - Automated Setup Script (Windows)
echo =============================================
echo.

REM Check Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Python not found
    exit /b 1
)
echo ✓ Python found

REM Check Node.js
node --version >nul 2>&1
if errorlevel 1 (
    echo ✗ Node.js not found
    exit /b 1
)
echo ✓ Node.js found

REM Check npm
npm --version >nul 2>&1
if errorlevel 1 (
    echo ✗ npm not found
    exit /b 1
)
echo ✓ npm found

REM Setup Backend
echo.
echo 🔧 Setting up Backend...

cd backend

echo Creating Python virtual environment...
python -m venv venv

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing Python dependencies...
python -m pip install --upgrade pip
pip install -r requirements.txt

if not exist .env (
    echo Creating .env file from template...
    copy .env.example .env
    echo ⚠️  Please add your OPENAI_API_KEY to backend\.env
)

cd ..

REM Setup Frontend
echo.
echo 📦 Setting up Frontend...

cd frontend

echo Installing Node dependencies...
call npm install

if not exist .env.local (
    echo Creating .env.local file from template...
    copy .env.example .env.local
)

cd ..

echo.
echo ✅ Setup Complete!
echo.
echo 📖 Next steps:
echo 1. Add your OpenAI API key to backend\.env
echo 2. In Command Prompt 1, run:
echo    cd backend
echo    venv\Scripts\activate.bat
echo    python run.py
echo 3. In Command Prompt 2, run:
echo    cd frontend
echo    npm run dev
echo 4. Open http://localhost:3000 in your browser
echo.
echo 📚 Documentation:
echo    - Quick Start: QUICKSTART.md
echo    - Installation: INSTALLATION.md
echo    - Deployment: DEPLOYMENT.md
echo    - Development: DEVELOPMENT.md
echo.
