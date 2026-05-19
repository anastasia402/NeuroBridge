import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import QuizReviewPanel from '../../features/admin/QuizReviewPanel';
import { apiGet, apiPost } from '../../services/authService';

const TABS = [
  { label: 'Toate',    value: '',         color: 'text-gray-700' },
  { label: 'Pending',  value: 'PENDING',  color: 'text-orange-600' },
  { label: 'Active',   value: 'ACTIVE',   color: 'text-green-600' },
  { label: 'Rejected', value: 'REJECTED', color: 'text-red-600' },
];

function StatusBadge({ status }) {
  const styles = {
    PENDING:   'bg-orange-50 text-orange-700 border-orange-100',
    ACTIVE:    'bg-green-50 text-green-700 border-green-100',
    REJECTED:  'bg-red-50 text-red-700 border-red-100',
    COMPLETED: 'bg-gray-50 text-gray-600 border-gray-100',
  };
  return (
    <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${styles[status] ?? styles.COMPLETED}`}>
      {status}
    </span>
  );
}

export default function QuizzesReview() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('PENDING');
  const [quizzes, setQuizzes]       = useState([]);
  const [activeQuizId, setActiveQuizId] = useState(null);
  const [isLoading, setIsLoading]   = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError]           = useState(null);

  const load = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const url = activeTab ? `/quizzes?status=${activeTab}` : '/quizzes';
      const data = await apiGet(url);
      setQuizzes(data);
      if (data.length > 0) setActiveQuizId(data[0].id);
      else setActiveQuizId(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => { load(); }, [load]);

  async function handleApprove(quizId) {
    setActionLoading(true);
    try {
      await apiPost(`/quizzes/${quizId}/approve`);
      await load();
    } catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  }

  async function handleReject(quizId) {
    setActionLoading(true);
    try {
      await apiPost(`/quizzes/${quizId}/reject`);
      await load();
    } catch (e) { alert(e.message); }
    finally { setActionLoading(false); }
  }

  const activeQuiz = quizzes.find(q => q.id === activeQuizId);

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Quiz Monitor</h1>
            <p className="text-gray-400 text-sm mt-1">{quizzes.length} quiz-uri · {quizzes.filter(q => q.status === 'PENDING').length} în așteptare</p>
          </div>
          <button
            onClick={() => navigate('/admin/generate')}
            className="flex items-center space-x-2 px-4 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-700 transition-colors"
          >
            <span>✨</span><span>Generează Quiz Nou</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
          {TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === tab.value
                  ? 'bg-white shadow-sm text-gray-900'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab.label}
              <span className="ml-1.5 text-[10px] opacity-60">
                {quizzes.filter(q => !tab.value || q.status === tab.value).length}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
            {error} — <button onClick={load} className="underline font-bold">Reîncearcă</button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[500px]">

          {/* Lista quizuri */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col">
            <div className="p-4 border-b border-gray-50 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
              Quiz-uri
            </div>

            {isLoading ? (
              <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">Se încarcă...</div>
            ) : quizzes.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400 p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-sm font-medium">Niciun quiz în această categorie</p>
                {activeTab === 'PENDING' && (
                  <button onClick={() => navigate('/admin/generate')} className="mt-4 text-xs font-bold text-blue-600 hover:underline">
                    Generează unul nou →
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-y-auto flex-1 divide-y divide-gray-50">
                {quizzes.map(quiz => (
                  <div
                    key={quiz.id}
                    onClick={() => setActiveQuizId(quiz.id)}
                    className={`p-4 cursor-pointer transition-colors ${
                      activeQuizId === quiz.id
                        ? 'bg-blue-50 border-l-4 border-blue-500'
                        : 'hover:bg-gray-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-1.5">
                      <h3 className="font-bold text-gray-900 text-sm leading-tight flex-1 mr-2">
                        {quiz.materialTitle || `Quiz #${quiz.id}`}
                      </h3>
                      <StatusBadge status={quiz.status} />
                    </div>
                    <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-medium">
                      <span>📊 {quiz.difficulty}</span>
                      <span>❓ {quiz.questions.length} întrebări</span>
                    </div>
                    {quiz.timesPlayed > 0 && (
                      <div className="flex items-center space-x-3 text-[10px] text-gray-400 font-medium mt-1">
                        <span>▶️ {quiz.timesPlayed}x jucat</span>
                        <span>🎯 {quiz.avgScore}% avg</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Panou detalii */}
          <div className="lg:col-span-8 overflow-y-auto">
            {activeQuiz ? (
              <>
                {/* Stats card dacă e ACTIVE */}
                {activeQuiz.status === 'ACTIVE' && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {[
                      { label: 'Jucat de', value: activeQuiz.timesPlayed || 0, unit: 'ori', icon: '▶️' },
                      { label: 'Scor mediu', value: activeQuiz.avgScore || '—', unit: activeQuiz.timesPlayed ? '%' : '', icon: '🎯' },
                      { label: 'Întrebări', value: activeQuiz.questions.length, unit: '', icon: '❓' },
                    ].map(s => (
                      <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                        <div className="text-2xl mb-1">{s.icon}</div>
                        <div className="text-xl font-bold text-gray-900">{s.value}{s.unit}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase">{s.label}</div>
                      </div>
                    ))}
                  </div>
                )}

                <QuizReviewPanel
                  quiz={activeQuiz}
                  onApprove={activeQuiz.status === 'PENDING' ? () => handleApprove(activeQuiz.id) : null}
                  onReject={activeQuiz.status === 'PENDING' ? () => handleReject(activeQuiz.id) : null}
                  isLoading={actionLoading}
                />
              </>
            ) : (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex items-center justify-center text-gray-400 p-12 text-center">
                <div>
                  <div className="text-5xl mb-4">📋</div>
                  <p className="font-medium">Selectează un quiz din stânga</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
