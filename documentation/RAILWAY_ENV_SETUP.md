# Setting Environment Variables in Railway

## 🎯 Where to Add API Variables in Railway

### Step-by-Step:

1. **Go to Your Railway Project**
   - Open the Railway dashboard
   - Click on your project (e.g., "positive-recreation")

2. **Select the Service**
   - Click on **"mgnrega-api"** service (the one that's crashing)

3. **Open Variables Tab**
   - Look for **"Variables"** tab in the service view
   - Or click on the service → **"Settings"** → **"Variables"**

4. **Add Environment Variables**

   Click **"+ New Variable"** and add each one:

   ```
   DATABASE_URL=postgresql://app:YOUR_PASSWORD@mgnrega-db:5432/app
   ```
   *(Use Railway's PostgreSQL service connection string)*

   ```
   DATAGOV_KEY=your_api_key_from_data_gov_in
   ```

   ```
   DATAGOV_RESOURCE_ID=your_resource_id_from_data_gov_in
   ```

   ```
   INGEST_STATE=Uttar Pradesh
   ```

5. **For Frontend Service (mgnrega-frontend)**
   - Click on **"mgnrega-frontend"** service
   - Go to **Variables** tab
   - Add:
     ```
     NEXT_PUBLIC_API_URL=https://mgnrega-api-production.up.railway.app
     ```
     *(Replace with your actual API URL from Railway)*

## 🔍 How to Find Service Connection Strings

### For Database:
1. In Railway, look for your PostgreSQL service (or create one)
2. Click on it → **"Connect"** or **"Variables"** tab
3. Copy the **"Postgres Connection URL"** or **"DATABASE_URL"**
4. Use that as `DATABASE_URL` in your API service

### For Redis:
- Similar process - get the Redis connection URL from Redis service

## 📝 Complete List of Variables Needed

### API Service (mgnrega-api):
```
DATABASE_URL=<from-railway-postgres-service>
REDIS_URL=<from-railway-redis-service> (optional)
DATAGOV_KEY=<your-api-key>
DATAGOV_RESOURCE_ID=<your-resource-id>
INGEST_STATE=Uttar Pradesh
```

### Frontend Service (mgnrega-frontend):
```
NEXT_PUBLIC_API_URL=https://your-api-url.up.railway.app
```

### Worker Service (if you have one):
```
DATABASE_URL=<same-as-api>
REDIS_URL=<same-as-api>
DATAGOV_KEY=<same-as-api>
DATAGOV_RESOURCE_ID=<same-as-api>
INGEST_STATE=Uttar Pradesh
```

## 🔧 Alternative: Use Railway's Managed Services

Instead of Docker PostgreSQL, use Railway's managed PostgreSQL:

1. **Add PostgreSQL Service:**
   - In Railway project → **"+ New"** → **"Database"** → **"Add PostgreSQL"**
   - Railway automatically provides connection string

2. **Use the Connection String:**
   - Railway will create a variable automatically
   - Reference it in your API service using Railway's variable syntax
   - Or copy the connection string to your API service's `DATABASE_URL`

## ⚠️ Important Notes

1. **After Adding Variables:**
   - Railway will automatically restart the service
   - Check the **"Logs"** tab to see if it starts successfully

2. **Database Connection:**
   - If using Railway's managed PostgreSQL, use the internal service name
   - Format: `postgresql://postgres:PASSWORD@postgres:5432/railway`
   - Railway provides this automatically

3. **Frontend API URL:**
   - After API service is running, get its public URL
   - Update `NEXT_PUBLIC_API_URL` in frontend service
   - Frontend needs to know where the API is

## 🐛 Troubleshooting API Crash

If API is still crashing after adding variables:

1. **Check Logs:**
   - Click on **"mgnrega-api"** → **"Logs"** tab
   - Look for error messages

2. **Common Issues:**
   - Database connection failing → Check `DATABASE_URL`
   - Missing dependencies → Check build logs
   - Port issues → Railway handles this automatically

3. **Verify Variables:**
   - Make sure all variables are set
   - Check for typos
   - Ensure no extra spaces

## 📸 Quick Reference

**Railway Dashboard Path:**
```
Project → Service → Variables Tab → + New Variable
```

**Or:**
```
Project → Service → Settings → Variables → + New Variable
```

---

**After setting variables, Railway will automatically redeploy and your API should start working!** ✅

