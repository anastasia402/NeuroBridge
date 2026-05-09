import React from 'react';

export default function Input({ label, error, className = '', ...props }) {
  return (
    <div className={`flex flex-col mb-4 ${className}`}>
      {label && <label className="text-xs font-bold text-gray-700 mb-1">{label}</label>}
      <input 
        className={`bg-gray-50 border ${error ? 'border-red-500' : 'border-transparent focus:border-gray-300'} rounded-xl p-3 text-sm focus:outline-none transition-colors`}
        {...props}
      />
      {error && <span className="text-xs text-red-500 mt-1">{error}</span>}
    </div>
  );
}