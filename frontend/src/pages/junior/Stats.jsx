import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MemoryHealthCard from '../../features/gamification/MemoryHealthCard';
import ActivityChart from '../../features/gamification/ActivityChart';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function scoreStatus(pct) {
  if (pct >= 85) return { label: 'Excellent',    color: 'text-green-600' };
  if (pct >= 65) return { label: 'Stable',       color: 'text-blue-600' };
  return              { label: 'Needs Review',   color: 'text-orange-600' };
}

export default function Stats() {
  const [results, setResults]         = useState([]);
  const [user, setUser]               = useState(null);
  const [loading, setLoading]         = useState(true);
  const [showAll, setShowAll]         = useState(false);
  const [activeQuizId, setActiveQuizId] = useState(null);

  useEffect(() => {
    Promise.all([
      apiGet('/quizzes/my-results').catch(() => []),
      apiGet('/users/me').catch(() => null),
    ]).then(([res, u]) => {
      setResults(Array.isArray(res) ? res : []);
      setUser(u);
      setLoading(false);
    });
  }, []);

  if (activeQuizId) {
    return <QuizEngine quizId={activeQuizId} onClose={() => setActiveQuizId(null)} />;
  }

  const totalQuizzes  = results.length;
  const avgScore      = totalQuizzes > 0 ? Math.round(results.reduce((s, r) => s + r.percentage, 0) / totalQuizzes) : 0;
  const bestScore     = totalQuizzes > 0 ? Math.max(...results.map(r => r.percentage)) : 0;
  const worstResult   = totalQuizzes > 0 ? results.reduce((w, r) => r.percentage < w.percentage ? r : w, results[0]) : null;

  const visible = showAll ? results : results.slice(0, 3);

  const memoryStatus   = avgScore >= 85 ? 'Excellent' : avgScore >= 65 ? 'Good' : totalQuizzes === 0 ? 'No data' : 'Needs Work';
  const memoryMessage  = totalQuizzes === 0
    ? 'Complete some quizzes to see your memory health stats.'
    : avgScore >= 85
    ? 'Great job! Your average score is excellent. Keep up the momentum.'
    : avgScore >= 65
    ? 'You\'re doing well. Focus on topics you missed to improve further.'
    : 'Some topics need review. Retake quizzes on your weakest subjects.';

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto pb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Progress</h1>

        <MemoryHealthCard
          status={memoryStatus}
          stability={totalQuizzes > 0 ? `${totalQuizzes} quizzes taken` : ''}
          percentage={avgScore}
          message={memoryMessage}
        />

        {/* Summary stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: 'Avg Score', value: totalQuizzes > 0 ? `${avgScore}%` : '—', icon: '🎯' },
            { label: 'Best Score', value: totalQuizzes > 0 ? `${bestScore}%` : '—', icon: '🏆' },
            { label: 'Streak', value: user ? `${user.currentStreak}d` : '—', icon: '🔥' },
          ].map(s => (
            <div key={s.label} className="bg-white border border-gray-100 rounded-[1.5rem] p-4 text-center shadow-sm">
              <div className="text-xl mb-1">{s.icon}</div>
              <div className="text-lg font-bold text-gray-900">{s.value}</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Activity charts */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Activity Overview</h2>
        </div>
        <ActivityChart title="Quiz Accuracy" trend={totalQuizzes > 0 ? `${avgScore}% avg` : 'No data'} icon="🎯" color="bg-blue-500" />
        <ActivityChart title="XP Earned" trend={user ? `${user.experiencePoints} total` : '—'} icon="⚡" color="bg-orange-500" />
        <ActivityChart title="Level Progress" trend={user ? `Level ${user.level}` : '—'} icon="📈" color="bg-green-500" />

        {/* Quiz History */}
        <div className="mt-10">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quiz History</h2>
            {results.length > 3 && (
              <button onClick={() => setShowAll(p => !p)} className="text-xs font-bold text-blue-500 hover:text-blue-700">
                {showAll ? 'Show Less' : `View All (${results.length}) →`}
              </button>
            )}
          </div>

          {loading ? (
            <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-20 bg-gray-100 rounded-[2rem] animate-pulse" />)}</div>
          ) : results.length === 0 ? (
            <div className="bg-white border border-gray-100 p-8 rounded-[2rem] text-center shadow-sm">
              <div className="text-3xl mb-3">📝</div>
              <p className="text-sm font-medium text-gray-500">No quizzes taken yet.</p>
              <p className="text-xs text-gray-400 mt-1">Complete a quiz to see your history here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {visible.map((r) => {
                const s = scoreStatus(r.percentage);
                return (
                  <div key={r.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                    <div className="flex items-center space-x-4">
                      <span className="text-xl">🎗️</span>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{r.materialTitle}</h4>
                        <p className="text-[10px] text-gray-400 font-medium">{timeAgo(r.completedAt)} · {r.score}/{r.totalQuestions} correct</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-gray-900">{r.percentage}%</p>
                      <p className={`text-[10px] font-bold uppercase tracking-tighter ${s.color}`}>{s.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recovery suggestion */}
        {worstResult && worstResult.percentage < 70 && (
          <div className="mt-8 bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
            <div className="flex items-center space-x-3 mb-3">
              <span className="text-xl">🔄</span>
              <h3 className="font-bold text-gray-900">Topic Recovery Needed</h3>
            </div>
            <p className="text-xs text-gray-600 mb-5 leading-relaxed">
              Your lowest score was <span className="font-bold">{worstResult.percentage}%</span> on <span className="font-bold">"{worstResult.materialTitle}"</span>. A focused session is recommended.
            </p>
            <button
              onClick={() => setActiveQuizId(worstResult.quizId)}
              className="w-full bg-orange-200 text-orange-900 py-3 font-bold rounded-xl text-sm hover:bg-orange-300 transition-colors"
            >
              Retake Quiz
            </button>
          </div>
        )}

      </div>
    </PageWrapper>
  );
}
