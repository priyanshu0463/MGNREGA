# MGNREGA Dashboard - Rural Citizen Portal

A simple, low-bandwidth Progressive Web App (PWA) for rural citizens to access MGNREGA district-level KPIs with voice explanations in Hindi and English.

## 🎯 Product Goal

Enable any rural citizen to:
- Select their district (or be auto-detected via geolocation)
- See 3-5 simple KPIs explained in plain local language + voice
- View trends and comparison vs State and National averages
- Get visual cues (icons/colors) and one-line action explanations
- Works offline with recent snapshots
- Fast on low-end phones, scales to millions

## ✨ Features

- **District Selection**: Search or use geolocation to find your district
- **5 Key KPIs**:
  - Person-days generated (monthly)
  - Total households worked (YTD)
  - Average days of employment per household
  - Wages disbursed (last month)
  - Women % of person-days
- **Voice Explanations**: TTS in Hindi and English
- **Trend Visualization**: 12-month charts for key metrics
- **State Comparison**: Compare district performance with state averages
- **Offline Support**: PWA with cached data snapshots
- **Accessible UI**: Large touch targets, high contrast, government-style design

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- API key from [data.gov.in](https://data.gov.in/)
- (Optional) District boundary GeoJSON for geolocation

### Local Setup

```bash
# 1. Clone or navigate to project directory
cd /path/to/gov

# 2. Copy environment file
cp env.example .env

# 3. Edit .env and add your credentials:
#    - DATAGOV_KEY: Your data.gov.in API key
#    - DATAGOV_RESOURCE_ID: MGNREGA dataset resource ID
#    - DB_PASSWORD: Secure database password

# 4. Start all services
docker-compose up -d

# 5. Wait for services to initialize (~30 seconds)
#    Check logs: docker-compose logs -f

# 6. Access the application
#    Frontend: http://localhost:3000
#    API: http://localhost:8000
#    API Docs: http://localhost:8000/docs
```

### Load Sample Districts

For testing, insert sample districts:

```bash
docker-compose exec db psql -U app -d app -c "
INSERT INTO districts (state_name, district_name) VALUES 
('Uttar Pradesh', 'Lucknow'),
('Uttar Pradesh', 'Kanpur'),
('Uttar Pradesh', 'Agra'),
('Uttar Pradesh', 'Varanasi'),
('Uttar Pradesh', 'Allahabad')
ON CONFLICT DO NOTHING;
"
```

### Run Data Ingestion

```bash
# Manual ingestion
docker-compose exec worker python -c "
import sys
sys.path.insert(0, '/app/backend')
from app.ingest import fetch_and_store
fetch_and_store('Uttar Pradesh')
"
```

Or use the script:
```bash
./scripts/run_ingestion.sh
```

## 📋 Project Structure

```
gov/
├── backend/           # FastAPI backend
│   ├── app/
│   │   ├── main.py    # API endpoints
│   │   ├── db.py      # Database setup
│   │   ├── models.py  # Data models
│   │   └── ingest.py  # Data ingestion
│   └── Dockerfile
├── frontend/          # Next.js PWA
│   ├── pages/        # Next.js pages
│   ├── components/   # React components
│   ├── lib/          # API client
│   └── Dockerfile
├── worker/           # Celery worker for data ingestion
│   ├── worker.py
│   └── Dockerfile
├── scripts/          # Utility scripts
├── docker-compose.yml
└── DEPLOYMENT.md     # Production deployment guide
```

## 🔧 Configuration

### Getting data.gov.in API Key

1. Visit [data.gov.in](https://data.gov.in/)
2. Register/Login
3. Navigate to Profile → API Keys
4. Generate a new API key
5. Find the MGNREGA dataset and note the Resource ID
6. Add both to `.env` file

### Environment Variables

See `env.example` for all configuration options:

- `DB_PASSWORD`: PostgreSQL password
- `DATAGOV_KEY`: data.gov.in API key
- `DATAGOV_RESOURCE_ID`: MGNREGA dataset resource ID
- `INGEST_STATE`: State to fetch data for (default: "Uttar Pradesh")
- `NEXT_PUBLIC_API_URL`: Frontend API URL

## 🌐 Production Deployment

For detailed production deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

Quick overview:
1. Set up Ubuntu 22.04 VPS
2. Install Docker & Docker Compose
3. Upload project files
4. Configure `.env`
5. Run `./deploy.sh`
6. Set up Nginx reverse proxy
7. Configure SSL with Let's Encrypt

## 📊 API Endpoints

- `GET /districts` - List all districts
- `GET /district/{id}/current` - Current metrics for a district
- `GET /district/{id}/trends` - Trend data (default 12 months)
- `POST /detect-district` - Detect district from lat/lon
- `GET /snapshot-date` - Latest data snapshot date
- `GET /health` - Health check

API documentation: http://localhost:8000/docs

## 🗺️ District Boundaries (Geolocation)

For geolocation-based district detection:

1. Obtain district boundary GeoJSON file:
   - OpenStreetMap
   - State government GIS portals
   - Data.gov.in resources
2. Load into database:
   ```bash
   docker-compose exec api python scripts/load_districts_geojson.py /path/to/districts.geojson
   ```

## 🛠️ Development

### Frontend Development

```bash
cd frontend
npm install
npm run dev
```

### Backend Development

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## 📝 Key Features Implementation

### PWA Support
- Service worker for offline caching
- App manifest for installable app
- Cached API responses for offline access

### i18n
- English and Hindi support
- Voice explanations in both languages
- Swappable via language selector

### Accessibility
- Large touch targets (48px minimum)
- High contrast colors
- Voice explanations for all KPIs
- Screen reader friendly

### Performance
- Server-side rendering (SSR)
- Optimized images and assets
- Lazy loading
- CDN-ready static assets

## 🐛 Troubleshooting

### Services won't start
```bash
# Check Docker
docker ps

# Check logs
docker-compose logs -f

# Restart services
docker-compose restart
```

### Database issues
```bash
# Check database health
docker-compose exec db pg_isready -U app

# View database logs
docker-compose logs db

# Reset database (WARNING: deletes data)
docker-compose down -v
docker-compose up -d
```

### Frontend build errors
```bash
# Clear Next.js cache
cd frontend
rm -rf .next

# Rebuild
docker-compose up -d --build frontend
```

### API connection errors
- Verify `NEXT_PUBLIC_API_URL` in `.env`
- Check API logs: `docker-compose logs api`
- Test API directly: `curl http://localhost:8000/health`

## 📚 Documentation

- [QUICKSTART.md](QUICKSTART.md) - Quick start guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) - Project overview

## 🔒 Security Notes

- Never commit `.env` file
- Use strong database passwords
- Enable firewall (UFW) on production servers
- Use SSL/HTTPS in production
- Regularly update dependencies

## 📄 License

Built for public service and rural citizen empowerment.

## 🤝 Contributing

This is a public service project. Contributions welcome!

## 📞 Support

For issues or questions:
1. Check troubleshooting section
2. Review logs: `docker-compose logs`
3. Check documentation files

---

**Built with ❤️ for rural citizens**
