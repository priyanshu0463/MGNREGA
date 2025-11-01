"""
Database models and connection handling
"""
import os
from typing import Optional
import psycopg2
from psycopg2.extras import RealDictCursor
from psycopg2.pool import SimpleConnectionPool

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://app:secret@db:5432/app")

# Connection pool
pool: Optional[SimpleConnectionPool] = None

def get_pool():
    global pool
    if pool is None:
        pool = SimpleConnectionPool(
            minconn=1,
            maxconn=10,
            dsn=DATABASE_URL
        )
    return pool

def get_db():
    """Get database connection from pool"""
    return get_pool().getconn()

def return_db(conn):
    """Return connection to pool"""
    get_pool().putconn(conn)

def init_db():
    """Initialize database schema"""
    conn = get_db()
    try:
        cur = conn.cursor()
        
        # Enable PostGIS
        cur.execute("CREATE EXTENSION IF NOT EXISTS postgis;")
        
        # Districts table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS districts (
                id SERIAL PRIMARY KEY,
                state_name TEXT NOT NULL,
                district_name TEXT NOT NULL,
                state_code TEXT,
                district_code TEXT,
                geom GEOMETRY(MULTIPOLYGON, 4326),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
            );
        """)
        
        # Create spatial index
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_districts_geom 
            ON districts USING GIST(geom);
        """)
        
        # MGNREGA monthly metrics table
        cur.execute("""
            CREATE TABLE IF NOT EXISTS mgnrega_monthly (
                id SERIAL PRIMARY KEY,
                state_name TEXT NOT NULL,
                district_name TEXT NOT NULL,
                state_code TEXT,
                district_code TEXT,
                year INT NOT NULL,
                month INT NOT NULL,
                persondays NUMERIC DEFAULT 0,
                total_households_worked INT DEFAULT 0,
                avg_days_per_household NUMERIC DEFAULT 0,
                wages_lakhs NUMERIC DEFAULT 0,
                women_persondays NUMERIC DEFAULT 0,
                women_percentage NUMERIC DEFAULT 0,
                snapshot_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
                raw JSONB,
                UNIQUE(state_name, district_name, year, month)
            );
        """)
        
        # Indexes for fast lookups
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_mgnrega_lookup 
            ON mgnrega_monthly (state_name, district_name, year, month);
        """)
        
        cur.execute("""
            CREATE INDEX IF NOT EXISTS idx_mgnrega_snapshot 
            ON mgnrega_monthly (snapshot_date);
        """)
        
        # Materialized view for state averages
        cur.execute("""
            CREATE MATERIALIZED VIEW IF NOT EXISTS state_monthly_averages AS
            SELECT 
                state_name,
                year,
                month,
                AVG(persondays) as avg_persondays,
                AVG(total_households_worked) as avg_households,
                AVG(avg_days_per_household) as avg_days_per_household,
                AVG(wages_lakhs) as avg_wages,
                AVG(women_percentage) as avg_women_pct,
                MAX(snapshot_date) as snapshot_date
            FROM mgnrega_monthly
            GROUP BY state_name, year, month;
        """)
        
        cur.execute("""
            CREATE UNIQUE INDEX IF NOT EXISTS idx_state_avg_lookup 
            ON state_monthly_averages (state_name, year, month);
        """)
        
        conn.commit()
        cur.close()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        return_db(conn)

