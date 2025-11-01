# Deployment Guide

This guide will help you deploy the MGNREGA Dashboard to a VPS.

## Prerequisites

- Ubuntu 22.04 VPS (2 vCPU, 4-8 GB RAM recommended)
- Root or sudo access
- Domain name (optional) or public IP address
- API key from data.gov.in

## Step 1: Server Setup

### Update system packages
```bash
sudo apt update && sudo apt upgrade -y
```

### Install Docker and Docker Compose
```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Add user to docker group (replace 'your-user' with your username)
sudo usermod -aG docker your-user
```

### Install Nginx
```bash
sudo apt install nginx -y
```

### Setup firewall
```bash
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## Step 2: Clone and Configure

### Clone repository (if using git) or upload files
```bash
cd /opt
sudo mkdir mgnrega-app
sudo chown $USER:$USER mgnrega-app
cd mgnrega-app
# Upload your project files here or clone from git
```

### Create environment file
```bash
cp .env.example .env
nano .env
```

Fill in the required values:
```env
DB_PASSWORD=your_secure_password_here
DATAGOV_KEY=your_datagov_api_key_here
DATAGOV_RESOURCE_ID=your_resource_id_here
INGEST_STATE=Uttar Pradesh
NEXT_PUBLIC_API_URL=http://your-server-ip:8000
```

**To get data.gov.in API key:**
1. Visit https://data.gov.in/
2. Register/login
3. Go to your profile/API section
4. Generate an API key
5. Find the MGNREGA dataset resource ID

## Step 3: Build and Start Services

```bash
# Build and start all services
docker-compose up -d --build

# Check logs
docker-compose logs -f

# Check if services are running
docker-compose ps
```

## Step 4: Initialize Database

```bash
# The database will auto-initialize on first API startup
# But you may want to manually load district boundaries

# Option 1: Load sample districts (without geometry)
docker-compose exec api python /app/scripts/init_db.py

# Option 2: Load districts from GeoJSON (recommended)
# First, get district boundary GeoJSON file and upload to server
docker-compose exec api python /app/scripts/load_districts_geojson.py /path/to/districts.geojson
```

## Step 5: Configure Nginx Reverse Proxy

Create Nginx configuration:

```bash
sudo nano /etc/nginx/sites-available/mgnrega
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or IP

    # Frontend
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api {
        rewrite ^/api/(.*) /$1 break;
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/mgnrega /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 6: Setup SSL with Let's Encrypt

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx -y

# Obtain certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx for HTTPS
```

## Step 7: Update Frontend API URL

After setting up the domain, update `.env`:

```env
NEXT_PUBLIC_API_URL=https://your-domain.com/api
```

Then rebuild the frontend:
```bash
docker-compose up -d --build frontend
```

## Step 8: Initial Data Ingestion

Trigger the data ingestion worker:

```bash
# Run ingestion manually
docker-compose exec worker python -c "from worker import ingest_data; ingest_data()"

# Or wait for the scheduled task (daily at 2 AM UTC)
```

## Maintenance Commands

### View logs
```bash
docker-compose logs -f [service_name]
```

### Restart services
```bash
docker-compose restart [service_name]
```

### Update application
```bash
cd /opt/mgnrega-app
git pull  # if using git
docker-compose up -d --build
```

### Backup database
```bash
docker-compose exec db pg_dump -U app app > backup_$(date +%Y%m%d).sql
```

### Restore database
```bash
docker-compose exec -T db psql -U app app < backup_20240101.sql
```

## Monitoring

### Health checks
- Frontend: http://your-domain.com
- API: http://your-domain.com/api/health
- Database: `docker-compose exec db pg_isready -U app`

### Set up monitoring (optional)
- Prometheus + Grafana for metrics
- Sentry for error tracking
- Uptime monitoring via external services

## Troubleshooting

### Services not starting
```bash
# Check logs
docker-compose logs

# Check container status
docker-compose ps

# Restart all services
docker-compose restart
```

### Database connection issues
```bash
# Check if database is ready
docker-compose exec db pg_isready -U app

# Check database logs
docker-compose logs db
```

### API errors
```bash
# Check API logs
docker-compose logs api

# Test API endpoint
curl http://localhost:8000/health
```

## Security Checklist

- [ ] Changed default database password
- [ ] Set up firewall (UFW)
- [ ] SSL certificate installed
- [ ] API keys stored in `.env` (not in code)
- [ ] Nginx security headers configured
- [ ] Regular backups scheduled
- [ ] Docker images kept up to date

## Next Steps

1. Load actual district boundaries from GeoJSON
2. Configure automated backups
3. Set up monitoring and alerts
4. Optimize for production (CDN, caching, etc.)
5. Scale horizontally if needed (multiple API instances)

