import React from 'react';

export default function Badge({ text, variant = 'default', className = '' }) {
  const variants = {
    default: "bg-gray-100 text-gray-600",
    success: "bg-green-100 text-green-700", // ACTIVE
    warning: "bg-orange-100 text-orange-700", // PENDING
    danger: "bg-red-100 text-red-700", // REJECTED
    ai: "bg-orange-50 text-orange-500 border border-orange-100", // AI GENERATED
  };

  return (
    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${variants[variant]} ${className}`}>
      {text}
    </span>
  );
}