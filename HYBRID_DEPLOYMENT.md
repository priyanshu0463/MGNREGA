# Hybrid Deployment Guide - Backend + Frontend with Fallback

This setup provides **resilience**: Backend (FastAPI) is primary, Frontend API routes are automatic fallback.

## 🎯 Architecture

```
User Request
    ↓
Frontend (Next.js)
    ↓
Try Backend API (FastAPI) ← Primary
    ↓ (if fails)
Frontend API Routes ← Fallback (automatic)
```

## ✨ Features

- ✅ **Backend Primary**: FastAPI handles all requests when available
- ✅ **Automatic Fallback**: Frontend API routes kick in if backend fails
- ✅ **Seamless**: User doesn't notice the switch
- ✅ **Resilient**: App works even if backend is down
- ✅ **Status Indicator**: Shows connection status

## 🚀 Deployment Options

### Option 1: Both on Railway (Recommended)

**Backend:**
1. Railway → "+ New" → "GitHub Repo"
2. Root Directory: `backend`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. Add PostgreSQL service
5. Set environment variables

**Frontend:**
1. Railway → "+ New" → "GitHub Repo" (same repo)
2. Root Directory: `frontend`
3. Build Command: `npm install && npm run build`
4. Start Command: `npm start`
5. Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-service.up.railway.app
   ```

### Option 2: Backend on Railway + Frontend on Vercel (Best Performance)

**Backend on Railway:**
- Deploy as above
- Get URL: `https://backend.up.railway.app`

**Frontend on Vercel:**
1. Vercel → Import GitHub repo
2. Root Directory: `frontend`
3. Environment Variable:
   ```
   NEXT_PUBLIC_API_URL=https://backend.up.railway.app
   ```
4. Deploy

### Option 3: Both on Vercel (Frontend Only Mode)

If you only deploy frontend to Vercel:
- Frontend API routes handle everything
- No backend needed
- Works completely standalone

## 🔧 How It Works

### Frontend API Client Logic:

1. **Tries Backend First:**
   ```typescript
   await backendApi.get('/districts')
   ```

2. **If Backend Fails:**
   - Network errors (ECONNREFUSED, ETIMEDOUT)
   - Server errors (5xx)
   - Automatically switches to frontend API routes

3. **Frontend Fallback:**
   ```typescript
   await frontendApi.get('/api/districts')
   ```

4. **User Sees:**
   - Green banner: "✓ Connected to backend API"
   - Yellow banner: "⚠️ Using fallback mode"

## 📝 Environment Variables

### Backend (Railway):
```
DATABASE_URL=postgresql://...
DATAGOV_KEY=...
DATAGOV_RESOURCE_ID=...
INGEST_STATE=Uttar Pradesh
```

### Frontend (Railway/Vercel):
```
NEXT_PUBLIC_API_URL=https://your-backend-url
```
*(If not set, defaults to http://localhost:8000 for local dev)*

## ✅ Benefits

1. **High Availability**: App works even if backend is down
2. **Better Performance**: Backend handles complex queries
3. **Offline Support**: Frontend API routes provide cached data
4. **Progressive Enhancement**: Start with backend, degrade gracefully
5. **Easy Testing**: Can test both modes independently

## 🔄 Update Strategy

- **Backend**: Update with real data from data.gov.in
- **Frontend Routes**: Keep sample data for fallback
- **Both**: Can be updated independently

## 📊 Status Indicators

Users see:
- **Green**: Backend connected (using real-time data)
- **Yellow**: Fallback mode (using cached/frontend data)

## 🎯 Current Setup

- ✅ Frontend tries backend first
- ✅ Automatic fallback to frontend API routes
- ✅ Connection status indicator
- ✅ Both can be deployed independently
- ✅ Works offline with frontend routes

---

**Best of both worlds: Real backend when available, resilient fallback when not!** 🚀

