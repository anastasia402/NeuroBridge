import React from 'react';

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            {title && <h2 className="text-xl font-bold text-gray-900">{title}</h2>}
            <button onClick={onClose} className="text-gray-400 hover:text-gray-900 text-xl font-bold p-1">
              ✕
            </button>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}