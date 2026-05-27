#!/bin/bash
# OEDX AI - Setup Script

set -e

echo "🚀 OEDX AI - Automated Setup Script"
echo "===================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check prerequisites
echo ""
echo "📋 Checking prerequisites..."

# Check Python
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}✗ Python 3 not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Python 3 found${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}✗ Node.js not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Node.js found${NC}"

# Check npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}✗ npm not found${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm found${NC}"

# Setup Backend
echo ""
echo "🔧 Setting up Backend..."

cd backend

# Create virtual environment
echo "Creating Python virtual environment..."
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
echo "Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Setup environment
if [ ! -f .env ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please add your OPENAI_API_KEY to backend/.env${NC}"
fi

cd ..

# Setup Frontend
echo ""
echo "📦 Setting up Frontend..."

cd frontend

# Install dependencies
echo "Installing Node dependencies..."
npm install

# Setup environment
if [ ! -f .env.local ]; then
    echo "Creating .env.local file from template..."
    cp .env.example .env.local
fi

cd ..

echo ""
echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "📖 Next steps:"
echo "1. Add your OpenAI API key to backend/.env"
echo "2. In Terminal 1, run:"
echo "   cd backend && source venv/bin/activate && python run.py"
echo "3. In Terminal 2, run:"
echo "   cd frontend && npm run dev"
echo "4. Open http://localhost:3000 in your browser"
echo ""
echo "📚 Documentation:"
echo "   - Quick Start: QUICKSTART.md"
echo "   - Installation: INSTALLATION.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Development: DEVELOPMENT.md"
echo ""
