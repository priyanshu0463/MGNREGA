import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

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
    const params = stateName ? { state_name: stateName } : {};
    const response = await api.get('/districts', { params });
    return response.data;
  },

  getDistrictCurrent: async (districtId: number): Promise<DistrictCurrentMetrics> => {
    const response = await api.get(`/district/${districtId}/current`);
    return response.data;
  },

  getDistrictTrends: async (districtId: number, months: number = 12): Promise<DistrictTrends> => {
    const response = await api.get(`/district/${districtId}/trends`, {
      params: { months },
    });
    return response.data;
  },

  detectDistrict: async (latitude: number, longitude: number): Promise<{ district_name?: string; state_name?: string; found: boolean }> => {
    const response = await api.post('/detect-district', { latitude, longitude });
    return response.data;
  },

  getSnapshotDate: async (): Promise<{ snapshot_date?: string }> => {
    const response = await api.get('/snapshot-date');
    return response.data;
  },
};

