import React from 'react';
import ProgressBar from '../../components/common/ProgressBar';

export default function MemoryHealthCard({ status, stability, percentage, message }) {
  return (
    <div className="bg-blue-50 p-6 rounded-[2rem] shadow-sm mb-8 relative overflow-hidden">
      <div className="relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1">Memory Health</p>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{status}<br/>{stability}</h2>
          </div>
          <span className="bg-blue-200 text-blue-700 text-[10px] font-bold px-3 py-1.5 rounded-xl shadow-sm">
            {percentage}% Strong
          </span>
        </div>
        
        <ProgressBar progress={percentage} colorClass="bg-blue-500" className="h-2 mb-4" />
        
        <p className="text-xs text-blue-600 leading-relaxed font-medium">
          {message}
        </p>
      </div>
      <div className="absolute top-4 right-4 opacity-10 text-6xl">🧠</div>
    </div>
  );
}