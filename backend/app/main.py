"""
FastAPI main application
"""
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Optional
from datetime import datetime, timedelta
import psycopg2.extras
from app.db import get_db, return_db, init_db
from app.models import (
    District, DistrictCurrentMetrics, DistrictTrends,
    DetectDistrictRequest, DetectDistrictResponse, MGNREGAMetric
)

app = FastAPI(title="MGNREGA API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    """Initialize database on startup"""
    init_db()

@app.get("/")
async def root():
    return {"message": "MGNREGA API", "version": "1.0.0"}

@app.get("/health")
async def health():
    """Health check endpoint"""
    try:
        conn = get_db()
        conn.close()
        return_db(conn)
        return {"status": "healthy"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))

@app.get("/districts", response_model=List[District])
async def list_districts(
    state_name: Optional[str] = Query(None, description="Filter by state name")
):
    """List all districts, optionally filtered by state"""
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        if state_name:
            cur.execute("""
                SELECT id, state_name, district_name, state_code, district_code
                FROM districts
                WHERE state_name = %s
                ORDER BY district_name
            """, (state_name,))
        else:
            cur.execute("""
                SELECT id, state_name, district_name, state_code, district_code
                FROM districts
                ORDER BY state_name, district_name
            """)
        
        rows = cur.fetchall()
        cur.close()
        
        return [District(**dict(row)) for row in rows]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        return_db(conn)

@app.get("/district/{district_id}/current", response_model=DistrictCurrentMetrics)
async def get_district_current(district_id: int):
    """Get current metrics for a district"""
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Get district info
        cur.execute("""
            SELECT id, state_name, district_name, state_code, district_code
            FROM districts
            WHERE id = %s
        """, (district_id,))
        
        district_row = cur.fetchone()
        if not district_row:
            raise HTTPException(status_code=404, detail="District not found")
        
        district = District(**dict(district_row))
        
        # Get latest metrics (last 3 months)
        cur.execute("""
            SELECT state_name, district_name, year, month,
                   persondays, total_households_worked, avg_days_per_household,
                   wages_lakhs, women_persondays, women_percentage, snapshot_date
            FROM mgnrega_monthly
            WHERE district_name = %s AND state_name = %s
            ORDER BY year DESC, month DESC
            LIMIT 3
        """, (district.district_name, district.state_name))
        
        metric_rows = cur.fetchall()
        
        # Get state averages for latest month
        if metric_rows:
            latest = metric_rows[0]
            cur.execute("""
                SELECT avg_persondays, avg_households, avg_days_per_household,
                       avg_wages, avg_women_pct
                FROM state_monthly_averages
                WHERE state_name = %s AND year = %s AND month = %s
            """, (district.state_name, latest['year'], latest['month']))
            
            state_avg_row = cur.fetchone()
            state_averages = dict(state_avg_row) if state_avg_row else None
        else:
            state_averages = None
        
        # Get latest snapshot date
        cur.execute("""
            SELECT MAX(snapshot_date) as latest_date
            FROM mgnrega_monthly
        """)
        snapshot_row = cur.fetchone()
        latest_snapshot_date = snapshot_row['latest_date'] if snapshot_row and snapshot_row['latest_date'] else datetime.now()
        
        metrics = [MGNREGAMetric(**dict(row)) for row in metric_rows]
        
        cur.close()
        
        return DistrictCurrentMetrics(
            district=district,
            metrics=metrics,
            state_averages=state_averages,
            latest_snapshot_date=latest_snapshot_date
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        return_db(conn)

@app.get("/district/{district_id}/trends", response_model=DistrictTrends)
async def get_district_trends(
    district_id: int,
    months: int = Query(12, description="Number of months of trend data")
):
    """Get trend data for a district"""
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # Get district name
        cur.execute("""
            SELECT district_name FROM districts WHERE id = %s
        """, (district_id,))
        
        district_row = cur.fetchone()
        if not district_row:
            raise HTTPException(status_code=404, detail="District not found")
        
        district_name = district_row['district_name']
        
        # Get trend data for last N months
        cur.execute("""
            SELECT year, month, persondays, total_households_worked,
                   avg_days_per_household, wages_lakhs, women_percentage
            FROM mgnrega_monthly
            WHERE district_name = %s
            ORDER BY year DESC, month DESC
            LIMIT %s
        """, (district_name, months))
        
        rows = cur.fetchall()
        cur.close()
        
        # Format trends
        trends = {
            "persondays": [
                {
                    "year": r['year'],
                    "month": r['month'],
                    "value": float(r['persondays'] or 0),
                    "label": f"{r['year']}-{r['month']:02d}"
                }
                for r in reversed(rows)
            ],
            "households": [
                {
                    "year": r['year'],
                    "month": r['month'],
                    "value": float(r['total_households_worked'] or 0),
                    "label": f"{r['year']}-{r['month']:02d}"
                }
                for r in reversed(rows)
            ],
            "avg_days": [
                {
                    "year": r['year'],
                    "month": r['month'],
                    "value": float(r['avg_days_per_household'] or 0),
                    "label": f"{r['year']}-{r['month']:02d}"
                }
                for r in reversed(rows)
            ],
            "wages": [
                {
                    "year": r['year'],
                    "month": r['month'],
                    "value": float(r['wages_lakhs'] or 0),
                    "label": f"{r['year']}-{r['month']:02d}"
                }
                for r in reversed(rows)
            ],
            "women_pct": [
                {
                    "year": r['year'],
                    "month": r['month'],
                    "value": float(r['women_percentage'] or 0),
                    "label": f"{r['year']}-{r['month']:02d}"
                }
                for r in reversed(rows)
            ]
        }
        
        return DistrictTrends(district_name=district_name, trends=trends)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        return_db(conn)

@app.post("/detect-district", response_model=DetectDistrictResponse)
async def detect_district(request: DetectDistrictRequest):
    """Detect district from latitude/longitude"""
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        
        # PostGIS point-in-polygon query
        cur.execute("""
            SELECT district_name, state_name
            FROM districts
            WHERE ST_Contains(geom, ST_SetSRID(ST_Point(%s, %s), 4326))
            LIMIT 1
        """, (request.longitude, request.latitude))
        
        row = cur.fetchone()
        cur.close()
        
        if row:
            return DetectDistrictResponse(
                district_name=row['district_name'],
                state_name=row['state_name'],
                found=True
            )
        else:
            return DetectDistrictResponse(
                district_name=None,
                state_name=None,
                found=False
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        return_db(conn)

@app.get("/snapshot-date")
async def get_snapshot_date():
    """Get the latest snapshot date"""
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute("""
            SELECT MAX(snapshot_date) as latest_date
            FROM mgnrega_monthly
        """)
        row = cur.fetchone()
        cur.close()
        
        return {
            "snapshot_date": row['latest_date'].isoformat() if row and row['latest_date'] else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        return_db(conn)

