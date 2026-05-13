import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'MENTORING', message: 'Dr. Aris accepted your session request', time: '2 mins ago', path: '/mentors', read: false, icon: '💬' },
    { id: 2, type: 'QUIZ', message: 'New AI Quiz available for Cognitive Load', time: '1 hour ago', path: '/study', read: false, icon: '⚡' },
    { id: 3, type: 'SYSTEM', message: 'You reached a 12-day streak!', time: 'Yesterday', path: '/dashboard', read: true, icon: '🔥' },
  ]);

  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);


  const handleNotificationClick = (notif) => {
    setNotifications(notifications.map(n => n.id === notif.id ? { ...n, read: true } : n));
    setIsOpen(false);
    
    navigate(notif.path);
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 text-gray-400 hover:text-gray-900 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full ${isAnimating ? 'animate-wiggle' : ''}`}
      >
        <span className="text-xl">🔔</span>
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full animate-in zoom-in"></span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          
          {/* Dropdown Header */}
          <div className="px-5 py-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-800"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">
                You're all caught up!
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.map((notif) => (
                  <div 
                    key={notif.id}
                    onClick={() => handleNotificationClick(notif)}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors flex gap-4 ${!notif.read ? 'bg-blue-50/30' : ''}`}
                  >
                    <div className="flex-shrink-0 w-10 h-10 bg-white border border-gray-100 rounded-full flex items-center justify-center text-lg shadow-sm">
                      {notif.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm ${!notif.read ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {notif.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">{notif.time}</p>
                    </div>
                    {!notif.read && (
                      <div className="flex-shrink-0 flex items-center">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Dropdown Footer */}
          <div className="p-3 bg-gray-50 text-center border-t border-gray-100">
            <button
              onClick={() => { setIsOpen(false); navigate('/profile'); }}
              className="text-xs font-bold text-gray-500 hover:text-gray-900"
            >
              Notification settings →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}