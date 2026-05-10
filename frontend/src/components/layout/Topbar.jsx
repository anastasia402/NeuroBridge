import React from 'react';
import NotificationBell from './NotificationBell';

export default function Topbar({ userName, role }) {
  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md">
          {userName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{userName}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{role}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <NotificationBell />
        
        {/* Optional: Settings or Profile Menu button could go here next to the bell */}
      </div>
    </header>
  );
}