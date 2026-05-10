import React from 'react';

export default function ProgressBar({ progress, colorClass = "bg-blue-500", heightClass = "h-2", className = "" }) {
  const safeProgress = Math.min(100, Math.max(0, progress));

  return (
    <div className={`w-full bg-gray-100 rounded-full overflow-hidden ${heightClass} ${className}`}>
      <div 
        className={`${colorClass} h-full transition-all duration-500 ease-out`}
        style={{ width: `${safeProgress}%` }}
      />
    </div>
  );
}