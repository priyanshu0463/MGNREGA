# Quick Deploy to Vercel (Frontend-Only) - 2 Minutes!

## ✨ Why Vercel?

- ✅ **Perfect for Next.js** - Built specifically for it
- ✅ **Completely FREE** - Unlimited deployments
- ✅ **Automatic SSL** and CDN
- ✅ **Zero configuration** - Just connect GitHub
- ✅ **API routes work automatically**

## 🚀 Deploy Steps

### 1. Push to GitHub

```bash
git add .
git commit -m "Frontend-only with API routes"
git push
```

### 2. Deploy on Vercel

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click:** "Add New Project"
4. **Import** your repository
5. **Configure:**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` ⚠️ Important!
   - **Build Command**: `npm install && npm run build` (auto-filled)
   - **Output Directory**: `.next` (auto-filled)
6. **Click:** "Deploy"

### 3. Done! 🎉

- Vercel provides: `https://your-project.vercel.app`
- API routes: `https://your-project.vercel.app/api/*`
- Frontend: `https://your-project.vercel.app`

## ✅ What Works

- ✅ District selection
- ✅ KPI display with sample data
- ✅ Trend charts
- ✅ Voice/TTS
- ✅ Hindi/English
- ✅ Offline support (PWA)
- ✅ All API endpoints at `/api/*`

## 📝 No Configuration Needed!

Vercel automatically:
- Detects Next.js
- Builds the app
- Deploys API routes
- Sets up CDN
- Provides SSL
- Auto-deploys on git push

## 🔄 Update Data

To add real data later:
1. Edit API route files in `frontend/pages/api/`
2. Add data.gov.in API calls
3. Push to GitHub
4. Vercel auto-deploys

---

**That's it! Working URL in 2 minutes!** 🚀

