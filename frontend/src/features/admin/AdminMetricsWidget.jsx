import React, { useState, useEffect } from 'react';
import { apiGet } from '../../services/authService';

const METRIC_CONFIG = [
  { key: 'totalUsers',     title: 'Utilizatori Activi', icon: '👥', color: 'bg-blue-50 text-blue-600' },
  { key: 'quizzesToday',   title: 'Quiz-uri Azi',        icon: '✅', color: 'bg-green-50 text-green-600' },
  { key: 'activeSessions', title: 'Sesiuni Active',      icon: '💬', color: 'bg-purple-50 text-purple-600' },
  { key: 'pendingQuizzes', title: 'Quiz-uri în Așteptare', icon: '✨', color: 'bg-orange-50 text-orange-600', alert: true },
];

export default function AdminMetricsWidget() {
  const [stats, setStats]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/admin/dashboard/stats')
      .then(setStats)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {METRIC_CONFIG.map(metric => {
        const value = stats ? stats[metric.key] : null;
        return (
          <div key={metric.key} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${metric.color}`}>
              {metric.icon}
            </div>
            <p className="text-gray-500 text-xs font-bold uppercase tracking-wider leading-tight mb-1">
              {metric.title}
            </p>
            <div className="flex items-center space-x-2">
              {loading ? (
                <div className="h-7 w-12 bg-gray-100 rounded animate-pulse" />
              ) : (
                <span className="text-2xl font-bold text-gray-900">
                  {value?.toLocaleString() ?? '—'}
                </span>
              )}
              {metric.alert && !loading && value > 0 && (
                <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
