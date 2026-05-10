import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import AdminMetricsWidget from '../../features/admin/AdminMetricsWidget';
import UsersDataTable from '../../features/admin/UsersDataTable';

export default function AdminDashboard() {
  return (
    <PageWrapper role="ADMIN" userName="Admin Manager" activePath="/admin/dashboard">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor the NeuroBridge platform activity.</p>
        </div>

        <AdminMetricsWidget />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <UsersDataTable />
          </div>
          <div className="space-y-6">
            <div className="bg-orange-50 rounded-2xl p-6 border border-orange-100">
              <h3 className="font-bold text-gray-900 mb-2">Required Actions</h3>
              <p className="text-sm text-gray-600 mb-4">The AI system generated 7 new materials and quizzes that require human validation.</p>
              <button className="w-full bg-orange-200 text-orange-900 py-2 rounded-xl text-sm font-bold">
                Go to Review
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}