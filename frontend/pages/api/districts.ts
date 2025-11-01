// Next.js API Route - Serverless function
import { NextApiRequest, NextApiResponse } from 'next';

// Sample districts data (can be replaced with API call)
const SAMPLE_DISTRICTS = [
  { id: 1, state_name: 'Uttar Pradesh', district_name: 'Lucknow' },
  { id: 2, state_name: 'Uttar Pradesh', district_name: 'Kanpur' },
  { id: 3, state_name: 'Uttar Pradesh', district_name: 'Agra' },
  { id: 4, state_name: 'Uttar Pradesh', district_name: 'Varanasi' },
  { id: 5, state_name: 'Uttar Pradesh', district_name: 'Allahabad' },
  { id: 6, state_name: 'Uttar Pradesh', district_name: 'Meerut' },
  { id: 7, state_name: 'Uttar Pradesh', district_name: 'Ghaziabad' },
];

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    const { state_name } = req.query;
    
    let districts = SAMPLE_DISTRICTS;
    if (state_name) {
      districts = districts.filter(d => d.state_name === state_name);
    }
    
    res.status(200).json(districts);
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

