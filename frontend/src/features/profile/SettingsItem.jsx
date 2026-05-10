import React from 'react';

export default function SettingsItem({ icon, label, subtext, value, isToggle, onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer transition-colors"
    >
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-blue-50/50 rounded-xl flex items-center justify-center text-blue-500 text-lg">
          {icon}
        </div>
        <div>
          <h4 className="text-sm font-bold text-gray-900 leading-none mb-1">{label}</h4>
          {subtext && <p className="text-[10px] text-gray-400 font-medium">{subtext}</p>}
        </div>
      </div>
      
      <div className="flex items-center">
        {value && <span className="text-xs font-bold text-gray-400 mr-3">{value}</span>}
        {isToggle ? (
          <div className="w-10 h-5 bg-blue-400 rounded-full relative shadow-inner">
            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"></div>
          </div>
        ) : (
          <span className="text-gray-300 text-lg">›</span>
        )}
      </div>
    </div>
  );
}