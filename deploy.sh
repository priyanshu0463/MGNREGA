#!/bin/bash
# Simple deployment script for VPS

set -e

echo "🚀 Starting MGNREGA Dashboard Deployment..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please copy env.example to .env and configure it."
    exit 1
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

echo "✅ Prerequisites checked"

# Stop existing containers
echo "🛑 Stopping existing containers..."
docker-compose down || true

# Build and start services
echo "🔨 Building and starting services..."
docker-compose up -d --build

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 30

# Initialize database
echo "🗄️ Initializing database..."
docker-compose exec -T api python -c "from app.db import init_db; init_db()" || echo "⚠️ Database initialization had issues - may already be initialized"

# Check service health
echo "🏥 Checking service health..."
docker-compose ps

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📊 Services:"
echo "  - Frontend: http://localhost:3000"
echo "  - API: http://localhost:8000"
echo "  - API Docs: http://localhost:8000/docs"
echo ""
echo "📝 Next steps:"
echo "  1. Load district boundaries (see DEPLOYMENT.md)"
echo "  2. Run data ingestion: ./scripts/run_ingestion.sh"
echo "  3. Configure Nginx reverse proxy (see DEPLOYMENT.md)"
echo "  4. Set up SSL with Let's Encrypt"

