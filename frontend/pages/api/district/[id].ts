// Next.js API Route for district current metrics
import { NextApiRequest, NextApiResponse } from 'next';

// Sample MGNREGA data
const SAMPLE_DATA: Record<number, any> = {
  1: { // Lucknow
    district: { id: 1, state_name: 'Uttar Pradesh', district_name: 'Lucknow' },
    metrics: [
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Lucknow',
        year: 2024,
        month: 10,
        persondays: 185000,
        total_households_worked: 5200,
        avg_days_per_household: 35.6,
        wages_lakhs: 6800.2,
        women_persondays: 61000,
        women_percentage: 33.0,
        snapshot_date: new Date().toISOString(),
      },
    ],
    state_averages: {
      avg_persondays: 150000,
      avg_households: 4500,
      avg_days_per_household: 33.3,
      avg_wages: 5500,
      avg_women_pct: 32.0,
    },
    latest_snapshot_date: new Date().toISOString(),
  },
  3: { // Agra
    district: { id: 3, state_name: 'Uttar Pradesh', district_name: 'Agra' },
    metrics: [
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Agra',
        year: 2024,
        month: 10,
        persondays: 125000,
        total_households_worked: 3500,
        avg_days_per_household: 35.7,
        wages_lakhs: 4500.5,
        women_persondays: 41000,
        women_percentage: 32.8,
        snapshot_date: new Date().toISOString(),
      },
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Agra',
        year: 2024,
        month: 9,
        persondays: 118000,
        total_households_worked: 3300,
        avg_days_per_household: 35.8,
        wages_lakhs: 4200.3,
        women_persondays: 38000,
        women_percentage: 32.2,
        snapshot_date: new Date().toISOString(),
      },
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Agra',
        year: 2024,
        month: 8,
        persondays: 132000,
        total_households_worked: 3600,
        avg_days_per_household: 36.7,
        wages_lakhs: 4800.8,
        women_persondays: 43500,
        women_percentage: 33.0,
        snapshot_date: new Date().toISOString(),
      },
    ],
    state_averages: {
      avg_persondays: 150000,
      avg_households: 4500,
      avg_days_per_household: 33.3,
      avg_wages: 5500,
      avg_women_pct: 32.0,
    },
    latest_snapshot_date: new Date().toISOString(),
  },
  2: { // Kanpur
    district: { id: 2, state_name: 'Uttar Pradesh', district_name: 'Kanpur' },
    metrics: [
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Kanpur',
        year: 2024,
        month: 10,
        persondays: 165000,
        total_households_worked: 4800,
        avg_days_per_household: 34.4,
        wages_lakhs: 6000.5,
        women_persondays: 54500,
        women_percentage: 33.0,
        snapshot_date: new Date().toISOString(),
      },
    ],
    state_averages: {
      avg_persondays: 150000,
      avg_households: 4500,
      avg_days_per_household: 33.3,
      avg_wages: 5500,
      avg_women_pct: 32.0,
    },
    latest_snapshot_date: new Date().toISOString(),
  },
  4: { // Varanasi
    district: { id: 4, state_name: 'Uttar Pradesh', district_name: 'Varanasi' },
    metrics: [
      {
        state_name: 'Uttar Pradesh',
        district_name: 'Varanasi',
        year: 2024,
        month: 10,
        persondays: 142000,
        total_households_worked: 4100,
        avg_days_per_household: 34.6,
        wages_lakhs: 5200.8,
        women_persondays: 46900,
        women_percentage: 33.0,
        snapshot_date: new Date().toISOString(),
      },
    ],
    state_averages: {
      avg_persondays: 150000,
      avg_households: 4500,
      avg_days_per_household: 33.3,
      avg_wages: 5500,
      avg_women_pct: 32.0,
    },
    latest_snapshot_date: new Date().toISOString(),
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const districtId = parseInt(id as string, 10);
    
    const data = SAMPLE_DATA[districtId];
    
    if (!data) {
      return res.status(404).json({ detail: 'District not found' });
    }
    
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

