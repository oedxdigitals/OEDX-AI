# OEDX AI - Development Guide

Complete guide for developing OEDX AI and contributing features.

## Development Environment Setup

### Prerequisites
- VS Code with extensions (see workspace file)
- Node.js 18+
- Python 3.10+
- Git

### Quick Setup
```bash
# Open workspace
code oedx-ai.code-workspace

# Or in terminal
code .
```

## Project Structure Overview

```
├── backend/          # Python FastAPI backend
│   ├── app/         # Main application
│   │   ├── api/     # Route handlers
│   │   ├── models/  # Database models
│   │   ├── schemas/ # Pydantic schemas
│   │   ├── services/# Business logic
│   │   └── db/      # Database config
│   ├── requirements.txt
│   ├── run.py
│   └── .env
│
├── frontend/         # Next.js frontend
│   ├── src/
│   │   ├── app/     # Pages
│   │   ├── components/ # React components
│   │   ├── hooks/   # Custom hooks
│   │   ├── lib/     # Utilities
│   │   ├── stores/  # Zustand stores
│   │   ├── types/   # TypeScript definitions
│   │   └── styles/  # CSS
│   ├── package.json
│   └── .env.local
│
├── docker/          # Docker files
├── docs/            # Documentation
├── README.md
├── INSTALLATION.md
├── DEPLOYMENT.md
└── ARCHITECTURE.md
```

## Adding a New Feature

### Example: Add Dark/Light Theme Toggle

#### Step 1: Add Backend API (Optional)
If you need to persist theme preference:

```python
# backend/app/api/settings.py
@router.post("/settings/theme")
async def set_theme(theme: str, db: AsyncSession = Depends(get_db)):
    # Save theme preference
    return {"theme": theme}
```

#### Step 2: Create Frontend Types
```typescript
// frontend/src/types/index.ts
export interface ThemeSettings {
  mode: 'dark' | 'light';
  accentColor: 'purple' | 'cyan' | 'pink';
}
```

#### Step 3: Add Zustand Store
```typescript
// frontend/src/stores/themeStore.ts
import { create } from 'zustand';
import { ThemeSettings } from '@/types';

interface ThemeStore {
  theme: ThemeSettings;
  setTheme: (theme: ThemeSettings) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: { mode: 'dark', accentColor: 'purple' },
  setTheme: (theme) => set({ theme }),
}));
```

#### Step 4: Create Component
```typescript
// frontend/src/components/common/ThemeToggle.tsx
'use client';
import { useThemeStore } from '@/stores/themeStore';

export const ThemeToggle: React.FC = () => {
  const { theme, setTheme } = useThemeStore();

  const toggleTheme = () => {
    setTheme({
      ...theme,
      mode: theme.mode === 'dark' ? 'light' : 'dark',
    });
  };

  return (
    <button onClick={toggleTheme}>
      {theme.mode === 'dark' ? '🌙' : '☀️'}
    </button>
  );
};
```

#### Step 5: Integrate into Layout
```typescript
// frontend/src/app/layout.tsx
import { ThemeToggle } from '@/components/common/ThemeToggle';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
```

#### Step 6: Update Styles
```css
/* frontend/src/styles/globals.css */
[data-theme='light'] {
  --background: #ffffff;
  --text: #000000;
}

[data-theme='dark'] {
  --background: #030712;
  --text: #f3f4f6;
}
```

#### Step 7: Test Locally
```bash
# Frontend
npm run dev

# Test in browser at http://localhost:3000
```

#### Step 8: Commit & Push
```bash
git add .
git commit -m "feat: add dark/light theme toggle"
git push
```

## Code Styles & Standards

### TypeScript Frontend
- Use strict mode
- Type all function parameters
- Export types in barrel files
- Use const for functions
- Prefer functional components

```typescript
// Good
export const MyComponent: React.FC<Props> = ({ title }) => {
  return <div>{title}</div>;
};

// Bad
export function MyComponent(props) {
  return <div>{props.title}</div>;
}
```

### Python Backend
- Use type hints
- Follow PEP 8
- Use async/await
- Separate concerns (models, schemas, services)

```python
# Good
async def get_conversation(
    db: AsyncSession,
    conversation_id: str,
) -> Optional[Conversation]:
    return await ConversationService.get_conversation(db, conversation_id)

# Bad
def get_conversation(db, id):
    return db.query(Conversation).filter_by(id=id).first()
```

