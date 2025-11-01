// Next.js API Route for district detection (simplified - returns sample)
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    const { latitude, longitude } = req.body;
    
    // Simplified: For now, return a default district
    // In production, you could use a geocoding service or static mapping
    res.status(200).json({
      district_name: 'Lucknow',
      state_name: 'Uttar Pradesh',
      found: true,
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

