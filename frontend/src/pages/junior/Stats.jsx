import React, { useState } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MemoryHealthCard from '../../features/gamification/MemoryHealthCard';
import ActivityChart from '../../features/gamification/ActivityChart';
import Button from '../../components/common/Button';
import QuizEngine from '../../features/quizzes/QuizEngine';

const QUIZ_HISTORY = [
  { topic: 'Neural Plasticity',  time: '2 hours ago', score: 92, status: 'Excellent',    color: 'text-green-600' },
  { topic: 'Cognitive Load',     time: 'Yesterday',   score: 64, status: 'Needs Review', color: 'text-orange-600' },
  { topic: 'Spaced Repetition',  time: 'Oct 24',      score: 88, status: 'Stable',       color: 'text-blue-600' },
  { topic: 'Neuroplasticity',    time: 'Oct 22',      score: 71, status: 'Stable',       color: 'text-blue-600' },
  { topic: 'Memory Systems',     time: 'Oct 20',      score: 55, status: 'Needs Review', color: 'text-orange-600' },
];

const TIME_DATA = {
  '7D':  { retention: '+12%', study: '+24%', accuracy: '+8%'  },
  '30D': { retention: '+18%', study: '+31%', accuracy: '+14%' },
  '90D': { retention: '+27%', study: '+45%', accuracy: '+22%' },
};

export default function Stats() {
  const [period, setPeriod] = useState('7D');
  const [showAll, setShowAll] = useState(false);
  const [isQuizRunning, setIsQuizRunning] = useState(false);

  const visibleHistory = showAll ? QUIZ_HISTORY : QUIZ_HISTORY.slice(0, 3);
  const trends = TIME_DATA[period];

  return (
    <>
      <PageWrapper role="JUNIOR" userName="Alex" activePath="/stats">
        <div className="max-w-md mx-auto pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Progress</h1>

          <MemoryHealthCard
            status="Excellent"
            stability="stability"
            percentage={88}
            message="Your retention for 'Neuroanatomy' is at an all-time high. Keep this momentum to solidify long-term memory."
          />

          {/* Period filter */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Activity Overview</h2>
            <div className="bg-gray-100 p-1 rounded-xl flex space-x-1">
              {['7D', '30D', '90D'].map(t => (
                <button
                  key={t}
                  onClick={() => setPeriod(t)}
                  className={`text-[10px] font-bold px-3 py-1 rounded-lg transition-all ${
                    t === period ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <ActivityChart title="Retention Strength" trend={trends.retention} icon="🧠" color="bg-blue-500" />
          <ActivityChart title="Study Time (min)"   trend={trends.study}     icon="⏱"  color="bg-orange-500" />
          <ActivityChart title="Quiz Accuracy"      trend={trends.accuracy}  icon="🎯"  color="bg-green-500" />

          {/* Quiz History */}
          <div className="mt-10">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quiz History</h2>
              <button
                onClick={() => setShowAll(prev => !prev)}
                className="text-xs font-bold text-blue-500 hover:text-blue-700 transition-colors"
              >
                {showAll ? 'Show Less' : 'View All →'}
              </button>
            </div>
            <div className="space-y-4">
              {visibleHistory.map((q, i) => (
                <div key={i} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                  <div className="flex items-center space-x-4">
                    <span className="text-xl">🎗️</span>
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm">{q.topic}</h4>
                      <p className="text-[10px] text-gray-400 font-medium">{q.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900">{q.score}%</p>
                    <p className={`text-[10px] font-bold uppercase tracking-tighter ${q.color}`}>{q.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recovery */}
          <div className="mt-10 bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-xl">🔄</span>
              <h3 className="font-bold text-gray-900">Topic Recovery Needed</h3>
            </div>
            <p className="text-xs text-gray-600 mb-6 leading-relaxed">
              Accuracy in <span className="font-bold">"Cognitive Load Theory"</span> dropped by 12%. A 5-minute focused session is recommended to prevent forgetting.
            </p>
            <Button
              variant="accent"
              className="w-full bg-orange-200 text-orange-900 py-3 font-bold hover:bg-orange-300 transition-colors"
              onClick={() => setIsQuizRunning(true)}
            >
              Regenerate AI Quiz
            </Button>
          </div>
        </div>
      </PageWrapper>

      {isQuizRunning && <QuizEngine onClose={() => setIsQuizRunning(false)} />}
    </>
  );
}
