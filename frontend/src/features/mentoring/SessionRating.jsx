import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { useNavigate } from 'react-router-dom';

export default function SessionRating() {
  const [rating, setRating] = useState(0);
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4 animate-in fade-in zoom-in duration-500">
      <div className="w-20 h-20 bg-green-50 rounded-[2rem] flex items-center justify-center text-4xl mb-6 shadow-sm">
        ✨
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Session Resolved</h2>
      <p className="text-sm text-gray-500 mb-8">How helpful was your mentor?</p>
      
      <div className="flex space-x-2 mb-10">
        {[1, 2, 3, 4, 5].map(star => (
          <button 
            key={star} 
            onClick={() => setRating(star)}
            className={`text-4xl transition-all ${rating >= star ? 'grayscale-0 scale-110' : 'grayscale opacity-30 hover:opacity-50'}`}
          >
            ⭐
          </button>
        ))}
      </div>

      <Button 
        onClick={() => navigate('/dashboard')} 
        className="w-full max-w-xs bg-blue-500 text-white font-bold py-4 rounded-[1.5rem]"
        disabled={rating === 0}
      >
        Submit & Return Home
      </Button>
    </div>
  );
}