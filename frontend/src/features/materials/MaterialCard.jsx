import React from 'react';
import Button from '../../components/common/Button';

export default function MaterialCard({ title, description, time, isAiGenerated, reason }) {
  return (
    <div className={`p-5 mb-4 rounded-3xl ${isAiGenerated ? 'bg-orange-50/70 border border-orange-100' : 'bg-white border border-gray-100 shadow-sm'}`}>
      {isAiGenerated && (
        <div className="flex items-center space-x-2 mb-3">
          <span className="text-orange-600 text-xs font-bold tracking-wider uppercase flex items-center">
            <span className="mr-1">✨</span> AI GENERATED
          </span>
        </div>
      )}
      
      <h3 className="font-bold text-gray-900 text-lg">{title}</h3>
      
      {isAiGenerated ? (
        <p className="text-sm text-gray-600 mt-2 mb-4 italic leading-relaxed">"{reason}"</p>
      ) : (
        <p className="text-sm text-gray-500 mt-2 mb-4 leading-relaxed">{description}</p>
      )}

      {time && !isAiGenerated && (
        <div className="flex items-center text-xs text-gray-400 mb-4 font-medium">
          <span className="mr-1">⏱</span> {time} read
        </div>
      )}

      <div className="flex space-x-3">
        <Button variant="secondary" className="flex-1 py-2.5 bg-white">Reread</Button>
        <Button variant="accent" className="flex-1 py-2.5 bg-orange-100 text-orange-800 hover:bg-orange-200">Take Quiz</Button>
      </div>
    </div>
  );
}