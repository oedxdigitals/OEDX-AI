# OEDX AI - Quick Start Guide

Get OEDX AI up and running in 5 minutes!

## 30-Second Setup

```bash
# Clone and enter directory
cd "OedX Ai"

# Terminal 1: Backend
cd backend && python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
# Add your OpenAI API key to .env
python run.py

# Terminal 2: Frontend (new terminal)
cd frontend
npm install
cp .env.example .env.local
npm run dev

# Open browser → http://localhost:3000
```

## First Chat

1. ✅ Backend running at `localhost:8000`
2. ✅ Frontend running at `localhost:3000`
3. ✅ Type a message
4. ✅ See streaming AI response

## What's Included

✨ **Frontend**
- Modern Chat UI with dark theme
- Real-time message streaming
- Sidebar with conversation history
- Markdown rendering with code highlighting
- Responsive mobile design

⚡ **Backend**
- FastAPI with async support
- SQLite database for chat history
- OpenAI API integration
- Server-Sent Events for streaming
- Production-ready error handling

🎨 **Features**
- Create/rename/delete conversations
- Auto-save messages
- Smooth animations
- Copy message text
- Token counting

## Configuration

### Backend (.env)
```
OPENAI_API_KEY=sk-your-key-here
OPENAI_MODEL=gpt-4-turbo-preview
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

## API Health Check

```bash
curl http://localhost:8000/api/health
```

Expected response:
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "database": "healthy",
  "ai_service": "healthy"
}
```

## File Structure

```
OedX Ai/
├── backend/          # Python FastAPI backend
├── frontend/         # Next.js frontend
├── docker/          # Docker configuration
├── docs/            # Documentation
├── README.md        # Main docs
├── INSTALLATION.md  # Detailed setup
├── DEPLOYMENT.md    # Production guide
├── DEVELOPMENT.md   # Dev guide
└── ARCHITECTURE.md  # System design
```

## Common Commands

### Backend
```bash
cd backend
source venv/bin/activate
python run.py                    # Start server
python -m pytest               # Run tests
```

### Frontend
```bash
cd frontend
npm run dev                    # Start dev server
npm run build                  # Build for production
npm run lint                   # Check code style
npm test                       # Run tests
```

## Troubleshooting

### "Port already in use"
```bash
# Kill process on port
lsof -ti:8000 | xargs kill -9  # Backend
lsof -ti:3000 | xargs kill -9  # Frontend
```

### "API_KEY not found"
```bash
# Check .env file exists in backend/
cat backend/.env | grep OPENAI_API_KEY
```

### "Module not found"
```bash
# Frontend
rm -rf node_modules && npm install

# Backend
pip install -r requirements.txt
```

## Next Steps

1. **Explore Docs**
   - [Installation Guide](./INSTALLATION.md) - Detailed setup
   - [Development Guide](./DEVELOPMENT.md) - Add features
   - [Architecture](./ARCHITECTURE.md) - System design
   - [Deployment](./DEPLOYMENT.md) - Production release

2. **Customize**
   - Change colors in `frontend/tailwind.config.js`
   - Update branding in header component
   - Modify AI model in `backend/app/config.py`

3. **Deploy**
   - Frontend → Vercel
   - Backend → Render or Railway
   - See [Deployment Guide](./DEPLOYMENT.md)

## API Endpoints

### Conversations
- `POST /api/conversations` - New chat
- `GET /api/conversations` - List chats
- `GET /api/conversations/{id}` - Get chat
- `PATCH /api/conversations/{id}` - Rename
- `DELETE /api/conversations/{id}` - Delete

### Chat
- `POST /api/chat/completions` - Get response
- `POST /api/chat/completions/stream` - Stream response

### Health
- `GET /api/health` - Health check
- `GET /api/info` - API info

## Example Requests

### Create Conversation
```bash
curl -X POST http://localhost:8000/api/conversations \
  -H "Content-Type: application/json" \
  -d '{"title": "My Chat", "model": "gpt-4-turbo-preview"}'
```

### Send Message
```bash
curl -X POST http://localhost:8000/api/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "conversation_id": "123",
    "message": "Hello!"
  }'
```

## Resources

- **OpenAI API**: https://platform.openai.com/docs
- **Next.js**: https://nextjs.org/docs
- **FastAPI**: https://fastapi.tiangolo.com
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://github.com/pmndrs/zustand

## Support

- 📖 Read the docs
- 🐛 Check browser console (F12)
- 📋 Review server logs
- ⚙️ Verify environment variables

---

**Ready to chat with AI?** Let's go! 🚀
