#!/usr/bin/env python3
"""
Initialize database with district boundaries
This script should be run after the database is up to load district polygons
"""
import os
import sys
import psycopg2
import json

# Add parent directory to path to import from backend
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.db import get_db, return_db, init_db

def load_sample_districts():
    """Load sample districts for Uttar Pradesh (you'll need to replace with actual GeoJSON data)"""
    conn = get_db()
    try:
        cur = conn.cursor()
        
        # Sample districts - in production, load from GeoJSON file
        # You can get district boundaries from:
        # - OpenStreetMap
        # - State government GIS portals
        # - Data.gov.in resources
        
        sample_districts = [
            {
                "state_name": "Uttar Pradesh",
                "district_name": "Lucknow",
                "state_code": "UP",
                "district_code": "LKO",
                # Note: You'll need to add actual geometry data here
                # This is a placeholder - replace with actual PostGIS geometry
            },
            # Add more districts as needed
        ]
        
        # For now, insert districts without geometry
        # You'll need to update with actual geometry later
        for district in sample_districts:
            cur.execute("""
                INSERT INTO districts (state_name, district_name, state_code, district_code)
                VALUES (%s, %s, %s, %s)
                ON CONFLICT DO NOTHING
            """, (
                district["state_name"],
                district["district_name"],
                district.get("state_code"),
                district.get("district_code")
            ))
        
        conn.commit()
        print(f"Loaded {len(sample_districts)} sample districts")
        cur.close()
        
    except Exception as e:
        conn.rollback()
        print(f"Error loading districts: {e}")
        raise
    finally:
        return_db(conn)

if __name__ == "__main__":
    print("Initializing database...")
    init_db()
    print("Database initialized!")
    
    print("Loading sample districts...")
    load_sample_districts()
    print("Done!")

