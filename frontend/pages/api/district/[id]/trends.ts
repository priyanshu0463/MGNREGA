// Next.js API Route for district trends
import { NextApiRequest, NextApiResponse } from 'next';

// Sample trends data
const SAMPLE_TRENDS: Record<number, any> = {
  3: { // Agra - 12 months of sample data
    district_name: 'Agra',
    trends: {
      persondays: [
        { year: 2024, month: 8, value: 132000, label: '2024-08' },
        { year: 2024, month: 9, value: 118000, label: '2024-09' },
        { year: 2024, month: 10, value: 125000, label: '2024-10' },
      ],
      households: [
        { year: 2024, month: 8, value: 3600, label: '2024-08' },
        { year: 2024, month: 9, value: 3300, label: '2024-09' },
        { year: 2024, month: 10, value: 3500, label: '2024-10' },
      ],
      avg_days: [
        { year: 2024, month: 8, value: 36.7, label: '2024-08' },
        { year: 2024, month: 9, value: 35.8, label: '2024-09' },
        { year: 2024, month: 10, value: 35.7, label: '2024-10' },
      ],
      wages: [
        { year: 2024, month: 8, value: 4800.8, label: '2024-08' },
        { year: 2024, month: 9, value: 4200.3, label: '2024-09' },
        { year: 2024, month: 10, value: 4500.5, label: '2024-10' },
      ],
      women_pct: [
        { year: 2024, month: 8, value: 33.0, label: '2024-08' },
        { year: 2024, month: 9, value: 32.2, label: '2024-09' },
        { year: 2024, month: 10, value: 32.8, label: '2024-10' },
      ],
    },
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { id } = req.query;
    const districtId = parseInt(id as string, 10);
    
    const data = SAMPLE_TRENDS[districtId] || {
      district_name: 'Unknown',
      trends: {
        persondays: [],
        households: [],
        avg_days: [],
        wages: [],
        women_pct: [],
      },
    };
    
    res.status(200).json(data);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

