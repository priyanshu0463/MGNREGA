# Railway Deployment Steps - Step by Step

## 🎯 Current Issue

Railway can't detect what to build because root directory has mixed files.

## ✅ Fix: Deploy Services Separately with Root Directories

### Step 1: Deploy Backend

1. **In Railway Dashboard:**
   - Your Project → **"+ New"** → **"GitHub Repo"**
   - Select your repository

2. **Configure Backend Service:**
   - Service Name: `mgnrega-api` (or any name)
   
3. **Settings Tab:**
   - Scroll to **"Source"** section
   - **Root Directory**: `backend` ⚠️ **IMPORTANT!**
   - **Build Command**: (leave empty, or: `pip install -r requirements.txt`)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

4. **Variables Tab:**
   - Add environment variables:
     ```
     DATABASE_URL=postgresql://postgres:PASSWORD@HOST:PORT/railway
     DATAGOV_KEY=your_key
     DATAGOV_RESOURCE_ID=resource_id
     INGEST_STATE=Uttar Pradesh
     PORT=8000
     ```
   - Or connect to Railway's PostgreSQL service (easier)

5. **Add PostgreSQL (if not exists):**
   - Railway → "+ New" → "Database" → "PostgreSQL"
   - Copy connection string
   - Use as `DATABASE_URL`

6. **Deploy:**
   - Railway will auto-deploy
   - Wait for build to complete
   - Check logs if errors

### Step 2: Deploy Frontend

1. **In Railway Dashboard:**
   - Same project → **"+ New"** → **"GitHub Repo"**
   - Select same repository

2. **Configure Frontend Service:**
   - Service Name: `mgnrega-frontend`
   
3. **Settings Tab:**
   - **Root Directory**: `frontend` ⚠️ **IMPORTANT!**
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`

4. **Variables Tab:**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app
   PORT=3000
   ```
   *(Use the URL from your backend service)*

5. **Deploy:**
   - Railway will build and deploy

### Step 3: Verify

- Backend URL: `https://mgnrega-api.up.railway.app`
- Frontend URL: `https://mgnrega-frontend.up.railway.app`
- Test: Visit frontend URL
- Check: Connection status should show backend connected

## 🔍 Finding Root Directory Setting

**In Railway Service Settings:**
1. Click on service
2. Click **"Settings"** tab
3. Scroll down to **"Source"** section
4. Look for **"Root Directory"** or **"Working Directory"**
5. Change from empty/`./` to `backend` or `frontend`

## 📸 Visual Guide

```
Railway Service Settings:
├── Settings
│   ├── Source
│   │   ├── Root Directory: [backend] ← Set this!
│   │   ├── Build Command: [optional]
│   │   └── Start Command: [uvicorn app.main:app ...]
│   └── Variables
│       └── Add environment variables
```

## ⚠️ Important Notes

- **Root Directory is KEY** - Railway must know which folder to build
- **Backend**: Root = `backend`, Start = `uvicorn ...`
- **Frontend**: Root = `frontend`, Start = `npm start`
- **Separate services** - Deploy as two separate services

---

**Set Root Directory correctly and Railway will build successfully!** ✅

