import axios from 'axios';

// Use Next.js API routes (same origin - no CORS issues)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export interface District {
  id: number;
  state_name: string;
  district_name: string;
  state_code?: string;
  district_code?: string;
}

export interface MGNREGAMetric {
  state_name: string;
  district_name: string;
  year: number;
  month: number;
  persondays: number;
  total_households_worked: number;
  avg_days_per_household: number;
  wages_lakhs: number;
  women_persondays: number;
  women_percentage: number;
  snapshot_date: string;
}

export interface DistrictCurrentMetrics {
  district: District;
  metrics: MGNREGAMetric[];
  state_averages?: {
    avg_persondays?: number;
    avg_households?: number;
    avg_days_per_household?: number;
    avg_wages?: number;
    avg_women_pct?: number;
  };
  latest_snapshot_date: string;
}

export interface TrendDataPoint {
  year: number;
  month: number;
  value: number;
  label: string;
}

export interface DistrictTrends {
  district_name: string;
  trends: {
    persondays: TrendDataPoint[];
    households: TrendDataPoint[];
    avg_days: TrendDataPoint[];
    wages: TrendDataPoint[];
    women_pct: TrendDataPoint[];
  };
}

export const apiClient = {
  getDistricts: async (stateName?: string): Promise<District[]> => {
    const url = API_BASE_URL ? `/api/districts` : '/api/districts';
    const params = stateName ? { state_name: stateName } : {};
    const response = await api.get(url, { params });
    return response.data;
  },

  getDistrictCurrent: async (districtId: number): Promise<DistrictCurrentMetrics> => {
    const url = API_BASE_URL ? `/api/district/${districtId}` : `/api/district/${districtId}`;
    const response = await api.get(url);
    return response.data;
  },

  getDistrictTrends: async (districtId: number, months: number = 12): Promise<DistrictTrends> => {
    const url = API_BASE_URL ? `/api/district/${districtId}/trends` : `/api/district/${districtId}/trends`;
    const response = await api.get(url, {
      params: { months },
    });
    return response.data;
  },

  detectDistrict: async (latitude: number, longitude: number): Promise<{ district_name?: string; state_name?: string; found: boolean }> => {
    const url = API_BASE_URL ? '/api/detect-district' : '/api/detect-district';
    const response = await api.post(url, { latitude, longitude });
    return response.data;
  },

  getSnapshotDate: async (): Promise<{ snapshot_date?: string }> => {
    const url = API_BASE_URL ? '/api/snapshot-date' : '/api/snapshot-date';
    const response = await api.get(url);
    return response.data;
  },
};

