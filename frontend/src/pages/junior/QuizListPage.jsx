import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import QuizEngine from '../../features/quizzes/QuizEngine';
import { apiGet } from '../../services/authService';

const DIFFICULTIES = ['ALL', 'EASY', 'MEDIUM', 'HARD'];

export default function QuizListPage() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [activeQuizId, setActiveQuizId] = useState(null);

  useEffect(() => {
    apiGet('/api/quizzes?status=ACTIVE')
      .then(data => setQuizzes(Array.isArray(data) ? data : []))
      .catch(() => setQuizzes([]))
      .finally(() => setLoading(false));
  }, []);

  if (activeQuizId) {
    return <QuizEngine quizId={activeQuizId} onClose={() => setActiveQuizId(null)} />;
  }

  const filtered = filter === 'ALL' ? quizzes : quizzes.filter(q => q.difficulty === filter);

  const diffColor = (d) => {
    if (d === 'EASY') return 'bg-green-100 text-green-700';
    if (d === 'HARD') return 'bg-red-100 text-red-700';
    return 'bg-yellow-100 text-yellow-700';
  };

  return (
    <PageWrapper role="JUNIOR">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quizzes</h1>
          <p className="text-sm text-gray-500 mt-1">{quizzes.length} available quizzes</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {DIFFICULTIES.map(d => (
            <button
              key={d}
              onClick={() => setFilter(d)}
              className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 whitespace-nowrap transition-all ${
                filter === d ? 'border-blue-600 text-blue-600 bg-blue-50' : 'border-gray-200 text-gray-500'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-2xl animate-pulse" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3">⚡</div>
            <p className="text-sm font-medium">No quizzes available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(q => (
              <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 text-sm truncate">{q.title}</div>
                    {q.description && (
                      <div className="text-xs text-gray-500 mt-0.5 line-clamp-2">{q.description}</div>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${diffColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                      {q.timesPlayed > 0 && (
                        <span className="text-xs text-gray-400">{q.timesPlayed} plays</span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveQuizId(q.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 flex-shrink-0"
                  >
                    Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
