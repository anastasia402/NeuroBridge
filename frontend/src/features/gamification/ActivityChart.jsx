import React from 'react';

export default function ActivityChart({ title, value, trend, icon, color }) {
  return (
    <div className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm mb-4">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-3">
          <span className="text-lg">{icon}</span>
          <h3 className="font-bold text-gray-900 text-sm">{title}</h3>
        </div>
        <span className={`text-xs font-bold ${trend.startsWith('+') ? 'text-green-500' : 'text-red-500'}`}>
          {trend}
        </span>
      </div>
      
      {/* Mock Chart Area */}
      <div className="h-24 w-full flex items-end space-x-1 px-2">
        {[40, 45, 42, 60, 55, 70, 75].map((h, i) => (
          <div 
            key={i} 
            className={`flex-1 ${color} opacity-20 rounded-t-md`} 
            style={{ height: `${h}%` }}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-3 px-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
          <span key={day} className="text-[10px] text-gray-400 font-bold uppercase">{day}</span>
        ))}
      </div>
    </div>
  );
}