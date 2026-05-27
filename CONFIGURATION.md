# OEDX AI - Configuration Reference

Complete reference for configuring OEDX AI for different environments.

## Environment Variables

### Backend Configuration

#### Core Settings
```env
# Application
PROJECT_NAME=OEDX AI
VERSION=1.0.0
DEBUG=False

# Server
HOST=0.0.0.0
PORT=8000
LOG_LEVEL=INFO
```

#### OpenAI Configuration
```env
# OpenAI API
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview
OPENAI_BASE_URL=https://api.openai.com/v1
```

Models available:
- `gpt-4-turbo-preview` (Recommended for complex tasks)
- `gpt-4` (Full model)
- `gpt-3.5-turbo` (Fast and economical)

#### Database
```env
# SQLite (Development)
DATABASE_URL=sqlite:///./oedx_ai.db

# PostgreSQL (Production)
DATABASE_URL=postgresql://user:password@localhost:5432/oedx_ai
```

#### CORS & Origins
```env
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000

# Multiple origins (space-separated in config)
ALLOWED_ORIGINS=["http://localhost:3000", "https://yourdomain.com"]
```

#### File Upload
```env
MAX_UPLOAD_SIZE=10485760  # 10MB in bytes
UPLOAD_DIR=uploads
```

### Frontend Configuration

#### API
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

#### App Info
```env
NEXT_PUBLIC_APP_NAME=OEDX AI
NEXT_PUBLIC_VERSION=1.0.0
```

## Environment Profiles

### Development Environment

**backend/.env**
```env
# Development Settings
DEBUG=True
LOG_LEVEL=DEBUG
HOST=0.0.0.0
PORT=8000

# Development Database
DATABASE_URL=sqlite:///./oedx_ai.db

# Development OpenAI
OPENAI_API_KEY=sk-proj-your-dev-key
OPENAI_MODEL=gpt-3.5-turbo

# Development URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:8000
ALLOWED_ORIGINS=["http://localhost:3000", "http://127.0.0.1:3000"]
```

**frontend/.env.local**
```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
NEXT_PUBLIC_APP_NAME=OEDX AI (Dev)
NEXT_PUBLIC_VERSION=1.0.0-dev
```

### Staging Environment

**backend/.env**
```env
# Staging Settings
DEBUG=False
LOG_LEVEL=INFO
HOST=0.0.0.0
PORT=8000

# Staging Database
DATABASE_URL=postgresql://user:pass@staging-db:5432/oedx_ai_staging

# Staging OpenAI
OPENAI_API_KEY=sk-proj-your-staging-key
OPENAI_MODEL=gpt-4-turbo-preview

# Staging URLs
FRONTEND_URL=https://staging.oedxai.com
BACKEND_URL=https://api-staging.oedxai.com
ALLOWED_ORIGINS=[
  "https://staging.oedxai.com",
  "https://www.staging.oedxai.com"
]
```

### Production Environment

**backend/.env** (via environment variables)
```env
# Production Settings
DEBUG=False
LOG_LEVEL=WARN
HOST=0.0.0.0
PORT=8000

# Production Database
DATABASE_URL=postgresql://user:pass@prod-db-url:5432/oedx_ai

# Production OpenAI
OPENAI_API_KEY=sk-proj-your-prod-key
OPENAI_MODEL=gpt-4-turbo-preview

# Production URLs
FRONTEND_URL=https://oedxai.com
BACKEND_URL=https://api.oedxai.com
ALLOWED_ORIGINS=[
  "https://oedxai.com",
  "https://www.oedxai.com"
]
```

**frontend/.env.production** (via Vercel dashboard)
```env
NEXT_PUBLIC_API_BASE_URL=https://api.oedxai.com
NEXT_PUBLIC_APP_NAME=OEDX AI
NEXT_PUBLIC_VERSION=1.0.0
```

## OpenAI API Configuration

### Rate Limits by Model

| Model | RPM | TPM |
|-------|-----|-----|
| gpt-4-turbo-preview | 200 | 40,000 |
| gpt-4 | 200 | 40,000 |
| gpt-3.5-turbo | 3,500 | 90,000 |

### Cost Optimization

```env
# For development/testing
OPENAI_MODEL=gpt-3.5-turbo

# For production (higher quality)
OPENAI_MODEL=gpt-4-turbo-preview

# For cost-sensitive (with fallback)
OPENAI_MODEL=gpt-3.5-turbo
# Implement fallback to gpt-4 for complex queries
```

