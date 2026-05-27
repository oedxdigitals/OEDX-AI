# 🚀 OEDX AI - Getting Started Guide

Welcome to OEDX AI - a complete production-grade AI chat platform!

## ✅ What's Been Created

A complete full-stack application with:

### 📁 Backend (Python FastAPI)
- ✅ Modular API architecture
- ✅ Real-time streaming with Server-Sent Events
- ✅ SQLAlchemy ORM with async support
- ✅ OpenAI API integration
- ✅ Conversation & message management
- ✅ Health check endpoints
- ✅ CORS configuration
- ✅ Error handling & logging

### 🎨 Frontend (Next.js 15 + TypeScript)
- ✅ Modern dark theme UI
- ✅ Real-time streaming chat
- ✅ Sidebar with conversation history
- ✅ Message rendering with markdown + syntax highlighting
- ✅ Responsive mobile design
- ✅ Zustand state management
- ✅ Smooth animations with Framer Motion
- ✅ Toast notifications

### 🗄️ Database
- ✅ SQLite for development
- ✅ PostgreSQL-ready for production
- ✅ Conversation & message tables
- ✅ Auto-migration setup

### 🐳 DevOps
- ✅ Docker & Docker Compose setup
- ✅ Dockerfile for frontend & backend
- ✅ Environment configuration
- ✅ Health checks

### 📚 Documentation
- ✅ README - Project overview
- ✅ QUICKSTART - 5-minute setup
- ✅ INSTALLATION - Detailed setup guide
- ✅ DEPLOYMENT - Production deployment
- ✅ DEVELOPMENT - Dev guide & best practices
- ✅ ARCHITECTURE - System design
- ✅ CONFIGURATION - Config reference
- ✅ PROJECT_SUMMARY - Complete project details

## 🏃 Quick Start (2 Minutes)

### Option 1: Automated Setup (Linux/Mac)
```bash
cd "OedX Ai"
bash setup.sh
# Follow prompts and add OpenAI API key
```

### Option 2: Automated Setup (Windows)
```bash
cd "OedX Ai"
setup.bat
# Follow prompts and add OpenAI API key
```

### Option 3: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
python -m venv venv

# Activate virtual environment:
# macOS/Linux:
source venv/bin/activate
# Windows:
venv\Scripts\activate

pip install -r requirements.txt
cp .env.example .env

# ⚠️ IMPORTANT: Edit .env and add your OpenAI API key:
# OPENAI_API_KEY=sk-proj-your-key-here

python run.py
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```

**Open Browser:**
```
http://localhost:3000
```

## 🔑 Prerequisites

You need:
1. **OpenAI API Key** - Get from https://platform.openai.com/api-keys
2. **Node.js 18+** - Download from nodejs.org
3. **Python 3.10+** - Download from python.org

## 📝 Environment Setup

### Backend (.env file - REQUIRED)
```env
OPENAI_API_KEY=sk-proj-your-actual-key-here
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_URL=sqlite:///./oedx_ai.db
```

### Frontend (.env.local file - Optional)
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 🧪 Verify Setup

### Check Backend
```bash
# Should return health status
curl http://localhost:8000/api/health

