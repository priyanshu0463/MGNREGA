# Fix Railway Backend Deployment Error

Railway can't detect what to build because it's looking at the root directory with mixed files.

## 🚨 The Problem

Railway sees:
- `backend/` folder
- `frontend/` folder  
- `docker-compose.yml`
- Many markdown files

It doesn't know which service to build.

## ✅ Solution: Set Root Directory in Railway

### For Backend Service:

1. **In Railway Dashboard:**
   - Go to your project
   - Click on the service that's failing (or create new one)

2. **Go to Settings:**
   - Click **"Settings"** tab
   - Find **"Source"** section

3. **Set Root Directory:**
   - Look for **"Root Directory"** or **"Working Directory"**
   - Set it to: `backend`
   - Save changes

4. **Set Start Command:**
   - In **"Deploy"** settings
   - Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables:**
   - Go to **"Variables"** tab
   - Add:
     ```
     DATABASE_URL=postgresql://...
     DATAGOV_KEY=...
     DATAGOV_RESOURCE_ID=...
     INGEST_STATE=Uttar Pradesh
     PORT=8000
     ```

6. **Redeploy:**
   - Railway should automatically redeploy
   - Or click **"Redeploy"**

### Alternative: Use Dockerfile (if Root Directory doesn't work)

If Railway still can't detect:

1. Make sure `backend/Dockerfile` exists (it does)
2. In Railway settings, specify:
   - **Builder**: Docker
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Build Context**: `.`

## 📝 Quick Checklist

For Backend:
- [ ] Root Directory set to: `backend`
- [ ] Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Environment variables set
- [ ] Service redeployed

For Frontend (separate service):
- [ ] Root Directory set to: `frontend`
- [ ] Build Command: `npm install && npm run build`
- [ ] Start Command: `npm start`
- [ ] NEXT_PUBLIC_API_URL set to backend URL

---

**Set Root Directory = `backend` and it should work!** ✅

