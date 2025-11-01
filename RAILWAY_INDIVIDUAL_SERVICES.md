# Deploy Services Individually on Railway

Railway doesn't handle docker-compose.yml well. Deploy each service separately.

## 🎯 Recommended Approach: Individual Services

Instead of docker-compose, deploy each service as a separate Railway service.

## Step 1: Deploy PostgreSQL Database

1. In Railway → Your Project
2. Click **"+ New"** → **"Database"** → **"Add PostgreSQL"**
3. Railway creates it automatically
4. Copy the **Connection String** from Variables tab
   - Looks like: `postgresql://postgres:PASSWORD@HOST:PORT/railway`

## Step 2: Deploy Redis (Optional)

1. Click **"+ New"** → **"Database"** → **"Add Redis"**
2. Railway creates it automatically
3. Copy connection URL from Variables

## Step 3: Deploy Backend API

1. Click **"+ New"** → **"GitHub Repo"**
2. Select your repository
3. Railway will detect the repo
4. **Configure:**
   - **Root Directory**: `backend`
   - **Build Command**: (leave default, or: `pip install -r requirements.txt`)
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`

5. **Add Environment Variables:**
   ```
   DATABASE_URL=<postgres-connection-string-from-step-1>
   DATAGOV_KEY=<your-key>
   DATAGOV_RESOURCE_ID=<resource-id>
   INGEST_STATE=Uttar Pradesh
   PORT=8000
   ```

## Step 4: Deploy Frontend

1. Click **"+ New"** → **"GitHub Repo"**
2. Select same repository
3. **Configure:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Install Command**: `npm install`

4. **Add Environment Variable:**
   ```
   NEXT_PUBLIC_API_URL=https://your-api-service.up.railway.app
   PORT=3000
   ```

## Step 5: Deploy Worker (Optional)

1. Click **"+ New"** → **"GitHub Repo"**
2. Select same repository
3. **Configure:**
   - **Root Directory**: `worker` (or root with context)
   - **Build Command**: (Dockerfile handles it)
   - **Start Command**: `celery -A worker worker --loglevel=info`

4. **Add Environment Variables:**
   ```
   DATABASE_URL=<same-as-api>
   REDIS_URL=<from-step-2>
   DATAGOV_KEY=<same-as-api>
   DATAGOV_RESOURCE_ID=<same-as-api>
   INGEST_STATE=Uttar Pradesh
   ```

## 🔧 Alternative: Use Dockerfiles Directly

Railway can also use Dockerfiles. If you use this approach:

1. For each service, Railway will detect the Dockerfile
2. Make sure Dockerfile is in the service's root directory
3. Railway will build and run automatically

## 📝 Notes

- Each service gets its own URL
- Services can reference each other via Railway's service names
- Use Railway's managed PostgreSQL (easier than Docker PostgreSQL)
- Environment variables are shared per service

## ✅ Benefits of Individual Services

- ✅ Railway handles each service properly
- ✅ Independent scaling
- ✅ Better error isolation
- ✅ Easier debugging
- ✅ Railway's native features work better

---

**This approach avoids docker-compose issues completely!**

