import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import DistrictSelector from '../components/DistrictSelector';
import KPICard from '../components/KPICard';
import { District, apiClient } from '../lib/api';
import { FiUsers, FiCalendar, FiDollarSign, FiUser } from 'react-icons/fi';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';

export default function Home() {
  const router = useRouter();
  const locale = router.locale || 'en';

  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [trends, setTrends] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [snapshotDate, setSnapshotDate] = useState<string | null>(null);
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    checkSnapshotDate();
    checkOnlineStatus();
    
    // Restore selected district from localStorage
    const savedDistrict = localStorage.getItem('selectedDistrict');
    if (savedDistrict) {
      try {
        const district = JSON.parse(savedDistrict);
        setSelectedDistrict(district);
        loadDistrictData(district);
      } catch (e) {
        console.error('Error restoring district:', e);
      }
    }
  }, []);

  useEffect(() => {
    if (selectedDistrict) {
      loadDistrictData(selectedDistrict);
    }
  }, [selectedDistrict]);

  const checkOnlineStatus = () => {
    setOffline(!navigator.onLine);
    window.addEventListener('online', () => setOffline(false));
    window.addEventListener('offline', () => setOffline(true));
  };

  const checkSnapshotDate = async () => {
    try {
      const data = await apiClient.getSnapshotDate();
      setSnapshotDate(data.snapshot_date || null);
    } catch (error) {
      console.error('Error checking snapshot date:', error);
    }
  };

  const loadDistrictData = async (district: District) => {
    setLoading(true);
    try {
      const [currentData, trendsData] = await Promise.all([
        apiClient.getDistrictCurrent(district.id),
        apiClient.getDistrictTrends(district.id, 12),
      ]);
      setMetrics(currentData);
      setTrends(trendsData);
    } catch (error) {
      console.error('Error loading district data:', error);
      setOffline(true);
    } finally {
      setLoading(false);
    }
  };

  const handleDistrictSelect = (district: District) => {
    setSelectedDistrict(district);
    localStorage.setItem('selectedDistrict', JSON.stringify(district));
  };

  const handleLocationDetect = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const result = await apiClient.detectDistrict(
            position.coords.latitude,
            position.coords.longitude
          );
          if (result.found && result.district_name) {
            const districts = await apiClient.getDistricts();
            const district = districts.find(
              (d) => d.district_name === result.district_name
            );
            if (district) {
              handleDistrictSelect(district);
            }
          } else {
            alert('Could not detect your district. Please select manually.');
          }
        } catch (error) {
          console.error('Error detecting district:', error);
          alert('Error detecting district. Please select manually.');
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
        alert('Could not get your location. Please select district manually.');
      }
    );
  };

  const latestMetric = metrics?.metrics?.[0];

  return (
    <Layout title="MGNREGA Dashboard">
      {offline && (
        <div className="offline-banner">
          ⚠️ Offline Mode - Showing cached data
          {snapshotDate && ` (Snapshot: ${new Date(snapshotDate).toLocaleDateString()})`}
        </div>
      )}

      {snapshotDate && !offline && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4 text-sm text-blue-800">
          Latest data snapshot: {new Date(snapshotDate).toLocaleDateString()}
        </div>
      )}

      <DistrictSelector
        selectedDistrict={selectedDistrict}
        onSelect={handleDistrictSelect}
        onLocationDetect={handleLocationDetect}
      />

      {loading && (
        <div className="loading">Loading district data...</div>
      )}

      {!loading && metrics && latestMetric && (
        <div>
          <h2 className="text-3xl font-bold mb-6 mt-8">
            {metrics.district.district_name}, {metrics.district.state_name}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Person-days generated */}
            <KPICard
              title={locale === 'hi' ? 'लोग-दिन उत्पन्न' : 'Person-days Generated'}
              value={latestMetric.persondays || 0}
              subtitle={locale === 'hi' ? `महीना: ${latestMetric.month}/${latestMetric.year}` : `Month: ${latestMetric.month}/${latestMetric.year}`}
              status={latestMetric.persondays > (metrics.state_averages?.avg_persondays || 0) ? 'good' : latestMetric.persondays > (metrics.state_averages?.avg_persondays || 0) * 0.7 ? 'medium' : 'low'}
              explanation={locale === 'hi' ? `इस महीने ${latestMetric.persondays.toLocaleString('en-IN')} लोग-दिन उत्पन्न हुए।` : `This month, ${latestMetric.persondays.toLocaleString('en-IN')} person-days were generated.`}
              explanationHi={`इस महीने ${latestMetric.persondays.toLocaleString('en-IN')} लोग-दिन उत्पन्न हुए।`}
              icon={<FiUsers />}
              locale={locale}
              stateAverage={metrics.state_averages?.avg_persondays}
            />

            {/* Total households worked */}
            <KPICard
              title={locale === 'hi' ? 'कुल परिवार जिन्हें काम मिला' : 'Total Households Worked'}
              value={latestMetric.total_households_worked || 0}
              subtitle={locale === 'hi' ? 'वर्ष में अब तक' : 'Year to date'}
              status={latestMetric.total_households_worked > (metrics.state_averages?.avg_households || 0) ? 'good' : latestMetric.total_households_worked > (metrics.state_averages?.avg_households || 0) * 0.7 ? 'medium' : 'low'}
              explanation={locale === 'hi' ? `${latestMetric.total_households_worked.toLocaleString('en-IN')} परिवारों को काम मिला।` : `${latestMetric.total_households_worked.toLocaleString('en-IN')} households received work.`}
              explanationHi={`${latestMetric.total_households_worked.toLocaleString('en-IN')} परिवारों को काम मिला।`}
              icon={<FiUser />}
              locale={locale}
              stateAverage={metrics.state_averages?.avg_households}
            />

            {/* Average days per household */}
            <KPICard
              title={locale === 'hi' ? 'प्रति परिवार औसत दिन' : 'Average Days per Household'}
              value={latestMetric.avg_days_per_household?.toFixed(1) || '0'}
              subtitle={latestMetric.avg_days_per_household < 50 ? (locale === 'hi' ? 'कई परिवारों को 100 दिन नहीं मिल रहे' : 'Many households not getting 100 days') : (locale === 'hi' ? 'अच्छा प्रदर्शन' : 'Good performance')}
              status={latestMetric.avg_days_per_household >= 50 ? 'good' : latestMetric.avg_days_per_household >= 30 ? 'medium' : 'low'}
              explanation={locale === 'hi' ? `प्रति परिवार औसत ${latestMetric.avg_days_per_household.toFixed(1)} दिन काम मिला।` : `Average of ${latestMetric.avg_days_per_household.toFixed(1)} days of work per household.`}
              explanationHi={`प्रति परिवार औसत ${latestMetric.avg_days_per_household.toFixed(1)} दिन काम मिला।`}
              icon={<FiCalendar />}
              locale={locale}
              stateAverage={metrics.state_averages?.avg_days_per_household}
            />

            {/* Wages disbursed */}
            <KPICard
              title={locale === 'hi' ? 'मजदूरी वितरित' : 'Wages Disbursed'}
              value={latestMetric.wages_lakhs ? `₹${(latestMetric.wages_lakhs * 100000).toLocaleString('en-IN')}` : '₹0'}
              subtitle={locale === 'hi' ? 'पिछले महीने' : 'Last month'}
              status={latestMetric.wages_lakhs > (metrics.state_averages?.avg_wages || 0) ? 'good' : latestMetric.wages_lakhs > (metrics.state_averages?.avg_wages || 0) * 0.7 ? 'medium' : 'low'}
              explanation={locale === 'hi' ? `पिछले महीने ₹${(latestMetric.wages_lakhs * 100000).toLocaleString('en-IN')} मजदूरी वितरित की गई।` : `Last month, ₹${(latestMetric.wages_lakhs * 100000).toLocaleString('en-IN')} in wages were disbursed.`}
              explanationHi={`पिछले महीने ₹${(latestMetric.wages_lakhs * 100000).toLocaleString('en-IN')} मजदूरी वितरित की गई।`}
              icon={<FiDollarSign />}
              locale={locale}
              stateAverage={metrics.state_averages?.avg_wages ? (metrics.state_averages.avg_wages * 100000) : undefined}
            />

            {/* Women percentage */}
            <KPICard
              title={locale === 'hi' ? 'महिला भागीदारी' : 'Women Participation'}
              value={`${latestMetric.women_percentage?.toFixed(1) || '0'}%`}
              subtitle={locale === 'hi' ? 'लोग-दिन का प्रतिशत' : 'Percentage of person-days'}
              status={latestMetric.women_percentage >= 33 ? 'good' : latestMetric.women_percentage >= 25 ? 'medium' : 'low'}
              explanation={locale === 'hi' ? `महिलाओं की भागीदारी ${latestMetric.women_percentage.toFixed(1)}% है।` : `Women participation is ${latestMetric.women_percentage.toFixed(1)}%.`}
              explanationHi={`महिलाओं की भागीदारी ${latestMetric.women_percentage.toFixed(1)}% है।`}
              icon={<FiUser />}
              locale={locale}
              stateAverage={metrics.state_averages?.avg_women_pct}
            />
          </div>

          {/* Trends section */}
          {trends && trends.trends.persondays.length > 0 && (
            <div className="gov-card mt-8">
              <h3 className="text-2xl font-bold mb-4">
                {locale === 'hi' ? '12 महीने का रुझान' : '12 Month Trends'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    {locale === 'hi' ? 'लोग-दिन' : 'Person-days'}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trends.trends.persondays}>
                      <Line type="monotone" dataKey="value" stroke="#1e40af" strokeWidth={2} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-2">
                    {locale === 'hi' ? 'औसत दिन प्रति परिवार' : 'Avg Days per Household'}
                  </h4>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={trends.trends.avg_days}>
                      <Line type="monotone" dataKey="value" stroke="#059669" strokeWidth={2} />
                      <XAxis dataKey="label" />
                      <YAxis />
                      <Tooltip />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!loading && !metrics && selectedDistrict && (
        <div className="gov-card text-center py-8">
          <p className="text-gray-500">
            {locale === 'hi' ? 'इस जिले के लिए डेटा उपलब्ध नहीं है।' : 'No data available for this district.'}
          </p>
        </div>
      )}
    </Layout>
  );
}

