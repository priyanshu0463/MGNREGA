# This Dockerfile is for Railway deployment
# Railway can use docker-compose.yml directly, but this is an alternative

FROM docker/compose:latest

WORKDIR /app

# Copy docker-compose file
COPY docker-compose.yml .

# Copy all source files
COPY backend/ ./backend/
COPY frontend/ ./frontend/
COPY worker/ ./worker/

# Install docker-compose if not already available
# Railway will handle the actual deployment

CMD ["docker-compose", "up"]

