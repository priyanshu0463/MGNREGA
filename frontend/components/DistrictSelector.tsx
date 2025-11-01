import React, { useState, useEffect } from 'react';
import { District } from '../lib/api';
import { apiClient } from '../lib/api';

interface DistrictSelectorProps {
  selectedDistrict: District | null;
  onSelect: (district: District) => void;
  onLocationDetect?: () => void;
}

export default function DistrictSelector({
  selectedDistrict,
  onSelect,
  onLocationDetect,
}: DistrictSelectorProps) {
  const [districts, setDistricts] = useState<District[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDistricts();
  }, []);

  const loadDistricts = async () => {
    try {
      const data = await apiClient.getDistricts();
      setDistricts(data);
    } catch (error) {
      console.error('Error loading districts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDistricts = districts.filter((d) =>
    d.district_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.state_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading districts...</div>;
  }

  return (
    <div className="gov-card">
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search district..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 text-lg border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          />
        </div>
        {onLocationDetect && (
          <button
            onClick={onLocationDetect}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            📍 Use My Location
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-96 overflow-y-auto">
        {filteredDistricts.map((district) => (
          <div
            key={district.id}
            onClick={() => onSelect(district)}
            className={`district-card ${
              selectedDistrict?.id === district.id ? 'selected' : ''
            }`}
          >
            <div>
              <h3 className="text-xl font-semibold">{district.district_name}</h3>
              <p className="text-gray-600 text-sm mt-1">{district.state_name}</p>
            </div>
            {selectedDistrict?.id === district.id && (
              <div className="text-blue-600 text-2xl">✓</div>
            )}
          </div>
        ))}
      </div>

      {filteredDistricts.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No districts found matching &quot;{searchTerm}&quot;
        </div>
      )}
    </div>
  );
}

