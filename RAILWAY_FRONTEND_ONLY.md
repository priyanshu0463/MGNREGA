# Deploy Frontend-Only to Railway

Since we're using Next.js API routes (frontend-only), deploy just the frontend service.

## 🚀 Steps

### 1. Delete/Rename docker-compose.yml (So Railway doesn't try to use it)

In Railway, if docker-compose.yml exists, it tries to use it. Since we're frontend-only now:

**Option A: Rename it (keep for local use)**
```bash
git mv docker-compose.yml docker-compose.local.yml
git commit -m "Rename docker-compose for Railway frontend-only deploy"
git push
```

**Option B: Delete it (if you don't need it)**
```bash
git rm docker-compose.yml
git commit -m "Remove docker-compose - using frontend-only"
git push
```

### 2. Deploy Frontend on Railway

1. **In Railway Dashboard:**
   - Go to your project
   - Delete any existing services trying to use docker-compose
   - Click **"+ New"** → **"GitHub Repo"**
   - Select your repository

2. **Configure the Service:**
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Healthcheck Path**: `/api/snapshot-date` (or remove healthcheck)

3. **Environment Variables:**
   - None needed! (API routes use sample data)
   - Optionally add:
     ```
     PORT=3000
     ```

4. **Deploy:**
   - Railway will build and deploy automatically
   - You'll get a URL like: `https://your-frontend.up.railway.app`

### 3. That's It!

- Frontend runs at your Railway URL
- API routes work at `/api/*`
- No backend service needed
- No database needed (uses sample data)

## ✅ Or Use Vercel (Even Easier & Free)

**For frontend-only, Vercel is better:**
1. Go to https://vercel.com
2. Import GitHub repo
3. Root: `frontend`
4. Deploy - done!

Vercel is specifically designed for Next.js and handles API routes perfectly.

---

**Railway is trying to use docker-compose which we don't need anymore. Use the frontend-only approach above!**

