import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { name: 'Home',    path: '/dashboard', icon: '🏠' },
    { name: 'Study',   path: '/study',     icon: '📖' },
    { name: 'Quizzes', path: '/quizzes',   icon: '⚡' },
    { name: 'Mentors', path: '/mentors',   icon: '👥' },
    { name: 'Stats',   path: '/stats',     icon: '📊' },
    { name: 'Profile', path: '/profile',   icon: '👤' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.name}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center space-y-1 transition-all duration-200"
          >
            <span className={`text-xl ${isActive ? 'scale-110' : 'opacity-50 grayscale'}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${
              isActive ? 'text-blue-500' : 'text-gray-400'
            }`}>
              {item.name}
            </span>
          </button>
        );
      })}
    </nav>
  );
}