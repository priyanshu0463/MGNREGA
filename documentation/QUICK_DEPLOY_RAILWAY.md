# Quick Deploy to Railway (5 minutes)

Railway is the easiest way to deploy this full-stack app for free.

## Prerequisites
- GitHub account
- Railway account (free)
- data.gov.in API key (optional for now)

## Step-by-Step

### 1. Push Code to GitHub

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - MGNREGA Dashboard"

# Create repository on GitHub, then:
git remote add origin https://github.com/yourusername/mgnrega-dashboard.git
git push -u origin main
```

### 2. Sign up for Railway

1. Go to https://railway.app/
2. Click "Start a New Project"
3. Sign in with GitHub
4. Select "Deploy from GitHub repo"
5. Choose your repository

### 3. Configure Environment Variables

In Railway dashboard, go to your project → Variables tab, add:

```
DB_PASSWORD=<generate-a-strong-password>
DATAGOV_KEY=<your-data-gov-api-key>
DATAGOV_RESOURCE_ID=<resource-id>
INGEST_STATE=Uttar Pradesh
NEXT_PUBLIC_API_URL=https://your-api.railway.app
```

**Note**: Railway will generate public URLs. After first deploy, update `NEXT_PUBLIC_API_URL` with the actual API URL.

### 4. Adjust Docker Compose for Railway

Railway needs a slight modification. Create `docker-compose.railway.yml`:

```yaml
version: '3.8'

services:
  db:
    image: postgis/postgis:14-3.4
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine

  api:
    build: ./backend
    environment:
      DATABASE_URL: postgresql://app:${DB_PASSWORD}@db:5432/app
      DATAGOV_KEY: ${DATAGOV_KEY}
      DATAGOV_RESOURCE_ID: ${DATAGOV_RESOURCE_ID}
    depends_on:
      - db
      - redis
    ports:
      - "8000:8000"

  frontend:
    build: ./frontend
    environment:
      NEXT_PUBLIC_API_URL: ${NEXT_PUBLIC_API_URL}
    depends_on:
      - api
    ports:
      - "3000:3000"

volumes:
  db_data:
```

### 5. Deploy

Railway will automatically:
- Detect docker-compose.yml
- Build all services
- Deploy them
- Provide public URLs

### 6. Access Your App

After deployment (5-10 minutes):
- Go to Railway dashboard
- Click on your project
- Find the public URL (e.g., `https://your-project.up.railway.app`)

### 7. Post-Deployment Setup

**Load Districts:**
```bash
# Connect to Railway database or use Railway's database browser
# Run the SQL from scripts/init_db.py
```

**Run Initial Data Ingestion:**
```bash
# In Railway, use the worker service or run manually:
docker compose exec worker python -c "from app.ingest import fetch_and_store; fetch_and_store('Uttar Pradesh')"
```

## Alternative: Use Railway's Managed PostgreSQL

Instead of Docker PostgreSQL:

1. In Railway, add "PostgreSQL" service (free tier)
2. Update `DATABASE_URL` in environment variables
3. Remove `db` service from docker-compose
4. Update `docker-compose.yml` to use external database

## Troubleshooting

**Build fails?**
- Check Railway logs
- Verify all files are in git
- Check Dockerfile paths

**Services not connecting?**
- Verify environment variables
- Check service dependencies
- Review Railway logs

**Database issues?**
- Use Railway's managed PostgreSQL (easier)
- Or ensure Docker PostgreSQL is accessible

## Railway Free Tier Limits

- $5 credit per month
- Enough for small-medium apps
- Auto-pauses after inactivity (paid plans don't)

## Get Your Working URL

After deployment, Railway provides:
- Main service URL (frontend): `https://your-project.up.railway.app`
- Individual service URLs accessible via Railway dashboard

You can also:
1. Add custom domain (free)
2. Set up subdomains for API
3. Configure SSL (automatic)

---

**That's it!** Your app should be live in ~10 minutes. 🚀

