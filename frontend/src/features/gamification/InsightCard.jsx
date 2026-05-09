import React from 'react';

export default function InsightCard({ title, content, badgeText }) {
  return (
    <div className="bg-orange-50 p-6 rounded-3xl shadow-sm border border-orange-100/50">
      <span className="bg-white text-xs font-bold px-3 py-1.5 rounded-lg text-gray-700 mb-4 inline-block shadow-sm">
        {badgeText || "Did you know?"}
      </span>
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-700 mb-5 leading-relaxed">{content}</p>
      <button className="text-sm font-bold text-gray-900 flex items-center hover:text-blue-600 transition-colors">
        Explore memory tips <span className="ml-1 text-lg">→</span>
      </button>
    </div>
  );
}