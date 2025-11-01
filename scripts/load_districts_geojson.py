#!/usr/bin/env python3
"""
Load district boundaries from GeoJSON file
Usage: python load_districts_geojson.py <path_to_geojson_file>
"""
import os
import sys
import json
import psycopg2
from psycopg2.extras import Json

# Add parent directory to path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.db import get_db, return_db

def load_geojson(file_path: str):
    """Load districts from GeoJSON file and insert into database"""
    with open(file_path, 'r') as f:
        geojson = json.load(f)
    
    conn = get_db()
    try:
        cur = conn.cursor()
        
        features = geojson.get('features', [])
        count = 0
        
        for feature in features:
            props = feature.get('properties', {})
            geometry = feature.get('geometry')
            
            if not geometry:
                continue
            
            # Extract district info from properties
            # Adjust these field names based on your GeoJSON structure
            state_name = props.get('state_name') or props.get('STATE') or props.get('State')
            district_name = props.get('district_name') or props.get('DISTRICT') or props.get('District')
            
            if not state_name or not district_name:
                continue
            
            # Convert GeoJSON geometry to PostGIS format
            geometry_json = Json(geometry)
            
            cur.execute("""
                INSERT INTO districts (state_name, district_name, geom)
                VALUES (%s, %s, ST_SetSRID(ST_GeomFromGeoJSON(%s), 4326))
                ON CONFLICT DO NOTHING
            """, (state_name, district_name, json.dumps(geometry)))
            
            count += 1
        
        conn.commit()
        print(f"Loaded {count} districts from GeoJSON")
        cur.close()
        
    except Exception as e:
        conn.rollback()
        print(f"Error loading GeoJSON: {e}")
        raise
    finally:
        return_db(conn)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python load_districts_geojson.py <path_to_geojson_file>")
        sys.exit(1)
    
    geojson_path = sys.argv[1]
    if not os.path.exists(geojson_path):
        print(f"Error: File not found: {geojson_path}")
        sys.exit(1)
    
    load_geojson(geojson_path)