### Temperature Settings

```python
# More deterministic (consistent responses)
temperature = 0.0  # For factual Q&A

# Balanced (recommended)
temperature = 0.7  # For most use cases

# More creative (varied responses)
temperature = 1.0  # For creative writing
```

## Database Configuration

### SQLite (Development)

```env
DATABASE_URL=sqlite:///./oedx_ai.db
```

Pros:
- No setup required
- File-based storage
- Good for development

Cons:
- Limited concurrency
- Not for production

### PostgreSQL (Production)

```env
DATABASE_URL=postgresql://username:password@host:5432/database_name
```

Connection string format:
```
postgresql://user:password@hostname:port/database
```

Example:
```env
DATABASE_URL=postgresql://oedx_user:SecurePassword123@prod-db.render.com:5432/oedx_ai
```

### Connection Pooling

For production, consider connection pooling:

```python
# backend/app/db/session.py
from sqlalchemy.pool import QueuePool

engine = create_async_engine(
    DATABASE_URL,
    echo=False,
    poolclass=QueuePool,
    pool_size=20,
    max_overflow=0,
)
```

## Logging Configuration

### Log Levels

```env
# Production
LOG_LEVEL=WARN    # Only warnings and errors

# Staging
LOG_LEVEL=INFO    # Normal operation info

# Development
LOG_LEVEL=DEBUG   # Detailed debugging info
```

### Log Files

```python
# backend/app/utils/__init__.py
import logging
from logging.handlers import RotatingFileHandler

handler = RotatingFileHandler(
    'app.log',
    maxBytes=10485760,  # 10MB
    backupCount=10,
)
```

## CORS Configuration

### Local Development
```python
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
]
```

### Production
```python
ALLOWED_ORIGINS = [
    "https://oedxai.com",
    "https://www.oedxai.com",
]
```

### Security Considerations
- Never use `*` in production
- Specify exact origins
- Use HTTPS for all origins
- Validate origin headers

## File Upload Configuration

```env
# Maximum file size (10MB)
MAX_UPLOAD_SIZE=10485760

# Upload directory
UPLOAD_DIR=uploads

# File types allowed (implement in backend)
ALLOWED_EXTENSIONS=["txt", "pdf", "doc", "docx"]
```

## Performance Tuning

### Backend Optimization

```python
# Reduce database queries
enable_query_logging = False

# Connection pooling
pool_size = 20
max_overflow = 5

# Caching
cache_ttl = 300  # 5 minutes
```

### Frontend Optimization

```javascript
// Next.js config
export const nextConfig = {
  // Enable compression
  compress: true,
  
  // Image optimization
  images: {
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable SWR caching
  swr: {
    dedupingInterval: 60000,
  },
};
```

## Docker Environment

### docker-compose.yml Variables

```yaml
environment:
  # Backend
  - OPENAI_API_KEY=${OPENAI_API_KEY}
  - DATABASE_URL=postgresql://user:password@postgres:5432/oedx_ai
  
  # Frontend
  - NEXT_PUBLIC_API_BASE_URL=http://backend:8000
```

### .env for Docker

```env
# Docker-specific settings
OPENAI_API_KEY=sk-proj-your-key
POSTGRES_USER=oedx_user
POSTGRES_PASSWORD=SecurePassword123
POSTGRES_DB=oedx_ai
```

## Validation Checklist

Before deploying, verify:

### Backend
- [ ] `OPENAI_API_KEY` is set and valid
- [ ] `DATABASE_URL` is accessible
- [ ] `FRONTEND_URL` is correct
- [ ] `LOG_LEVEL` is appropriate
- [ ] `MAX_UPLOAD_SIZE` is reasonable
- [ ] `ALLOWED_ORIGINS` includes frontend URL

### Frontend
- [ ] `NEXT_PUBLIC_API_BASE_URL` points to backend
- [ ] Build succeeds: `npm run build`
- [ ] No console errors: `npm run lint`
- [ ] Environment variables are public-safe

## Secrets Management

### Local Development
Use `.env` files (git-ignored)

### Production (Vercel)
- Vercel Dashboard → Settings → Environment Variables
- Use `NEXT_PUBLIC_` prefix for client-side only

### Production (Render)
- Render Dashboard → Environment
- Store in encrypted environment variables

### Best Practices
- Never commit `.env` files
- Rotate keys regularly
- Use different keys per environment
- Implement secrets rotation

---

**Configuration Complete!** 🎯
