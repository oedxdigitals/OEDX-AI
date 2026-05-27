# OEDX AI - Deployment Guide

Complete guide for deploying OEDX AI to production.

## Deployment Architecture

```
┌─────────────────────────┐
│   Frontend (Vercel)     │
│   Next.js 15            │
└────────────┬────────────┘
             │ API Calls
             │
             ▼
┌──────────────────────────────┐
│  Backend (Render/Railway)    │
│  Python FastAPI              │
└────────────┬─────────────────┘
             │
             ▼
      ┌─────────────┐
      │  Database   │
      │  PostgreSQL │
      └─────────────┘
```

## Frontend Deployment (Vercel)

### 1. Prepare Repository

```bash
cd frontend

# Ensure no local env files are committed
echo ".env.local" >> .gitignore

# Test build locally
npm run build
npm run start
```

### 2. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push -u origin main
```

### 3. Deploy on Vercel

1. Go to https://vercel.com
2. Click "New Project"
3. Import your repository
4. Configure:
   - Framework: Next.js
   - Root Directory: ./frontend
   - Build Command: `npm run build`
   - Start Command: `npm run start`

### 4. Add Environment Variables

In Vercel dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_API_BASE_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_NAME=OEDX AI
NEXT_PUBLIC_VERSION=1.0.0
```

### 5. Deploy

Click "Deploy" and wait for completion.

Your frontend is now live at: `https://your-vercel-url.vercel.app`

## Backend Deployment (Render)

### 1. Prepare Backend

```bash
cd backend

# Create runtime.txt for Python version
echo "python-3.11.6" > runtime.txt

# Ensure requirements.txt is up to date
pip freeze > requirements.txt
```

### 2. Update Configuration

Update `backend/app/config.py`:

```python
# Allow production domain
ALLOWED_ORIGINS = [
    "https://your-vercel-url.vercel.app",
    "https://yourdomain.com",
]
```

### 3. Create Procfile

```bash
# In backend/ directory
echo "web: uvicorn app.main:app --host 0.0.0.0 --port $PORT" > Procfile
```

### 4. Deploy on Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Configure:
   - Name: `oedx-ai-backend`
   - Root Directory: `backend`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

### 5. Add Environment Variables

In Render dashboard → Environment:

```
BACKEND_URL=https://your-render-url.onrender.com
FRONTEND_URL=https://your-vercel-url.vercel.app
OPENAI_API_KEY=sk-your-production-key
OPENAI_MODEL=gpt-4-turbo-preview
DATABASE_URL=postgresql://user:password@host:5432/oedx_ai
LOG_LEVEL=INFO
```

### 6. Deploy

Click "Deploy" and monitor logs.

Your backend is now live at: `https://your-render-url.onrender.app`

## Database Setup (PostgreSQL on Render)

### 1. Create PostgreSQL Database

1. In Render dashboard → "New +" → "PostgreSQL"
2. Configure:
   - Name: `oedx-ai-db`
   - PostgreSQL Version: 15
   - Region: Same as your backend service

### 2. Update Backend Configuration

Get connection string from Render PostgreSQL dashboard and update:

```
DATABASE_URL=postgresql://user:password@host:5432/oedx_ai
```

### 3. Redeploy Backend

Backend will automatically create tables on first run.

## Domain Setup

### 1. Purchase Domain

Use Vercel Domains or external provider (GoDaddy, Namecheap, etc.)

### 2. Configure DNS

#### For Vercel (Frontend)
- Add domain in Vercel → Settings → Domains
- Follow Vercel's DNS setup instructions

#### For Render (Backend)
- In Render → Settings → Custom Domain
- Add DNS records for subdomain (e.g., api.yourdomain.com)

### 3. SSL/TLS Certificates

Both Vercel and Render provide free SSL certificates.

## Environment Variables Checklist

### Frontend (Vercel)
- [ ] `NEXT_PUBLIC_API_BASE_URL` = Backend URL
- [ ] `NEXT_PUBLIC_APP_NAME` = OEDX AI
- [ ] `NEXT_PUBLIC_VERSION` = 1.0.0

### Backend (Render)
- [ ] `OPENAI_API_KEY` = Production key
- [ ] `DATABASE_URL` = PostgreSQL connection string
- [ ] `FRONTEND_URL` = Frontend URL
- [ ] `LOG_LEVEL` = INFO (or DEBUG for development)

## Post-Deployment

### 1. Verify Deployment

```bash
# Test frontend
curl -I https://your-vercel-url.vercel.app

# Test backend
curl https://your-render-url.onrender.app/api/health

# Test API
curl https://your-render-url.onrender.app/api/info
```

### 2. Monitor

Set up monitoring:
- Vercel Analytics
- Render Monitoring
- OpenAI API Usage

### 3. Logging

View logs:
- Frontend: Vercel → Deployments → Logs
- Backend: Render → Logs

### 4. Performance

- Enable caching in Vercel
- Optimize database queries
- Monitor API response times

## Scaling Considerations

### Horizontal Scaling
- Vercel automatically scales frontend
- Render can scale backend with multiple instances

### Vertical Scaling
- Increase Render plan for more RAM/CPU
- Monitor database connections

### Optimization
- Enable gzip compression
- Minimize bundle size
- Cache API responses
- Use CDN for static assets

## Backup & Recovery

### Database Backups

Render PostgreSQL includes:
- Daily automated backups (7-day retention)
- Manual backup creation
- Point-in-time recovery

### Application Backups
- GitHub automatically backs up code
- Keep separate backup of production secrets

## Cost Estimation

### Monthly Costs (Approximate)

| Service | Price | Notes |
|---------|-------|-------|
| Vercel (Frontend) | $20 | Pro plan with analytics |
| Render (Backend) | $30 | Standard instance |
| Render (Database) | $15 | PostgreSQL standard |
| Domain | $12 | Annual domain cost |
| OpenAI API | $5-50+ | Based on usage |
| **Total** | **$82-112+** | Per month |

## Troubleshooting

### 502 Bad Gateway
- Check backend service status
- Review backend logs
- Verify environment variables

### Slow Performance
- Check database query performance
- Monitor API response times
- Review Vercel analytics

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database service is running
- Ensure IP whitelist is configured

## Maintenance

### Regular Tasks
- Monitor logs daily
- Check error rates
- Review API usage
- Update dependencies monthly

### Security
- Rotate API keys quarterly
- Enable 2FA on Vercel/Render
- Keep dependencies updated
- Regular security audits

## Rollback Plan

If deployment fails:

1. **Frontend**: Vercel automatically keeps previous deployments
   - Revert in Vercel → Deployments

2. **Backend**: Git history preserved
   - Revert commit and redeploy
   - Or use Render's previous builds

---

**Deployment Complete!** Your OEDX AI is now live! 🚀
