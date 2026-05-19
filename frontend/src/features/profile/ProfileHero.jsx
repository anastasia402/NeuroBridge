import React from 'react';

export default function ProfileHero({ name, email, xp, level, streak }) {
  const seed = encodeURIComponent(name || 'user');

  return (
    <div className="flex flex-col items-center mb-10 mt-4">
      <div className="relative mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-md">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`}
            alt="Profile"
            className="w-full h-full object-cover bg-blue-100"
          />
        </div>
        <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
      </div>

      <h2 className="text-2xl font-bold text-gray-900">{name}</h2>
      {email && <p className="text-xs text-gray-400 font-medium mt-1">{email}</p>}
      {xp != null && <p className="text-xs text-blue-500 font-bold mt-1">{xp} XP</p>}

      <div className="flex space-x-3 mt-4">
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