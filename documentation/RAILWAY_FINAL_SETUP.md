# Final Railway Setup - Environment Variables

## ⚠️ Important: Railway Variable Syntax

Railway does NOT support `${VAR:-default}` syntax in docker-compose.yml.

**Fixed:** All variables now use simple `${VAR}` format.

## ✅ Required Environment Variables

You MUST set these in Railway for services to work:

### For `mgnrega-api` service:

1. Go to Railway → Your Project → `mgnrega-api` → Variables

2. Add these variables:

```
DB_PASSWORD=<your-secure-password>
```

```
DATABASE_URL=postgresql://app:<DB_PASSWORD>@db:5432/app
```
*(Replace <DB_PASSWORD> with actual password)*

```
DATAGOV_KEY=<your-api-key>
```
*(Can leave empty for now if you don't have it)*

```
DATAGOV_RESOURCE_ID=<resource-id>
```
*(Can leave empty for now if you don't have it)*

```
INGEST_STATE=Uttar Pradesh
```

### For `mgnrega-frontend` service:

```
NEXT_PUBLIC_API_URL=https://mgnrega-api-production.up.railway.app
```
*(Use your actual API service URL from Railway)*

### For `mgnrega-worker` service (if you have it):

```
DATABASE_URL=postgresql://app:<DB_PASSWORD>@db:5432/app
REDIS_URL=redis://redis:6379/0
DATAGOV_KEY=<your-api-key>
DATAGOV_RESOURCE_ID=<resource-id>
INGEST_STATE=Uttar Pradesh
```

## 🎯 Quick Setup Steps

1. **Push fixed docker-compose.yml to GitHub**
   ```bash
   git add docker-compose.yml
   git commit -m "Fix Railway compatibility - remove default value syntax"
   git push
   ```

2. **Add Variables in Railway:**
   - Go to each service
   - Variables tab
   - Add all required variables
   - Railway will auto-redeploy

3. **Use Railway's Managed PostgreSQL (Recommended):**
   - Add PostgreSQL service in Railway
   - Railway provides `DATABASE_URL` automatically
   - Use that instead of Docker PostgreSQL

## 📝 Notes

- All `${VAR:-default}` changed to `${VAR}`
- You MUST set all variables in Railway
- No defaults - Railway requires explicit values
- Use Railway's managed services when possible (easier)

---

**After setting variables, Railway should deploy successfully!** ✅

