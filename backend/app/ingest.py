"""
Data ingestion script for data.gov.in
"""
import os
import time
import json
import logging
import requests
from datetime import datetime, timedelta
from typing import List, Dict, Optional
import psycopg2
from psycopg2.extras import execute_values

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DATAGOV_KEY = os.getenv("DATAGOV_KEY", "")
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app:secret@db:5432/app")
BASE_URL = "https://api.data.gov.in/resource"

# You'll need to replace RESOURCE_ID with actual resource ID from data.gov.in
RESOURCE_ID = os.getenv("DATAGOV_RESOURCE_ID", "")

def exponential_backoff(max_retries=5, base_delay=1):
    """Exponential backoff decorator"""
    def decorator(func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return func(*args, **kwargs)
                except requests.exceptions.RequestException as e:
                    if attempt == max_retries - 1:
                        raise
                    
                    if isinstance(e.response, requests.Response):
                        if e.response.status_code == 429:
                            retry_after = int(e.response.headers.get("Retry-After", base_delay * (2 ** attempt)))
                            logger.warning(f"Rate limited. Waiting {retry_after} seconds...")
                            time.sleep(retry_after)
                            continue
                    
                    delay = base_delay * (2 ** attempt)
                    logger.warning(f"Request failed (attempt {attempt + 1}/{max_retries}). Retrying in {delay}s...")
                    time.sleep(delay)
        return wrapper
    return decorator

@exponential_backoff(max_retries=5)
def fetch_page(params: Dict, page: int = 1, per_page: int = 500) -> Optional[Dict]:
    """Fetch a page of data from data.gov.in"""
    if not DATAGOV_KEY:
        logger.warning("DATAGOV_KEY not set. Skipping API call.")
        return None
    
    if not RESOURCE_ID:
        logger.warning("DATAGOV_RESOURCE_ID not set. Skipping API call.")
        return None
    
    params_with_pagination = {
        **params,
        "api-key": DATAGOV_KEY,
        "format": "json",
        "limit": per_page,
        "offset": (page - 1) * per_page
    }
    
    url = f"{BASE_URL}/{RESOURCE_ID}"
    logger.info(f"Fetching page {page} from {url}")
    
    response = requests.get(url, params=params_with_pagination, timeout=30)
    
    if response.status_code == 429:
        retry_after = int(response.headers.get("Retry-After", 60))
        logger.warning(f"Rate limited. Waiting {retry_after} seconds...")
        time.sleep(retry_after)
        return fetch_page(params, page, per_page)
    
    response.raise_for_status()
    return response.json()

def normalize_record(record: Dict) -> Optional[Dict]:
    """Normalize a record from data.gov.in to our schema"""
    try:
        # Map fields - adjust these based on actual data.gov.in field names
        # This is a template - you'll need to adjust field mappings based on actual API response
        
        year = int(record.get("year") or record.get("financial_year") or datetime.now().year)
        month = int(record.get("month") or 1)
        
        persondays = float(record.get("persondays") or record.get("person_days") or 0)
        households = int(record.get("total_households_worked") or record.get("households") or 0)
        
        avg_days = float(record.get("avg_days_per_household") or 
                        record.get("average_days_of_employment_provided_per_household") or 0)
        
        wages = float(record.get("wages_lakhs") or 
                     record.get("total_exp_rs__in_lakhs__") or 
                     record.get("wages_disbursed") or 0)
        
        women_persondays = float(record.get("women_persondays") or 
                                record.get("women_person_days") or 0)
        
        # Calculate women percentage
        women_pct = (women_persondays / persondays * 100) if persondays > 0 else 0
        
        return {
            "state_name": record.get("state_name") or record.get("state"),
            "district_name": record.get("district_name") or record.get("district"),
            "state_code": record.get("state_code"),
            "district_code": record.get("district_code"),
            "year": year,
            "month": month,
            "persondays": persondays,
            "total_households_worked": households,
            "avg_days_per_household": avg_days,
            "wages_lakhs": wages,
            "women_persondays": women_persondays,
            "women_percentage": women_pct,
            "raw": json.dumps(record)
        }
    except Exception as e:
        logger.error(f"Error normalizing record: {e}")
        logger.error(f"Record: {record}")
        return None

def store_records(records: List[Dict]):
    """Store normalized records in database"""
    if not records:
        return
    
    conn = psycopg2.connect(DATABASE_URL)
    try:
        cur = conn.cursor()
        
        # Prepare data for upsert
        insert_data = []
        for rec in records:
            insert_data.append((
                rec["state_name"],
                rec["district_name"],
                rec.get("state_code"),
                rec.get("district_code"),
                rec["year"],
                rec["month"],
                rec["persondays"],
                rec["total_households_worked"],
                rec["avg_days_per_household"],
                rec["wages_lakhs"],
                rec["women_persondays"],
                rec["women_percentage"],
                rec["raw"]
            ))
        
        # Upsert using ON CONFLICT
        execute_values(
            cur,
            """
            INSERT INTO mgnrega_monthly (
                state_name, district_name, state_code, district_code,
                year, month, persondays, total_households_worked,
                avg_days_per_household, wages_lakhs, women_persondays,
                women_percentage, raw
            )
            VALUES %s
            ON CONFLICT (state_name, district_name, year, month)
            DO UPDATE SET
                persondays = EXCLUDED.persondays,
                total_households_worked = EXCLUDED.total_households_worked,
                avg_days_per_household = EXCLUDED.avg_days_per_household,
                wages_lakhs = EXCLUDED.wages_lakhs,
                women_persondays = EXCLUDED.women_persondays,
                women_percentage = EXCLUDED.women_percentage,
                raw = EXCLUDED.raw,
                snapshot_date = now()
            """,
            insert_data
        )
        
        conn.commit()
        logger.info(f"Stored {len(records)} records")
        cur.close()
    except Exception as e:
        conn.rollback()
        logger.error(f"Error storing records: {e}")
        raise
    finally:
        conn.close()

def refresh_state_averages():
    """Refresh materialized view for state averages"""
    conn = psycopg2.connect(DATABASE_URL)
    try:
        cur = conn.cursor()
        cur.execute("REFRESH MATERIALIZED VIEW CONCURRENTLY state_monthly_averages;")
        conn.commit()
        logger.info("Refreshed state averages")
        cur.close()
    except Exception as e:
        logger.error(f"Error refreshing averages: {e}")
    finally:
        conn.close()

def fetch_and_store(state: str = "Uttar Pradesh"):
    """Main ingestion function"""
    logger.info(f"Starting data ingestion for {state}")
    
    params = {
        "filters[state_name]": state
    }
    
    page = 1
    total_records = 0
    
    while True:
        try:
            data = fetch_page(params, page=page)
            
            if not data:
                logger.warning("No data returned from API")
                break
            
            records = data.get("records", [])
            
            if not records:
                logger.info("No more records to fetch")
                break
            
            # Normalize records
            normalized = []
            for rec in records:
                normalized_rec = normalize_record(rec)
                if normalized_rec:
                    normalized.append(normalized_rec)
            
            # Store in database
            if normalized:
                store_records(normalized)
                total_records += len(normalized)
            
            # Check if there are more pages
            if len(records) < 500:  # Assuming 500 is per_page
                break
            
            page += 1
            time.sleep(0.5)  # Be nice to the API
            
        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {e}")
            break
        except Exception as e:
            logger.error(f"Unexpected error: {e}")
            break
    
    # Refresh state averages
    refresh_state_averages()
    
    logger.info(f"Ingestion complete. Total records processed: {total_records}")
    return total_records

if __name__ == "__main__":
    state = os.getenv("INGEST_STATE", "Uttar Pradesh")
    fetch_and_store(state)

