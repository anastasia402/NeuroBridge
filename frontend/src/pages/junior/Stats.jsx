import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MemoryHealthCard from '../../features/gamification/MemoryHealthCard';
import ActivityChart from '../../features/gamification/ActivityChart';
import Button from '../../components/common/Button';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

const PERIODS = ['7D', '30D', '90D'];

function scoreStatus(pct) {
  if (pct >= 85) return { label: 'Excellent',    color: 'text-green-600' };
  if (pct >= 65) return { label: 'Stable',       color: 'text-blue-600' };
  return             { label: 'Needs Review',  color: 'text-orange-600' };
}

function formatDate(iso) {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return mins <= 1 ? 'just now' : `${mins} mins ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return hrs === 1 ? '1 hour ago' : `${hrs} hours ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export default function Stats() {
  const [period, setPeriod] = useState('7D');
  const [showAll, setShowAll] = useState(false);
  const [isQuizRunning, setIsQuizRunning] = useState(false);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet('/api/users/me/stats')
      .then(data => setStats(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const history = stats?.quizHistory ?? [];
  const visibleHistory = showAll ? history : history.slice(0, 3);

  const trendKey = period === '7D' ? 'd7' : period === '30D' ? 'd30' : 'd90';
  const trend = stats?.trends?.[trendKey] ?? { count: 0, avgScore: 0 };
  const trendLabel = trend.count > 0 ? `+${trend.count} quizzes` : 'No data';
  const avgLabel = trend.avgScore > 0 ? `${trend.avgScore}% avg` : '—';

  const overallAvg = history.length > 0
    ? Math.round(history.reduce((s, q) => s + q.percentage, 0) / history.length)
    : 0;

  const memStatus = overallAvg >= 85 ? 'Excellent' : overallAvg >= 65 ? 'Good' : 'Needs Work';

  return (
    <>
      <PageWrapper>
        <div className="max-w-md mx-auto pb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8 tracking-tight">Your Progress</h1>

          {loading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
            </div>
          ) : (
            <>
              <MemoryHealthCard
                status={memStatus}
                stability="stability"
                percentage={overallAvg || 0}
                message={
                  history.length === 0
                    ? "Complete a quiz to start tracking your progress."
                    : overallAvg >= 85
                      ? "Your retention is excellent. Keep this momentum to solidify long-term memory."
                      : overallAvg >= 65
                        ? "Good progress! Stay consistent to improve your retention further."
                        : "Some topics need review. Take more quizzes to improve your score."
                }
              />

              <div className="flex justify-between items-center mb-6">
                <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Activity Overview</h2>
                <div className="bg-gray-100 p-1 rounded-xl flex space-x-1">
                  {PERIODS.map(t => (
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

              <ActivityChart title="Quizzes Completed" trend={trendLabel} icon="⚡" color="bg-blue-500" />
              <ActivityChart title="Average Score"     trend={avgLabel}   icon="🎯" color="bg-green-500" />
              <ActivityChart
                title="Current Streak"
                trend={stats?.streak > 0 ? `${stats.streak} days` : 'No streak'}
                icon="🔥"
                color="bg-orange-500"
              />

              <div className="mt-10">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="text-sm font-bold text-gray-900 uppercase tracking-widest">Quiz History</h2>
                  {history.length > 3 && (
                    <button
                      onClick={() => setShowAll(p => !p)}
                      className="text-xs font-bold text-blue-500 hover:text-blue-700"
                    >
                      {showAll ? 'Show Less' : 'View All →'}
                    </button>
                  )}
                </div>

                {history.length === 0 ? (
                  <div className="text-center py-10 text-gray-400">
                    <div className="text-4xl mb-2">📊</div>
                    <p className="text-sm font-medium">No quizzes completed yet</p>
                    <p className="text-xs mt-1">Take a quiz to see your history here</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {visibleHistory.map((q, i) => {
                      const { label, color } = scoreStatus(q.percentage);
                      return (
                        <div key={i} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex justify-between items-center shadow-sm">
                          <div className="flex items-center space-x-4">
                            <span className="text-xl">🎗️</span>
                            <div>
                              <h4 className="font-bold text-gray-900 text-sm">{q.quizTitle}</h4>
                              <p className="text-[10px] text-gray-400 font-medium">{formatDate(q.completedAt)}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-gray-900">{q.percentage}%</p>
                            <p className={`text-[10px] font-bold uppercase tracking-tighter ${color}`}>{label}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {history.some(q => q.percentage < 65) && (
                <div className="mt-10 bg-orange-50 border border-orange-100 p-6 rounded-[2rem]">
                  <div className="flex items-center space-x-3 mb-4">
                    <span className="text-xl">🔄</span>
                    <h3 className="font-bold text-gray-900">Topic Recovery Needed</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-6 leading-relaxed">
                    Some of your recent quizzes scored below 65%. A focused review session is recommended.
                  </p>
                  <Button
                    variant="accent"
                    className="w-full bg-orange-200 text-orange-900 py-3 font-bold hover:bg-orange-300 transition-colors"
                    onClick={() => setIsQuizRunning(true)}
                  >
                    Take a Quiz Now
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </PageWrapper>

      {isQuizRunning && <QuizEngine onClose={() => setIsQuizRunning(false)} />}
    </>
  );
}
