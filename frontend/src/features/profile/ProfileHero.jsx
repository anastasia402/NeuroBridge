import React from 'react';

export default function Profile({ name, bio, level, streak }) {
  return (
    <div className="flex flex-col items-center mb-10 mt-4">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" 
            alt="Profile" 
            className="w-full h-full object-cover bg-blue-100"
          />
        </div>
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
      <p className="text-sm text-gray-500 font-medium mt-1 mb-6">{bio}</p>

      <div className="flex space-x-3">
        <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
          {level}
        </span>
        <span className="bg-orange-50 text-orange-800 px-4 py-2 rounded-2xl text-xs font-bold shadow-sm">
          {streak}
        </span>
      </div>
    </div>
  );
}