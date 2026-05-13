import React from 'react';
import NotificationBell from './NotificationBell';
import { useOrgSettingsContext } from '../../context/OrgSettingsContext';

export default function Topbar({ userName, role }) {
  const { organizationName, logoUrl, primaryColor } = useOrgSettingsContext();

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <div className="flex items-center space-x-3">
        <div
          className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md"
          style={{ backgroundColor: primaryColor }}
        >
          {userName.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{userName}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{role}</p>
        </div>
      </div>

      {/* Logo + Org Name centrat */}
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center space-x-2">
        {logoUrl ? (
          <img src={logoUrl} alt={organizationName} className="h-7 object-contain" />
        ) : (
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold"
               style={{ backgroundColor: primaryColor }}>
            ⚡
          </div>
        )}
        <span className="text-sm font-bold text-gray-900">{organizationName}</span>
      </div>

      <div className="flex items-center space-x-4">
        <NotificationBell />
      </div>
    </header>
  );
}
