import React, { useState, useEffect } from 'react';

export default function Notification({ message, isVisible, onClose }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 4000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <div className="bg-gray-900 text-white px-6 py-3 rounded-2xl shadow-lg text-sm font-medium flex items-center space-x-3">
        <span>🔔</span>
        <span>{message}</span>
      </div>
    </div>
  );
}