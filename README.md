# OEDX AI - Advanced Chat Platform

A production-grade AI chat platform with real-time streaming, markdown rendering, and persistent chat history.

## 🚀 Features

- **Real-time Streaming**: Token-by-token streaming responses from OpenAI
- **Modern UI**: Dark futuristic design with Tailwind CSS and Framer Motion animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Chat Management**: Create, rename, archive, and delete conversations
- **Message Features**:
  - Markdown rendering with syntax highlighting
  - Copy message functionality
  - Auto-scroll to latest message
  - Typing animations
- **Persistent Storage**: SQLite database for chat history
- **Production Architecture**: Clean, modular, scalable codebase

## 📋 Tech Stack

### Frontend
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand (State Management)
- React Markdown

### Backend
- Python FastAPI
- Uvicorn
- SQLAlchemy + AsyncIO
- OpenAI API Integration
- WebSocket Support

## 🛠️ Prerequisites

- Node.js 18+ & npm
- Python 3.10+
- OpenAI API Key

## 📦 Installation

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Edit .env with your OpenAI API key
# OPENAI_API_KEY=your_key_here
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# The frontend should be able to reach the backend at http://localhost:8000
```

## 🚀 Running the Application

### Backend

```bash
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
python run.py
```

Backend runs on: `http://localhost:8000`
API Docs: `http://localhost:8000/docs`

### Frontend

```bash
cd frontend
npm run dev
```

Frontend runs on: `http://localhost:3000`

## 📚 API Endpoints

### Health & Info
- `GET /api/health` - Health check
- `GET /api/info` - API information

### Conversations
- `POST /api/conversations` - Create new conversation
- `GET /api/conversations` - List conversations
- `GET /api/conversations/{id}` - Get conversation with messages
- `PATCH /api/conversations/{id}` - Update conversation
- `DELETE /api/conversations/{id}` - Delete conversation
- `POST /api/conversations/{id}/archive` - Archive conversation

### Chat
- `POST /api/chat/completions` - Get non-streaming completion
- `POST /api/chat/completions/stream` - Stream completion (Server-Sent Events)

## 🐳 Docker Support

### Build and Run with Docker

```bash
# From root directory

# Build backend
docker build -f docker/Dockerfile.backend -t oedx-ai-backend .

# Build frontend
docker build -f docker/Dockerfile.frontend -t oedx-ai-frontend .

# Run with Docker Compose
docker-compose -f docker-compose.yml up
```

## 🔧 Environment Variables

### Backend (.env)
```
BACKEND_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
OPENAI_API_KEY=your_key_here
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_URL=sqlite:///./oedx_ai.db
LOG_LEVEL=INFO
HOST=0.0.0.0
PORT=8000
```

### Frontend (.env.local)
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=OEDX AI
NEXT_PUBLIC_VERSION=1.0.0
```

## 📁 Project Structure

```
OedX Ai/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   ├── db/           # Database setup
│   │   ├── utils/        # Utilities
│   │   ├── config.py     # Configuration
│   │   └── main.py       # FastAPI app
│   ├── data/             # Data storage
│   ├── requirements.txt
│   ├── run.py           # Entry point
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── app/          # Next.js pages
│   │   ├── components/   # React components
│   │   ├── hooks/        # Custom hooks
│   │   ├── lib/          # Utilities
│   │   ├── stores/       # Zustand stores
│   │   ├── styles/       # CSS styles
│   │   └── types/        # TypeScript types
│   ├── public/           # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   └── .env.local
│
├── docs/                 # Documentation
└── docker/              # Docker files
```

## 🎨 UI/UX Highlights

- **Dark Theme**: Black background with purple and cyan accents
- **Smooth Animations**: Framer Motion for fluid transitions
- **Responsive Layout**: Mobile-first design
- **AI Branding**: OEDX AI header with gradient effects
- **Accessibility**: Keyboard shortcuts and screen reader support

## ⌨️ Keyboard Shortcuts

- `Ctrl+Enter` / `Cmd+Enter` - Send message
- `Ctrl+/` - Open commands (planned)

## 🚀 Deployment

### Vercel (Frontend)
```bash
cd frontend
npm run build
# Deploy to Vercel
```

### Render or Railway (Backend)
```bash
# Push to GitHub
git push

# Connect to Render/Railway
# Set environment variables
# Deploy
```

## 📊 Performance Optimizations

- Lazy loading of conversations
- Message virtualization (for large histories)
- Optimized re-renders with Zustand
- CSS-in-JS bundling
- Image optimization

## 🐛 Troubleshooting

### Backend won't start
- Ensure Python 3.10+ is installed
- Check virtual environment activation
- Verify dependencies: `pip install -r requirements.txt`

### Frontend build fails
- Clear `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check Node.js version: `node --version` (should be 18+)

### API connection issues
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_BASE_URL in frontend .env.local
- Verify CORS settings in backend config

## 📝 Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint + Prettier for frontend
- Black formatting for backend
- Type hints for Python functions

### Adding New Features
1. Create backend endpoint first
2. Add TypeScript types in frontend
3. Implement API client method
4. Create React component
5. Integrate with Zustand store
6. Add tests

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit with clear messages
4. Push to your fork
5. Open a pull request

## 📄 License

MIT License - feel free to use for personal or commercial projects.

## 🆘 Support

- Issues: Create on GitHub
- Discussions: GitHub Discussions
- Email: support@oedxai.com

## 🎯 Roadmap

- [ ] User authentication
- [ ] File upload support
- [ ] Image generation
- [ ] Conversation search
- [ ] Custom model selection
- [ ] Conversation export (PDF, Markdown)
- [ ] Dark/Light theme toggle
- [ ] Plugin system
- [ ] Voice input/output
- [ ] Multi-language support

---

**OEDX AI** - Empowering conversations with advanced AI technology.
