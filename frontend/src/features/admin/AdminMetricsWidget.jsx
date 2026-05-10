import React from 'react';

export default function AdminMetricsWidget() {
  const metrics = [
    { title: 'Active Users', value: '1,248', icon: '👥', color: 'bg-blue-50 text-blue-600' },
    { title: 'Quizzes Today', value: '342', icon: '✅', color: 'bg-green-50 text-green-600' },
    { title: 'Mentoring Sessions', value: '18', icon: '💬', color: 'bg-purple-50 text-purple-600' },
    { title: 'Materials in Review', value: '7', icon: '✨', color: 'bg-orange-50 text-orange-600', alert: true },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
      {metrics.map((metric, idx) => (
        <div key={idx} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${metric.color}`}>
            {metric.icon}
          </div>
          <div>
            <h3 className="text-gray-500 text-xs font-bold uppercase tracking-wider">{metric.title}</h3>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-gray-900">{metric.value}</span>
              {metric.alert && <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}