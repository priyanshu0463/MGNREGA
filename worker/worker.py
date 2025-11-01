"""
Celery worker for periodic data ingestion
"""
import os
import sys
from celery import Celery
from celery.schedules import crontab

# Add backend to path
sys.path.insert(0, '/app/backend')
from app.ingest import fetch_and_store

# Redis broker URL
REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379/0")

app = Celery('mgnrega_worker', broker=REDIS_URL)

@app.task
def ingest_data():
    """Periodic task to ingest data from data.gov.in"""
    state = os.getenv("INGEST_STATE", "Uttar Pradesh")
    try:
        result = fetch_and_store(state)
        return {"status": "success", "records": result}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# Schedule periodic tasks
app.conf.beat_schedule = {
    'ingest-data-daily': {
        'task': 'worker.worker.ingest_data',
        'schedule': crontab(hour=2, minute=0),  # Run daily at 2 AM
    },
}

app.conf.timezone = 'UTC'

if __name__ == '__main__':
    app.start()

