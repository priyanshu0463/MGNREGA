# MGNREGA Dashboard - Project Summary

## Overview

A complete end-to-end PWA web application for rural citizens to access MGNREGA (Mahatma Gandhi National Rural Employment Guarantee Act) district-level KPIs with voice explanations in Hindi and English.

## Architecture

### Frontend
- **Framework**: Next.js 14 with React 18
- **Features**: 
  - PWA support (offline caching)
  - i18n (English + Hindi)
  - Government-style clean UI
  - TTS (Text-to-Speech) for accessibility
  - Responsive design for mobile devices
- **Port**: 3000

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Endpoints**:
  - `/districts` - List all districts
  - `/district/{id}/current` - Current metrics for a district
  - `/district/{id}/trends` - Trend data
  - `/detect-district` - Geolocation-based district detection
  - `/snapshot-date` - Latest data snapshot date
- **Port**: 8000

### Database
- **Type**: PostgreSQL 14 with PostGIS extension
- **Tables**:
  - `districts` - District information with geometry
  - `mgnrega_monthly` - Monthly MGNREGA metrics
  - Materialized view: `state_monthly_averages`

### Worker
- **Framework**: Celery
- **Task**: Periodic data ingestion from data.gov.in
- **Schedule**: Daily at 2 AM UTC

### Caching
- **Redis**: Used for Celery broker and caching

## Key Features Implemented

✅ District selection with search and geolocation  
✅ 5 KPIs displayed with visual indicators:
  - Person-days generated
  - Total households worked
  - Average days per household
  - Wages disbursed
  - Women participation percentage

✅ Voice explanations (TTS) in Hindi and English  
✅ Trend visualization (12-month charts)  
✅ Comparison with state averages  
✅ Offline mode with snapshot dates  
✅ Government-style UI (clean, accessible, large touch targets)  
✅ Responsive design for mobile devices  

## Setup Instructions

### 1. Local Development

```bash
# Copy environment file
cp env.example .env
# Edit .env and add your data.gov.in API key

# Start services
docker-compose up -d

# Initialize database (auto-initializes on first API start)
# Load sample districts (optional)
docker-compose exec db psql -U app -d app -c "
INSERT INTO districts (state_name, district_name) VALUES 
('Uttar Pradesh', 'Lucknow'),
('Uttar Pradesh', 'Kanpur')
ON CONFLICT DO NOTHING;
"
```

### 2. Production Deployment

See `DEPLOYMENT.md` for detailed instructions.

Quick steps:
1. Set up VPS (Ubuntu 22.04)
2. Install Docker & Docker Compose
3. Clone/upload project files
4. Configure `.env`
5. Run `./deploy.sh`
6. Set up Nginx reverse proxy
7. Configure SSL with Let's Encrypt

## Configuration

### Environment Variables

- `DB_PASSWORD`: PostgreSQL password
- `DATAGOV_KEY`: API key from data.gov.in
- `DATAGOV_RESOURCE_ID`: Resource ID of MGNREGA dataset
- `INGEST_STATE`: State to ingest data for (default: "Uttar Pradesh")
- `NEXT_PUBLIC_API_URL`: Frontend API URL

### Getting Data.gov.in Credentials

1. Visit https://data.gov.in/
2. Register/Login
3. Go to Profile → API section
4. Generate API key
5. Find MGNREGA dataset and note the Resource ID

## Data Flow

1. **Ingestion**: Celery worker fetches data from data.gov.in daily
2. **Storage**: Data stored in PostgreSQL with snapshot dates
3. **API**: FastAPI serves data to frontend
4. **Frontend**: Next.js renders UI with cached data for offline support

## District Boundaries

For geolocation detection to work, you need to load district boundary polygons:

1. Get GeoJSON file of district boundaries (from OSM, state GIS portal, etc.)
2. Use script: `python scripts/load_districts_geojson.py <path_to_geojson>`

Or manually insert districts without geometry for testing.

## Files Structure

```
gov/
├── backend/
│   ├── app/
│   │   ├── main.py        # FastAPI application
│   │   ├── db.py          # Database models and connection
│   │   ├── models.py      # Pydantic models
│   │   └── ingest.py      # Data ingestion logic
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── pages/             # Next.js pages
│   ├── components/        # React components
│   ├── lib/              # API client
│   ├── hooks/            # React hooks (TTS)
│   ├── styles/           # CSS
│   ├── public/           # Static assets
│   └── Dockerfile
├── worker/
│   ├── worker.py         # Celery worker
│   ├── Dockerfile
│   └── requirements.txt
├── scripts/              # Utility scripts
├── docker-compose.yml    # Docker orchestration
└── DEPLOYMENT.md         # Deployment guide
```

## Known Limitations & TODO

1. **PWA Icons**: Need to create actual 192x192 and 512x512 PNG icons
2. **District Boundaries**: Need actual GeoJSON data for geolocation
3. **Data Mapping**: May need to adjust field mappings in `ingest.py` based on actual data.gov.in API response
4. **Resource ID**: Must be updated with actual MGNREGA dataset resource ID
5. **i18n**: Currently using router locale, could enhance with next-i18next
6. **Monitoring**: Add Prometheus/Grafana for production

## Testing

### Health Checks
- Frontend: http://localhost:3000
- API: http://localhost:8000/health
- API Docs: http://localhost:8000/docs

### Manual Ingestion Test
```bash
docker-compose exec worker python -c "
from worker.worker import ingest_data
result = ingest_data()
print(result)
"
```

## Support & Troubleshooting

- Check logs: `docker-compose logs -f [service_name]`
- Restart service: `docker-compose restart [service_name]`
- Rebuild: `docker-compose up -d --build`

See `DEPLOYMENT.md` and `QUICKSTART.md` for more details.

## License

This project is built for public service and rural citizen empowerment.

