#!/bin/bash
# Manual script to run data ingestion

docker-compose exec worker python -c "
import sys
import os
sys.path.insert(0, '/app')
from worker.worker import ingest_data
result = ingest_data.delay() if hasattr(ingest_data, 'delay') else ingest_data()
print(result)
"

