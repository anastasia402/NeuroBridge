import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import AdminMetricsWidget from '../../features/admin/AdminMetricsWidget';
import UsersDataTable from '../../features/admin/UsersDataTable';

export default function AdminDashboard() {
  const navigate = useNavigate();

  return (
    <PageWrapper role="ADMIN" userName="Admin Manager" activePath="/admin/dashboard">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Overview</h1>
            <p className="text-gray-400 text-sm mt-1">Monitor the NeuroBridge platform activity.</p>
          </div>
          <div className="flex space-x-3">
            <button
              onClick={() => navigate('/admin/settings')}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <span>⚙️</span>
              <span>Settings</span>
            </button>
            <button
              onClick={() => navigate('/admin/quizzes')}
              className="flex items-center space-x-2 px-4 py-2 bg-orange-500 rounded-xl text-sm font-semibold text-white hover:bg-orange-600 transition-colors shadow-sm"
            >
              <span>✨</span>
              <span>Review Quizzes</span>
              <span className="bg-white text-orange-600 text-xs font-bold px-1.5 py-0.5 rounded-full">7</span>
            </button>
          </div>
        </div>

        {/* Metrics */}
        <AdminMetricsWidget />

        {/* Main content */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <UsersDataTable />
          </div>

          <div className="space-y-4">
            {/* Required Actions */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 border border-orange-100">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl">✨</span>
                <h3 className="font-bold text-gray-900">Required Actions</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                The AI system generated <span className="font-bold text-orange-600">7 new materials</span> and quizzes that require human validation.
              </p>
              <button
                onClick={() => navigate('/admin/quizzes')}
                className="w-full bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Go to Review →
              </button>
            </div>

            {/* Org Settings */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <div className="flex items-center space-x-2 mb-3">
                <span className="text-xl">🎨</span>
                <h3 className="font-bold text-gray-900">Branding</h3>
              </div>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">
                Customize theme, logo and organization settings.
              </p>
              <button
                onClick={() => navigate('/admin/settings')}
                className="w-full bg-gray-900 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
              >
                Open Settings
              </button>
            </div>

            {/* Quick stats */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
              <h3 className="font-bold text-gray-900 mb-4">Platform Health</h3>
              <div className="space-y-3">
                {[
                  { label: 'Completion Rate', value: '87%', color: 'bg-green-500' },
                  { label: 'Mentor Availability', value: '64%', color: 'bg-blue-500' },
                  { label: 'Quiz Pass Rate', value: '73%', color: 'bg-purple-500' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="flex justify-between text-xs font-semibold text-gray-600 mb-1">
                      <span>{stat.label}</span>
                      <span>{stat.value}</span>
                    </div>
                    <div className="w-full bg-white rounded-full h-1.5">
                      <div className={`${stat.color} h-1.5 rounded-full`} style={{ width: stat.value }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
