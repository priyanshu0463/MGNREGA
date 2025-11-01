import React from 'react';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { useTTS } from '../hooks/useTTS';
import { MGNREGAMetric } from '../lib/api';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: number; // percentage change
  status: 'good' | 'medium' | 'low';
  explanation?: string;
  explanationHi?: string;
  icon?: React.ReactNode;
  locale?: string;
  stateAverage?: number;
}

export default function KPICard({
  title,
  value,
  subtitle,
  trend,
  status,
  explanation,
  explanationHi,
  icon,
  locale = 'en',
  stateAverage,
}: KPICardProps) {
  const { speak, stop } = useTTS();
  const explanationText = locale === 'hi' && explanationHi ? explanationHi : (explanation || title);

  const handleListen = () => {
    stop();
    const lang = locale === 'hi' ? 'hi-IN' : 'en-US';
    speak(explanationText, lang);
  };

  const statusClasses = {
    good: 'good border-green-500',
    medium: 'medium border-yellow-500',
    low: 'low border-red-500',
  };

  const statusColors = {
    good: 'text-green-600',
    medium: 'text-yellow-600',
    low: 'text-red-600',
  };

  const formatValue = (val: string | number): string => {
    if (typeof val === 'number') {
      if (val >= 10000000) return `${(val / 10000000).toFixed(2)} Cr`;
      if (val >= 100000) return `${(val / 100000).toFixed(2)} L`;
      if (val >= 1000) return `${(val / 1000).toFixed(2)} K`;
      return val.toLocaleString('en-IN');
    }
    return val;
  };

  return (
    <div className={`kpi-card ${statusClasses[status]}`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="kpi-label">{title}</div>
          {icon && <div className="mt-2 text-3xl">{icon}</div>}
        </div>
        <button
          onClick={handleListen}
          className="voice-button"
          aria-label="Listen to explanation"
        >
          🎧
        </button>
      </div>
      
      <div className={`kpi-value ${statusColors[status]}`}>
        {formatValue(value)}
      </div>
      
      {subtitle && (
        <div className="text-gray-600 text-lg mt-2">{subtitle}</div>
      )}
      
      {stateAverage !== undefined && (
        <div className="text-sm text-gray-500 mt-2">
          State Average: {formatValue(stateAverage)}
        </div>
      )}
      
      {trend !== undefined && trend !== null && (
        <div className="flex items-center gap-2 mt-3">
          {trend > 0 ? (
            <FiTrendingUp className="text-green-600" />
          ) : trend < 0 ? (
            <FiTrendingDown className="text-red-600" />
          ) : (
            <FiMinus className="text-gray-400" />
          )}
          <span className={`text-sm ${trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-400'}`}>
            {trend > 0 ? '+' : ''}{trend.toFixed(1)}% vs previous month
          </span>
        </div>
      )}
    </div>
  );
}

