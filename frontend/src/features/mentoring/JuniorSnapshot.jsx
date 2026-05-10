import React from 'react';

export default function JuniorSnapshot() {
  const quizzes = [
    { topic: 'Memory Models', score: 62 },
    { topic: 'Synaptic Pruning', score: 88 }
  ];

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 h-full shadow-inner">
      <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-6">Junior Snapshot</h3>
      
      <div className="mb-6">
        <p className="text-xs font-bold text-gray-900 mb-3">Recent Quizzes</p>
        <div className="space-y-2">
          {quizzes.map((q, i) => (
            <div key={i} className="flex justify-between items-center bg-white p-3 rounded-2xl shadow-sm border border-gray-50">
              <span className="text-xs font-medium text-gray-600">{q.topic}</span>
              <span className={`text-xs font-bold ${q.score < 70 ? 'text-orange-500' : 'text-green-500'}`}>
                {q.score}%
              </span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-gray-900 mb-3">Materials Read</p>
        <div className="flex flex-wrap gap-2">
          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm">Neural Plasticity 101</span>
          <span className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded-xl text-[10px] font-bold shadow-sm">Active Recall</span>
        </div>
      </div>
    </div>
  );
}