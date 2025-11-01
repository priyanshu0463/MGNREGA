# Quick Start Guide

## Local Development

### Prerequisites
- Docker and Docker Compose installed
- Node.js 18+ (for local frontend development, optional)
- Python 3.11+ (for local backend development, optional)

### Step 1: Clone and Setup

```bash
cd /path/to/gov
cp env.example .env
# Edit .env and add your data.gov.in API key and resource ID
```

### Step 2: Start Services

```bash
docker-compose up -d
```

This will start:
- PostgreSQL with PostGIS (port 5432)
- Redis (port 6379)
- FastAPI backend (port 8000)
- Next.js frontend (port 3000)
- Celery worker for data ingestion

### Step 3: Initialize Database

```bash
# Wait for services to be ready (about 30 seconds)
docker-compose exec api python -c "from app.db import init_db; init_db()"
```

### Step 4: Load Sample Districts

For testing, you can manually insert districts without geometry:

```bash
docker-compose exec db psql -U app -d app -c "
INSERT INTO districts (state_name, district_name) VALUES 
('Uttar Pradesh', 'Lucknow'),
('Uttar Pradesh', 'Kanpur'),
('Uttar Pradesh', 'Agra')
ON CONFLICT DO NOTHING;
"
```

For production, use the GeoJSON loader script with actual district boundaries.

### Step 5: Run Data Ingestion

```bash
# Manual ingestion
docker-compose exec worker python -c "
import sys
sys.path.insert(0, '/app')
from worker.worker import ingest_data
result = ingest_data()
print(result)
"
```

### Step 6: Access Application

- Frontend: http://localhost:3000
- API: http://localhost:8000
- API Docs: http://localhost:8000/docs

## Development Mode

### Frontend (with hot reload)

```bash
cd frontend
npm install
npm run dev
```

### Backend (with hot reload)

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Common Issues

### Services won't start
- Check Docker is running: `docker ps`
- Check ports are available: `netstat -tuln | grep -E '3000|8000|5432|6379'`
- View logs: `docker-compose logs`

### Database connection errors
- Wait for database to be ready: `docker-compose exec db pg_isready -U app`
- Check database logs: `docker-compose logs db`

### Frontend build errors
- Clear Next.js cache: `cd frontend && rm -rf .next`
- Rebuild: `docker-compose up -d --build frontend`

### Missing API key
- Get API key from https://data.gov.in/
- Add to `.env` file
- Restart services: `docker-compose restart`

## Production Deployment

See `DEPLOYMENT.md` for detailed production deployment instructions.