## Testing

### Frontend Testing
```bash
# Run tests
npm test

# With coverage
npm test -- --coverage
```

### Backend Testing
```bash
# Install testing dependencies
pip install pytest pytest-asyncio httpx

# Run tests
pytest

# With coverage
pytest --cov=app
```

## Debugging

### Frontend Debugging
1. Open DevTools: F12 or Cmd+Option+I
2. Check Console for errors
3. Use VS Code debugger with launch config
4. React DevTools extension

### Backend Debugging
1. Check logs: `tail -f backend.log`
2. Use VS Code Python debugger
3. Add breakpoints in code
4. Check database with sqlite3

## Database Migrations

### Adding a New Table
```python
# backend/app/models/database.py
class NewModel(Base):
    __tablename__ = "new_table"
    
    id = Column(String, primary_key=True)
    # ... fields

# Then restart backend - tables auto-created
```

## API Changes

### Adding New Endpoint
```python
# backend/app/api/new_route.py
from fastapi import APIRouter

router = APIRouter(prefix="/api/new", tags=["new"])

@router.get("", response_model=List[Response])
async def get_items():
    return []

# In backend/app/main.py
app.include_router(new_route.router)
```

### Updating Schemas
```typescript
// frontend/src/types/index.ts
export interface NewResponse {
  id: string;
  // Add new fields
}

// frontend/src/lib/api.ts
async function getNewItems() {
  return this.client.get("/api/new") as NewResponse[];
}
```

## Performance Profiling

### Frontend
```bash
npm run build
npm run start

# Open Chrome DevTools → Performance tab
# Click record, interact with app, click stop
```

### Backend
```python
# Add profiling middleware
import cProfile
from contextlib import asynccontextmanager

@asynccontextmanager
async def profile_request(request):
    profiler = cProfile.Profile()
    profiler.enable()
    yield
    profiler.disable()
    profiler.print_stats()
```

## Logging

### Frontend
```typescript
// Use console for development
console.log('Debug:', data);
console.error('Error:', error);

// Use toast for users
showToast.error('User-friendly message');
```

### Backend
```python
import logging
logger = logging.getLogger(__name__)

logger.info("Info message")
logger.error("Error message")
logger.debug("Debug message")
```

## Git Workflow

### Branch Strategy
```bash
# Create feature branch
git checkout -b feature/theme-toggle

# Make changes and test
git add .
git commit -m "feat: add theme toggle"

# Push to origin
git push origin feature/theme-toggle

# Create Pull Request on GitHub
```

### Commit Messages
```
feat: add new feature
fix: fix bug
refactor: reorganize code
docs: update documentation
style: format code
test: add tests
chore: update dependencies
```

## Common Tasks

### Run Both Frontend and Backend
```bash
# Terminal 1
cd backend && python run.py

# Terminal 2
cd frontend && npm run dev

# Open http://localhost:3000
```

### Update Dependencies
```bash
# Frontend
npm update

# Backend
pip list --outdated
pip install --upgrade package_name
```

### Clean Build
```bash
# Frontend
rm -rf node_modules .next
npm install
npm run build

# Backend
rm -rf venv
python -m venv venv
pip install -r requirements.txt
```

## Troubleshooting Development

### Port Already in Use
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
lsof -ti:8000 | xargs kill -9
```

### Module Not Found
```bash
# Frontend
rm -rf node_modules package-lock.json
npm install

# Backend
pip install --upgrade -r requirements.txt
```

### Database Errors
```bash
# Reset database
rm backend/oedx_ai.db
python backend/run.py
```

## VS Code Extensions

Recommended for development:

1. **Python** - ms-python.python
2. **Pylance** - ms-python.vscode-pylance
3. **Prettier** - esbenp.prettier-vscode
4. **ESLint** - dbaeumer.vscode-eslint
5. **Tailwind CSS IntelliSense** - bradlc.vscode-tailwindcss
6. **Thunder Client** - Thunder Client.thunder-client
7. **GitHub Copilot** - GitHub.copilot
8. **GitLens** - eamodio.gitlens

## Performance Tips

### Frontend
- Use React.memo for expensive components
- Lazy load routes with dynamic imports
- Optimize images with next/image
- Use CSS modules for scoped styles
- Profile with React DevTools

### Backend
- Use async/await
- Connection pooling
- Query optimization
- Caching (Redis)
- Background tasks (Celery)

---

**Happy Developing!** 🚀
