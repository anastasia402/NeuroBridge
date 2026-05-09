import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseStyle = "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none flex justify-center items-center";
  
  const variants = {
    primary: "bg-gray-900 text-white hover:bg-gray-800",
    secondary: "bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200",
    danger: "bg-red-50 text-red-600 hover:bg-red-100",
    accent: "bg-blue-50 text-blue-600 hover:bg-blue-100", 
  };

  return (
    <button className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}