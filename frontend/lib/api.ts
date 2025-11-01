import axios from 'axios';

// Primary: External backend API (FastAPI)
// Fallback: Next.js API routes (frontend API routes)
const BACKEND_API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const FRONTEND_API_URL = ''; // Same origin - Next.js API routes

// Create two axios instances
const backendApi = axios.create({
  baseURL: BACKEND_API_URL,
  timeout: 5000, // Shorter timeout for faster fallback
});

const frontendApi = axios.create({
  baseURL: FRONTEND_API_URL,
  timeout: 10000,
});

// Helper function to try backend first, fallback to frontend
async function tryBackendThenFrontend<T>(
  backendCall: () => Promise<T>,
  frontendCall: () => Promise<T>
): Promise<T> {
  try {
    // Try backend first
    return await backendCall();
  } catch (error: any) {
    // If backend fails (network error, timeout, 5xx), use frontend fallback
    if (
      !error.response || 
      error.code === 'ECONNREFUSED' || 
      error.code === 'ETIMEDOUT' ||
      error.response?.status >= 500
    ) {
      console.warn('Backend unavailable, using frontend fallback');
      try {
        return await frontendCall();
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    // If it's a client error (4xx), throw original error
    throw error;
  }
}

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
    
    return tryBackendThenFrontend(
      // Backend call
      async () => {
        const response = await backendApi.get('/districts', { params });
        return response.data;
      },
      // Frontend fallback
      async () => {
        const response = await frontendApi.get('/api/districts', { params });
        return response.data;
      }
    );
  },

  getDistrictCurrent: async (districtId: number): Promise<DistrictCurrentMetrics> => {
    return tryBackendThenFrontend(
      // Backend call
      async () => {
        const response = await backendApi.get(`/district/${districtId}/current`);
        return response.data;
      },
      // Frontend fallback
      async () => {
        const response = await frontendApi.get(`/api/district/${districtId}`);
        return response.data;
      }
    );
  },

  getDistrictTrends: async (districtId: number, months: number = 12): Promise<DistrictTrends> => {
    return tryBackendThenFrontend(
      // Backend call
      async () => {
        const response = await backendApi.get(`/district/${districtId}/trends`, {
          params: { months },
        });
        return response.data;
      },
      // Frontend fallback
      async () => {
        const response = await frontendApi.get(`/api/district/${districtId}/trends`, {
          params: { months },
        });
        return response.data;
      }
    );
  },

  detectDistrict: async (latitude: number, longitude: number): Promise<{ district_name?: string; state_name?: string; found: boolean }> => {
    return tryBackendThenFrontend(
      // Backend call
      async () => {
        const response = await backendApi.post('/detect-district', { latitude, longitude });
        return response.data;
      },
      // Frontend fallback
      async () => {
        const response = await frontendApi.post('/api/detect-district', { latitude, longitude });
        return response.data;
      }
    );
  },

  getSnapshotDate: async (): Promise<{ snapshot_date?: string }> => {
    return tryBackendThenFrontend(
      // Backend call
      async () => {
        const response = await backendApi.get('/snapshot-date');
        return response.data;
      },
      // Frontend fallback
      async () => {
        const response = await frontendApi.get('/api/snapshot-date');
        return response.data;
      }
    );
  },
};

