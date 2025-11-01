"""
Data models and schemas
"""
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class District(BaseModel):
    id: int
    state_name: str
    district_name: str
    state_code: Optional[str] = None
    district_code: Optional[str] = None

class MGNREGAMetric(BaseModel):
    state_name: str
    district_name: str
    year: int
    month: int
    persondays: float
    total_households_worked: int
    avg_days_per_household: float
    wages_lakhs: float
    women_persondays: float
    women_percentage: float
    snapshot_date: datetime

class DistrictCurrentMetrics(BaseModel):
    district: District
    metrics: List[MGNREGAMetric]
    state_averages: Optional[dict] = None
    latest_snapshot_date: datetime

class TrendDataPoint(BaseModel):
    year: int
    month: int
    value: float
    label: str

class DistrictTrends(BaseModel):
    district_name: str
    trends: dict  # Key: metric_name, Value: List[TrendDataPoint]

class DetectDistrictRequest(BaseModel):
    latitude: float
    longitude: float

class DetectDistrictResponse(BaseModel):
    district_name: Optional[str]
    state_name: Optional[str]
    found: bool

