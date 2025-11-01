# Frontend-Only Deployment Guide

This version uses Next.js API Routes (serverless functions) instead of a separate backend.

## ✨ Benefits

- ✅ **Single deployment** - Just deploy frontend, everything is included
- ✅ **No backend service** needed - API routes are part of Next.js
- ✅ **Works on Vercel/Netlify** - Free hosting with serverless functions
- ✅ **Simpler setup** - One service instead of multiple
- ✅ **No CORS issues** - Same origin requests

## 🚀 Deploy to Vercel (Recommended - Completely FREE)

### Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Frontend-only with API routes"
   git push
   ```

2. **Deploy on Vercel:**
   - Go to https://vercel.com
   - Sign in with GitHub
   - Click "Add New Project"
   - Import your repository
   - **Settings:**
     - Framework Preset: **Next.js** (auto-detected)
     - Root Directory: `frontend` (if repo is at root)
     - Build Command: `npm install && npm run build`
     - Output Directory: `.next`
   - Click "Deploy"

3. **Done!** 🎉
   - Vercel provides: `https://your-project.vercel.app`
   - API routes work automatically at `/api/*`
   - No backend service needed!

## 📊 How It Works

- **Frontend**: Next.js app (React)
- **API Routes**: Serverless functions at `/api/*`
  - `/api/districts` - List districts
  - `/api/district/[id]` - District metrics
  - `/api/district/[id]/trends` - Trend data
  - `/api/detect-district` - Geolocation
  - `/api/snapshot-date` - Snapshot info

## 🔄 Updating Data

**Option 1: Update API Route Data**
- Edit files in `frontend/pages/api/`
- Push to GitHub
- Vercel auto-deploys

**Option 2: Fetch from External API**
- Modify API routes to call data.gov.in
- Add API key handling
- Cache responses

**Option 3: Use Database (Optional)**
- Can add Supabase/PlanetScale (free tiers)
- Update API routes to use database

## 📝 Current Implementation

- Uses **sample data** embedded in API routes
- Can be easily updated to fetch from:
  - data.gov.in API
  - External databases
  - Static JSON files
  - Any REST API

## 🎯 Advantages

- **Free hosting** on Vercel (unlimited)
- **Automatic SSL** and CDN
- **Global edge network** - fast worldwide
- **Auto-deploy** on git push
- **No server management** - serverless

## 🔧 Customization

To add real data from data.gov.in:

1. Edit `/frontend/pages/api/districts.ts`
2. Add fetch to data.gov.in API
3. Cache responses (Vercel edge caching)
4. Update other API routes similarly

## 📦 Files Structure

```
frontend/
├── pages/
│   ├── api/              ← API routes (serverless functions)
│   │   ├── districts.ts
│   │   ├── district/[id].ts
│   │   └── ...
│   └── index.tsx         ← Main page
├── components/           ← React components
└── lib/
    └── api.ts            ← API client (updated for /api routes)
```

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed on Vercel
- [ ] Tested all API routes
- [ ] Verified frontend loads
- [ ] Checked district selection works
- [ ] Tested on mobile

---

**That's it! No backend service needed!** 🚀

