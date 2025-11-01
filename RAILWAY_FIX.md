# Railway Fix - Use Individual Services Instead of Docker Compose

## ❌ Problem

Railway doesn't fully support docker-compose.yml. The errors show:
- "Unsupported config option for services"
- "Unsupported config option for volumes"

## ✅ Solution: Deploy Services Individually

Railway works best when you deploy each service as a separate service, not via docker-compose.

## 🚀 Quick Fix (10 minutes)

### Option 1: Deploy Individual Services (Recommended)

1. **Add PostgreSQL Database:**
   - Railway → Your Project → "+ New" → "Database" → "PostgreSQL"
   - Copy the connection string from Variables tab

2. **Deploy Backend:**
   - "+ New" → "GitHub Repo" → Select your repo
   - **Settings:**
     - Root Directory: `backend`
     - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Variables:**
     ```
     DATABASE_URL=<postgres-connection-string>
     DATAGOV_KEY=<your-key>
     DATAGOV_RESOURCE_ID=<resource-id>
     INGEST_STATE=Uttar Pradesh
     ```

3. **Deploy Frontend:**
   - "+ New" → "GitHub Repo" → Select your repo
   - **Settings:**
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Start Command: `npm start`
   - **Variables:**
     ```
     NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app
     ```

### Option 2: Remove docker-compose.yml for Railway

If you want to keep using Railway with the repo:

1. **Create `.railwayignore` or rename docker-compose.yml:**
   ```bash
   mv docker-compose.yml docker-compose.yml.local
   ```

2. **Deploy services individually** (as above)

## 📋 What Railway Expects

Railway expects:
- Individual services with Dockerfiles OR
- Services with build/start commands
- NOT docker-compose.yml (limited support)

## 🎯 Recommended Structure for Railway

```
Your Repo
├── backend/
│   ├── Dockerfile  ← Railway uses this
│   └── app/
├── frontend/
│   ├── Dockerfile  ← Railway uses this
│   └── ...
└── (no docker-compose.yml at root, or rename it)
```

## ✅ Quick Steps Right Now

1. **In Railway Dashboard:**
   - Delete/redeploy services individually
   - OR rename docker-compose.yml temporarily

2. **Add each service separately:**
   - Backend → Root: `backend`
   - Frontend → Root: `frontend`
   - Database → Use Railway's PostgreSQL

3. **Set environment variables** for each service

4. **Get your URLs:**
   - Each service gets its own URL
   - Frontend uses Backend URL for API calls

---

**This will fix all Railway errors!** 🚀