# View API documentation
# Open http://localhost:8000/docs in browser
```

### Check Frontend
- Open http://localhost:3000
- You should see the OEDX AI chat interface

## 💬 First Chat

1. **Create new chat** - Click "New Chat" button
2. **Type message** - Ask anything (e.g., "Hello, who are you?")
3. **Send** - Press Enter or click Send button
4. **Watch streaming** - See AI response stream token by token

## 📖 Next Steps

### Learn the Codebase
1. **Architecture**: Read [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Structure**: Review [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
3. **Development**: Check [DEVELOPMENT.md](./DEVELOPMENT.md)

### Customize the App
- **Colors**: Edit `frontend/tailwind.config.js`
- **Branding**: Update header in `frontend/src/app/page.tsx`
- **Models**: Modify `backend/app/config.py`
- **UI**: Edit components in `frontend/src/components/`

### Add Features
- **New API endpoint**: Create in `backend/app/api/`
- **New component**: Create in `frontend/src/components/`
- **Database changes**: Update `backend/app/models/`

See [DEVELOPMENT.md](./DEVELOPMENT.md) for detailed examples.

### Deploy to Production
Follow [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- **Frontend**: Deploy to Vercel
- **Backend**: Deploy to Render or Railway
- **Database**: Use PostgreSQL on Render
- **Domain**: Configure custom domain

## 🎯 Project Structure at a Glance

```
OedX Ai/
├── backend/           # FastAPI Python backend
│   ├── app/
│   │   ├── api/      # API routes (health, chat, conversations)
│   │   ├── services/ # OpenAI & database services
│   │   ├── models/   # Database models
│   │   └── main.py   # FastAPI app
│   └── requirements.txt
│
├── frontend/          # Next.js React frontend
│   └── src/
│       ├── app/      # Pages
│       ├── components/ # UI components
│       ├── stores/   # Zustand state
│       └── lib/      # API client & utilities
│
├── docker/           # Docker configuration
├── docs/             # Documentation
└── README.md         # Full documentation
```

## 🔗 Key Files

### Backend
- **Main App**: `backend/app/main.py`
- **Chat API**: `backend/app/api/chat.py`
- **AI Service**: `backend/app/services/ai_service.py`
- **Database**: `backend/app/db/session.py`

### Frontend
- **Chat Page**: `frontend/src/app/page.tsx`
- **Chat Store**: `frontend/src/stores/chatStore.ts`
- **API Client**: `frontend/src/lib/api.ts`
- **Components**: `frontend/src/components/`

## 🚨 Troubleshooting

### Backend won't start
```bash
# Error: "OPENAI_API_KEY is not configured"
# → Add key to backend/.env and restart

# Error: "Port 8000 in use"
# → Kill process: lsof -ti:8000 | xargs kill -9

# Error: "Python not found"
# → Install Python from python.org
```

### Frontend won't start
```bash
# Error: "Module not found"
# → Delete node_modules and reinstall:
rm -rf node_modules package-lock.json
npm install

# Error: "Port 3000 in use"
# → Kill process: lsof -ti:3000 | xargs kill -9
```

### API connection fails
```bash
# Check backend is running
curl http://localhost:8000/api/health

# Check frontend environment
# Ensure NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## 📚 Documentation

| File | Purpose |
|------|---------|
| [README.md](./README.md) | Project overview & features |
| [QUICKSTART.md](./QUICKSTART.md) | 5-minute quick start |
| [INSTALLATION.md](./INSTALLATION.md) | Detailed setup guide |
| [DEPLOYMENT.md](./DEPLOYMENT.md) | Production deployment |
| [DEVELOPMENT.md](./DEVELOPMENT.md) | Development guide |
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System architecture |
| [CONFIGURATION.md](./CONFIGURATION.md) | Configuration reference |
| [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) | Complete project details |

## 🌟 Features

✨ **Chat Features**
- Real-time streaming
- Markdown rendering
- Code syntax highlighting
- Message history
- Auto-save

🎨 **UI/UX**
- Dark modern theme
- Responsive design
- Smooth animations
- Mobile-friendly
- Toast notifications

⚡ **Performance**
- Async backend
- Optimized frontend
- Streaming responses
- Efficient database queries

🔒 **Security**
- CORS configuration
- Environment variables
- Input validation
- Ready for HTTPS

## 💡 Tips

1. **Development**: Use VS Code with the included workspace file
2. **Debugging**: Check logs in terminal and browser console
3. **Database**: View with `sqlite3 backend/oedx_ai.db`
4. **API Testing**: Use Swagger UI at `http://localhost:8000/docs`
5. **Hot Reload**: Changes auto-reload in both frontend & backend

## 🤝 Support

- **Issues**: Check [Troubleshooting](#troubleshooting) above
- **Docs**: Review the documentation files
- **Logs**: Check terminal output for errors
- **Browser Console**: F12 to see frontend errors

## 📞 Additional Resources

- **OpenAI API**: https://platform.openai.com/docs
- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs

## 🎉 You're All Set!

Everything is ready to run. Here's what to do:

1. **Add OpenAI API key** to `backend/.env`
2. **Start backend** → `cd backend && python run.py`
3. **Start frontend** → `cd frontend && npm run dev`
4. **Open browser** → `http://localhost:3000`
5. **Start chatting!** 💬

## 🚀 Next Milestone

After verification, consider:
- [ ] Deploy to production (Vercel + Render)
- [ ] Add user authentication
- [ ] Implement file uploads
- [ ] Add conversation export
- [ ] Enable custom models
- [ ] Set up monitoring

---

**Congratulations! Your OEDX AI platform is ready!** 🎊

For detailed documentation, see the markdown files in the project root.

**Happy coding!** 🚀
