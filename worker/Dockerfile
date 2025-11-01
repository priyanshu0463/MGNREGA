FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Copy backend app for imports
COPY backend/app ./backend/app

# Copy worker files
COPY worker/requirements.txt .
COPY worker/worker.py .

# Install requirements
RUN pip install --no-cache-dir -r requirements.txt

# Run celery worker
CMD ["celery", "-A", "worker", "worker", "--loglevel=info"]

