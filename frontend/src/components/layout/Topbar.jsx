import React from 'react';
import { useNavigate } from 'react-router-dom';
import NotificationBell from './NotificationBell';
import { useOrgSettingsContext } from '../../context/OrgSettingsContext';
import { getUserName, getRole } from '../../utils/authUtils';

export default function Topbar({ userName, role }) {
  const { organizationName, logoUrl, primaryColor } = useOrgSettingsContext();
  const navigate = useNavigate();

  const displayName = userName || getUserName();
  const displayRole = role || getRole() || 'JUNIOR';
  const profilePath = displayRole.toUpperCase() === 'ADMIN'
    ? '/admin/settings'
    : '/profile';

  return (
    <header className="bg-white border-b border-gray-100 px-8 py-4 flex justify-between items-center sticky top-0 z-40 shadow-sm">
      <button
        onClick={() => navigate(profilePath)}
        className="flex items-center space-x-3 hover:opacity-80 transition-opacity cursor-pointer"
      >
        <div
          className="w-10 h-10 text-white rounded-full flex items-center justify-center font-bold text-sm shadow-md"
          style={{ backgroundColor: primaryColor }}
        >
          {displayName.charAt(0).toUpperCase()}
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-gray-900">{displayName}</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-wider font-bold">{displayRole}</p>
        </div>
      </button>

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
