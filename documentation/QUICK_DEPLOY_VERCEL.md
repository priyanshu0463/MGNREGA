# Deploy Frontend to Vercel (FREE) + Backend to Railway

This split approach gives you the best free hosting setup.

## Part 1: Deploy Backend to Railway

1. Follow steps 1-3 from `QUICK_DEPLOY_RAILWAY.md`
2. Deploy only backend services (remove frontend from docker-compose)
3. Note your Railway API URL (e.g., `https://mgnrega-api.up.railway.app`)

## Part 2: Deploy Frontend to Vercel (FREE)

### Steps:

1. **Prepare Frontend**
   ```bash
   cd frontend
   # Ensure .env.local has:
   # NEXT_PUBLIC_API_URL=https://your-railway-api-url
   ```

2. **Push to GitHub**
   ```bash
   git add frontend
   git commit -m "Frontend for Vercel"
   git push
   ```

3. **Deploy on Vercel**
   - Go to https://vercel.com/
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - Configure:
     - **Framework Preset**: Next.js
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Output Directory**: `.next`
     - **Install Command**: `npm install`
   - Add Environment Variable:
     ```
     NEXT_PUBLIC_API_URL=https://your-railway-api-url
     ```
   - Click "Deploy"

4. **Access Your App**
   - Vercel provides: `https://your-project.vercel.app`
   - Automatic SSL
   - Global CDN
   - Free forever

## Benefits of This Approach

✅ **Frontend**: Vercel (unlimited free, perfect for Next.js)
✅ **Backend**: Railway ($5/month credit, usually enough)
✅ **Database**: Railway PostgreSQL (included)
✅ **Fast**: CDN for frontend, optimized backend
✅ **Auto-deploy**: On every git push

## Your URLs

- **Frontend**: `https://mgnrega-dashboard.vercel.app`
- **Backend**: `https://mgnrega-api.railway.app`
- **API Docs**: `https://mgnrega-api.railway.app/docs`

---

This gives you a production-ready setup, completely free! 🎉

