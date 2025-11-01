# Quick Fix: Railway API Crash - Add Environment Variables

## 🚨 Your API is Crashing Because Variables Are Missing

## ✅ Quick Fix (2 minutes)

### Step 1: Add Variables to API Service

1. **In Railway Dashboard:**
   - Click on **"mgnrega-api"** service (the one showing "Crashed")

2. **Go to Variables:**
   - Click **"Variables"** tab
   - Or: **Settings** → **Variables**

3. **Add These Variables:**

   **Required:**
   ```
   DATABASE_URL
   ```
   *(Get this from Railway's PostgreSQL service - see Step 2)*

   ```
   DATAGOV_KEY
   ```
   *(Your API key from data.gov.in - can be empty for now)*

   ```
   DATAGOV_RESOURCE_ID
   ```
   *(Resource ID from data.gov.in - can be empty for now)*

   ```
   INGEST_STATE
   ```
   *(Value: `Uttar Pradesh`)*

### Step 2: Set Up Database

**Option A: Use Railway's Managed PostgreSQL (Recommended)**

1. In Railway project → **"+ New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway will create it automatically
3. Copy the **connection string** (looks like `postgresql://postgres:PASSWORD@containers-us-west-XXX.railway.app:5432/railway`)
4. Add it as `DATABASE_URL` in your API service

**Option B: If You Already Have PostgreSQL Service**

1. Click on your PostgreSQL service
2. Go to **"Variables"** tab
3. Find `DATABASE_URL` or connection string
4. Copy it
5. Paste into `DATABASE_URL` in your API service

### Step 3: Fix Frontend API URL

1. Click on **"mgnrega-frontend"** service
2. Go to **Variables**
3. Add:
   ```
   NEXT_PUBLIC_API_URL=https://mgnrega-api-production.up.railway.app
   ```
   *(Replace with your actual API service URL from Railway)*

### Step 4: Restart Services

Railway should automatically restart, but if not:
- Click on each service → **"Deployments"** → **"Redeploy"**

## 📋 Minimum Variables Needed (For Now)

You can start with just these (others can be added later):

**For mgnrega-api:**
```
DATABASE_URL=<postgres-connection-string>
INGEST_STATE=Uttar Pradesh
```

**For mgnrega-frontend:**
```
NEXT_PUBLIC_API_URL=https://your-api-url.up.railway.app
```

*Note: DATAGOV_KEY and DATAGOV_RESOURCE_ID can be added later when you have them.*

## 🔍 How to Get API Service URL

1. Click on **"mgnrega-api"** service
2. Look for **"Settings"** tab
3. Find **"Domain"** or **"Public URL"**
4. Copy that URL
5. Use it for `NEXT_PUBLIC_API_URL` in frontend

## ✅ After Adding Variables

1. Railway will automatically redeploy
2. Check **"Logs"** tab - should see "Application startup complete"
3. Status should change from "Crashed" to "Running" (green)

---

**This should fix the crash!** 🚀

