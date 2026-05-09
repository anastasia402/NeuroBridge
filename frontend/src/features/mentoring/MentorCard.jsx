import React from 'react';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';

export default function MentorCard({ name, subjects, initials, description, status, languages, availability }) {
  return (
    <div className="bg-white rounded-3xl p-6 mb-4 shadow-sm border border-gray-100">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg">
            {initials}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">{name}</h3>
            <p className="text-xs font-medium text-gray-500 mt-0.5">{subjects}</p>
          </div>
        </div>
        <Badge text={status} variant={status === 'ACTIVE' ? 'success' : 'default'} />
      </div>
      
      <p className="text-sm text-gray-600 italic mb-4 leading-relaxed">"{description}"</p>
      
      <div className="flex justify-between items-center mb-5 text-xs text-gray-500 font-medium">
        <span>🗣 {languages}</span>
        <span>⏱ {availability}</span>
      </div>
      
      <div className="flex space-x-3">
        <Button variant="primary" className="flex-1 py-2.5">Chat Now</Button>
        <Button variant="secondary" className="flex-1 py-2.5">Request</Button>
      </div>
    </div>
  );
}