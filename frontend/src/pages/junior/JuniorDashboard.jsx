import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import ProgressBar from '../../components/common/ProgressBar';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

const XP_PER_LEVEL = 1000;

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 18) return 'Good afternoon';
  return 'Good evening';
}

export default function JuniorDashboard() {
  const navigate = useNavigate();
  const [user, setUser]         = useState(null);
  const [quizzes, setQuizzes]   = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);

  useEffect(() => {
    apiGet('/users/me').then(setUser).catch(() => {});
    apiGet('/quizzes?status=ACTIVE').then(data => setQuizzes(Array.isArray(data) ? data.slice(0, 3) : [])).catch(() => {});
  }, []);

  if (activeQuizId) {
    return <QuizEngine quizId={activeQuizId} onClose={() => setActiveQuizId(null)} />;
  }

  const firstName = user?.fullName?.split(' ')[0] || localStorage.getItem('fullName')?.split(' ')[0] || 'there';
  const xp = user?.experiencePoints ?? 0;
  const level = user?.level ?? 1;
  const xpInLevel = xp % XP_PER_LEVEL;
  const xpProgress = Math.round((xpInLevel / XP_PER_LEVEL) * 100);

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto pb-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="bg-gray-900 p-2 rounded-xl text-white shadow-sm">
            <span className="text-xl">⚡</span>
          </div>
          <div className="flex space-x-4 text-gray-400">
            <button className="text-xl hover:text-gray-900 transition-colors">❔</button>
            <button onClick={() => navigate('/profile')} className="text-xl hover:text-gray-900 transition-colors">⚙️</button>
          </div>
        </div>

        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{getGreeting()}, {firstName}</h1>
          <p className="text-gray-500 mt-1 font-medium italic">Ready to cross today's learning bridge?</p>
        </div>

        {/* Rank / XP card */}
        <div className="mb-10 bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Current Rank</p>
            <h3 className="text-lg font-bold text-gray-900">Level {level} Learner</h3>
            {user && <p className="text-[10px] text-orange-500 font-bold mt-1">{user.currentStreak} day streak 🔥</p>}
          </div>
          <div className="text-right flex flex-col items-end">
            <span className="text-[10px] font-bold text-blue-600 mb-2">{xpInLevel} / {XP_PER_LEVEL} XP</span>
            <ProgressBar progress={xpProgress} colorClass="bg-blue-500" className="w-24 h-1.5" />
          </div>
        </div>

        {/* Quick access grid */}
        <div className="grid grid-cols-2 gap-4 mb-10">
          <div onClick={() => navigate('/study')} className="bg-blue-50/50 p-6 rounded-[2.5rem] hover:bg-blue-100 transition-all cursor-pointer border border-transparent hover:border-blue-200">
            <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-50 text-lg">📖</span>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Study Materials</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">Dive into your saved lessons and library</p>
          </div>
          <div onClick={() => navigate('/quizzes')} className="bg-gray-50/50 p-6 rounded-[2.5rem] hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200">
            <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-50 text-lg">⚡</span>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Quick Quiz</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">Test your knowledge with AI challenges</p>
          </div>
          <div onClick={() => navigate('/mentors')} className="bg-gray-50/50 p-6 rounded-[2.5rem] hover:bg-gray-100 transition-all cursor-pointer border border-transparent hover:border-gray-200">
            <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-gray-50 text-lg">👥</span>
            <h3 className="font-bold text-gray-900 text-sm mb-1">Connect Mentor</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">Get personalized help from experts</p>
          </div>
          <div onClick={() => navigate('/stats')} className="bg-blue-50/50 p-6 rounded-[2.5rem] hover:bg-blue-100 transition-all cursor-pointer border border-transparent hover:border-blue-200">
            <span className="bg-white w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-sm border border-blue-50 text-lg">📊</span>
            <h3 className="font-bold text-gray-900 text-sm mb-1">My Stats</h3>
            <p className="text-[10px] text-gray-500 leading-relaxed">Track your progress and achievements</p>
          </div>
        </div>

        {/* Today's Quizzes */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Available Quizzes</h2>
        {quizzes.length === 0 ? (
          <div className="bg-gray-50 border border-gray-100 p-6 rounded-[2rem] mb-10 text-center">
            <p className="text-sm text-gray-400 font-medium">No active quizzes yet.</p>
            <p className="text-xs text-gray-300 mt-1">Check back later or ask your admin to approve one.</p>
          </div>
        ) : (
          <div className="space-y-3 mb-10">
            {quizzes.map((q, i) => (
              <div key={q.id} className={`border p-6 rounded-[2rem] flex justify-between items-center ${i === 0 ? 'bg-orange-50/50 border-orange-100' : 'bg-white border-gray-100'}`}>
                <div className="flex-1 min-w-0 mr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate">{q.materialTitle || `Quiz #${q.id}`}</h3>
                    {i === 0 && <span className="bg-orange-200 text-orange-900 text-[10px] font-bold px-2 py-0.5 rounded-lg flex-shrink-0">NEW</span>}
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">{q.difficulty} · {q.questions?.length ?? 0} questions</p>
                </div>
                <button
                  onClick={() => setActiveQuizId(q.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex-shrink-0 ${i === 0 ? 'bg-orange-100 text-orange-800 hover:bg-orange-200' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                >
                  Start
                </button>
              </div>
            ))}
            {quizzes.length > 0 && (
              <button onClick={() => navigate('/quizzes')} className="w-full text-xs font-bold text-blue-600 hover:text-blue-700 py-2">
                View all quizzes →
              </button>
            )}
          </div>
        )}

        {/* Insight of the Day */}
        <h2 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Insight of the Day</h2>
        <div className="bg-orange-50 border border-orange-100/50 p-8 rounded-[2.5rem] mb-10 relative overflow-hidden">
          <div className="relative z-10">
            <span className="bg-white text-[10px] font-bold px-3 py-1.5 rounded-xl text-gray-600 mb-5 inline-block shadow-sm">Did you know?</span>
            <h3 className="text-2xl font-bold text-gray-900 mb-4 tracking-tight leading-tight">The Power of Spaced Repetition</h3>
            <p className="text-sm text-gray-700 mb-6 leading-relaxed">
              Reviewing information right before you're about to forget it strengthens your neural pathways by 300%. NeuroBridge uses this to help you learn faster.
            </p>
            <button onClick={() => navigate('/study')} className="text-sm font-bold text-gray-900 flex items-center hover:translate-x-1 transition-transform group">
              Explore memory tips <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-orange-200/20 rounded-full blur-3xl" />
        </div>

        <div className="text-center py-8">
          <div className="h-[1px] w-12 bg-gray-100 mx-auto mb-6" />
          <p className="text-sm text-gray-300 italic font-medium">"Small steps lead to big bridges."</p>
        </div>

      </div>
    </PageWrapper>
  );
}
