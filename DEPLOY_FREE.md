# Free Deployment Guide

This guide covers multiple free hosting options to deploy your MGNREGA Dashboard.

## 🚀 Option 1: Railway (Recommended - Easiest)

Railway supports Docker Compose natively and offers $5 free credit monthly.

### Steps:

1. **Create Railway Account**
   - Go to https://railway.app/
   - Sign up with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Connect your repository (or push code to GitHub first)

3. **Configure Services**
   - Railway will detect `docker-compose.yml`
   - Add environment variables:
     ```
     DB_PASSWORD=<generate-strong-password>
     DATAGOV_KEY=<your-key>
     DATAGOV_RESOURCE_ID=<your-resource-id>
     INGEST_STATE=Uttar Pradesh
     NEXT_PUBLIC_API_URL=https://your-api.railway.app
     ```

4. **Deploy**
   - Railway will build and deploy automatically
   - You'll get URLs like:
     - Frontend: `https://your-project.railway.app`
     - API: `https://your-api.railway.app`

5. **Post-Deployment**
   - Load districts: Connect to database and run SQL
   - Run initial data ingestion

**Cost**: Free tier: $5/month credit (usually enough for small apps)

---

## 🌐 Option 2: Render (Good Free Tier)

Render offers free PostgreSQL and free web services.

### Steps:

1. **Create Render Account**
   - Go to https://render.com/
   - Sign up with GitHub

2. **Deploy Database**
   - Click "New +" → "PostgreSQL"
   - Create free PostgreSQL database
   - Note the connection string

3. **Deploy Backend**
   - Click "New +" → "Web Service"
   - Connect your GitHub repo
   - Build command: `cd backend && pip install -r requirements.txt`
   - Start command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Add environment variables:
     ```
     DATABASE_URL=<postgres-connection-string>
     DATAGOV_KEY=<your-key>
     DATAGOV_RESOURCE_ID=<your-resource-id>
     ```

4. **Deploy Frontend**
   - Click "New +" → "Static Site" (or Web Service)
   - Build command: `cd frontend && npm install && npm run build`
   - Publish directory: `frontend/.next`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-backend.onrender.com
     ```

5. **Deploy Redis** (optional, for worker)
   - Click "New +" → "Redis"
   - Free tier available

**Cost**: Free tier with limitations (services spin down after 15 min inactivity)

---

## ✈️ Option 3: Fly.io (Good for Docker)

Fly.io offers free tier with generous limits.

### Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create Fly.toml**
   - Run `fly launch` in project root
   - It will detect your Docker setup

3. **Deploy**
   ```bash
   fly deploy
   ```

4. **Set Environment Variables**
   ```bash
   fly secrets set DB_PASSWORD=<password>
   fly secrets set DATAGOV_KEY=<key>
   fly secrets set DATAGOV_RESOURCE_ID=<id>
   ```

**Cost**: Free tier: 3 shared VMs, 160GB outbound transfer/month

---

## 🔥 Option 4: Vercel (Frontend) + Railway/Render (Backend)

Best performance: Vercel for frontend, Railway/Render for backend.

### Steps:

**Deploy Frontend on Vercel:**
1. Go to https://vercel.com/
2. Import your GitHub repository
3. Root directory: `frontend`
4. Build command: `npm install && npm run build`
5. Add environment variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url
   ```

**Deploy Backend on Railway:**
- Follow Railway steps above for backend services only

---

## 📦 Quick Setup Script for Railway

I'll create a `railway.json` configuration file for you:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "DOCKERFILE",
    "dockerfilePath": "docker-compose.yml"
  },
  "deploy": {
    "startCommand": "docker-compose up",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

---

## 🔧 Alternative: Split Deployment (More Free Options)

### Frontend: Vercel/Netlify/Cloudflare Pages (FREE)
- Deploy `frontend` directory
- All have excellent free tiers
- Automatic SSL
- CDN included

### Backend + DB: Railway/Render (FREE tiers)
- Deploy backend API
- Use their managed PostgreSQL
- Use their managed Redis

---

## 📝 Deployment Checklist

Before deploying:

- [ ] Push code to GitHub
- [ ] Get data.gov.in API key
- [ ] Prepare environment variables
- [ ] Test locally first
- [ ] Remove `.env` from git (already in .gitignore)
- [ ] Prepare database initialization scripts

---

## 🎯 Recommended Approach

**For quickest deployment**: Use Railway:
1. Sign up at railway.app
2. Connect GitHub repo
3. Add environment variables
4. Deploy - it handles everything automatically

**For maximum free resources**: Split deployment:
1. Frontend → Vercel (FREE, unlimited)
2. Backend → Railway ($5/month credit)
3. Database → Railway PostgreSQL (included)

---

## 🔗 Quick Links

- **Railway**: https://railway.app/
- **Render**: https://render.com/
- **Fly.io**: https://fly.io/
- **Vercel**: https://vercel.com/
- **Cloudflare Pages**: https://pages.cloudflare.com/

---

## 💡 Tips for Free Tiers

1. **Database**: Use managed PostgreSQL (Railway/Render) instead of Docker
2. **Redis**: Only needed for Celery worker; can use in-memory for simple deployments
3. **Worker**: Can run ingestion manually instead of scheduled worker
4. **Frontend**: Vercel/Netlify are completely free and excellent for Next.js
5. **Backend**: Railway or Render free tiers work well

---

## 🆘 Need Help?

If you encounter issues:
1. Check platform-specific logs
2. Verify environment variables are set
3. Test API endpoints separately
4. Check database connections

