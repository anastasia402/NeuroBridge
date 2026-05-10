import React from 'react';
import Button from '../../components/common/Button';

export default function MentorCard({ name, initials, subjects, status, description, languages, availability, onChat }) {
  return (
    <div className="bg-white border border-gray-100 p-5 rounded-[2rem] shadow-sm mb-4">
      <div className="flex justify-between items-start mb-4">
        <div className="flex space-x-3">
          <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center font-bold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900">{name}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase">{subjects}</p>
          </div>
        </div>
        <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-1 rounded-lg">
          {status === 'ACTIVE' ? availability : status}
        </span>
      </div>
      
      <p className="text-xs text-gray-600 mb-4 leading-relaxed line-clamp-2">
        {description}
      </p>

      {/* 2. Make sure onClick={onChat} is on this button! */}
      <Button 
        onClick={onChat} 
        variant="primary" 
        className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl py-3 text-xs"
      >
        Chat Now
      </Button>
    </div>
  );
}