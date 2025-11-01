# Setup Checklist

Follow this checklist to get your MGNREGA Dashboard up and running.

## ✅ Pre-Deployment

- [ ] Docker and Docker Compose installed
- [ ] API key from data.gov.in obtained
- [ ] Resource ID of MGNREGA dataset noted
- [ ] `.env` file created from `env.example`
- [ ] All environment variables configured

## ✅ Local Testing

- [ ] Run `docker-compose up -d`
- [ ] Verify all services start successfully
- [ ] Check database initialization
- [ ] Load sample districts
- [ ] Test data ingestion (may need to adjust field mappings)
- [ ] Access frontend at http://localhost:3000
- [ ] Test API at http://localhost:8000/docs
- [ ] Verify district selection works
- [ ] Test voice/TTS functionality
- [ ] Test geolocation (if district boundaries loaded)

## ✅ Before Production Deployment

- [ ] Read `DEPLOYMENT.md` thoroughly
- [ ] Set up VPS (Ubuntu 22.04 recommended)
- [ ] Secure VPS (firewall, SSH keys)
- [ ] Install Docker and Docker Compose on VPS
- [ ] Upload project files to VPS
- [ ] Configure production `.env` file
- [ ] Test `./deploy.sh` script
- [ ] Set up Nginx reverse proxy
- [ ] Configure SSL with Let's Encrypt
- [ ] Load district boundaries (GeoJSON)
- [ ] Set up automated backups
- [ ] Configure monitoring (optional)

## ✅ Post-Deployment

- [ ] Verify frontend loads correctly
- [ ] Test all API endpoints
- [ ] Verify data ingestion runs successfully
- [ ] Check offline mode works
- [ ] Test on mobile devices
- [ ] Verify PWA installability
- [ ] Check SSL certificate validity
- [ ] Monitor logs for errors
- [ ] Set up regular data ingestion schedule

## ⚠️ Important Notes

1. **PWA Icons**: Create `icon-192.png` and `icon-512.png` in `frontend/public/`
2. **District Boundaries**: Load GeoJSON for geolocation to work
3. **API Key**: Keep your data.gov.in API key secure
4. **Database Password**: Use a strong password in production
5. **Data Mapping**: May need to adjust field mappings in `backend/app/ingest.py` based on actual API response

## 🔧 Troubleshooting

If something doesn't work:

1. Check logs: `docker-compose logs -f [service_name]`
2. Verify environment variables are set correctly
3. Check service health: `docker-compose ps`
4. Review documentation files
5. Test API directly: `curl http://localhost:8000/health`

## 📝 Next Steps After Deployment

1. Monitor application for first 24-48 hours
2. Set up automated backups
3. Configure monitoring and alerts
4. Optimize performance if needed
5. Gather user feedback
6. Plan for scaling if traffic increases

