# OEDX AI Installation & Setup Guide

Complete step-by-step guide to get OEDX AI running on your machine.

## Prerequisites Check

Before starting, ensure you have:

```bash
# Check Node.js (v18+)
node --version

# Check npm
npm --version

# Check Python (v3.10+)
python --version
```

## 🔧 Step-by-Step Setup

### 1. Backend Setup

#### 1.1 Navigate to Backend
```bash
cd backend
```

#### 1.2 Create Python Virtual Environment
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

#### 1.3 Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 1.4 Configure Environment
```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-actual-key-here
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_URL=sqlite:///./oedx_ai.db
```

#### 1.5 Initialize Database
```bash
# Database will be created automatically on first run
python run.py
```

Wait for: `INFO:     Uvicorn running on http://0.0.0.0:8000`

Test health endpoint:
```bash
curl http://localhost:8000/api/health
```

### 2. Frontend Setup

Open a **new terminal** and navigate to frontend:

```bash
cd frontend
```

#### 2.1 Install Dependencies
```bash
npm install
```

#### 2.2 Configure Environment
```bash
cp .env.example .env.local
```

Verify `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

#### 2.3 Start Development Server
```bash
npm run dev
```

Wait for: `ready - started server on 0.0.0.0:3000`

### 3. Access the Application

Open browser and navigate to:
```
http://localhost:3000
```

## ✅ Verification

### Backend Checks
- Health: http://localhost:8000/api/health
- API Docs: http://localhost:8000/docs
- Info: http://localhost:8000/api/info

### Frontend Checks
- Main Page: http://localhost:3000
- Console: No errors in browser DevTools
- Network: Requests to localhost:8000

## 🚨 Troubleshooting

### Backend Issues

**Error: "OPENAI_API_KEY is not configured"**
- Ensure `.env` file exists in `backend/` folder
- Add valid OpenAI key to `.env`
- Restart backend: `python run.py`

**Error: "Port 8000 already in use"**
```bash
# Kill process on port 8000
# macOS/Linux
lsof -ti:8000 | xargs kill -9

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

**Error: "Database locked"**
- Delete `oedx_ai.db` file
- Restart backend

### Frontend Issues

**Error: "Module not found"**
```bash
rm -rf node_modules
npm install
```

**Port 3000 already in use**
```bash
# macOS/Linux
lsof -ti:3000 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**API connection fails**
- Ensure backend is running
- Check backend on http://localhost:8000/api/health
- Verify frontend has `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000`

## 📦 Using Docker

### Prerequisites
- Docker & Docker Compose installed

### Quick Start
```bash
# From root directory
docker-compose -f docker-compose.yml up

# Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
```

## 🎯 First Test

1. Open http://localhost:3000
2. Click "New Chat"
3. Type: "Hello, what's your name?"
4. Click Send
5. Wait for streaming response

If successful, you're ready to use OEDX AI!

## 📚 Next Steps

### Development
- Modify components in `frontend/src/components/`
- Edit API routes in `backend/app/api/`
- Hot reload works automatically

### Customization
- Change colors in `frontend/tailwind.config.js`
- Modify models in `backend/app/config.py`
- Update branding in components

### Production
- See [Deployment Guide](./DEPLOYMENT.md)

## 🔐 Security Notes

- Never commit `.env` files
- Rotate OpenAI API keys regularly
- Use strong database passwords in production
- Enable HTTPS in production
- Validate all user inputs

## 💡 Tips

- Use VS Code with extensions:
  - Python (ms-python.python)
  - Prettier - Code formatter
  - Tailwind CSS IntelliSense
  - Thunder Client (API testing)

- Monitor logs:
  ```bash
  # Backend logs
  tail -f backend/app.log
  ```

- Database inspection:
  ```bash
  sqlite3 backend/oedx_ai.db
  SELECT * FROM conversations LIMIT 5;
  ```

## 📞 Getting Help

1. Check troubleshooting section above
2. Review backend logs: `python run.py`
3. Check frontend console: F12 in browser
4. Check environment variables are set correctly
5. Ensure all ports are available

---

**Setup Complete!** Start building amazing AI conversations! 🚀
