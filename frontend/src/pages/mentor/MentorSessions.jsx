import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { apiGet, apiPost } from '../../services/authService';
import ChatSession from '../../features/mentoring/ChatSession';

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 2) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

const STATUS_STYLE = {
  PENDING:     'bg-orange-50 border-orange-100',
  ACCEPTED:    'bg-blue-50 border-blue-100',
  IN_PROGRESS: 'bg-green-50 border-green-100',
  COMPLETED:   'bg-gray-50 border-gray-100',
  CANCELLED:   'bg-red-50 border-red-100',
};

export default function MentorSessions() {
  const [sessions, setSessions]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [actionId, setActionId]       = useState(null);
  const [chatSession, setChatSession] = useState(null);

  const load = useCallback(async () => {
    try {
      const data = await apiGet('/mentoring-sessions');
      setSessions(Array.isArray(data) ? data : []);
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const pending   = sessions.filter(s => s.status === 'PENDING');
  const active    = sessions.filter(s => ['ACCEPTED', 'IN_PROGRESS'].includes(s.status));
  const completed = sessions.filter(s => ['COMPLETED', 'CANCELLED'].includes(s.status));

  async function handleAccept(id) {
    setActionId(id);
    try {
      await apiPost(`/mentoring-sessions/${id}/accept`);
      await load();
    } catch (e) { alert(e.message); }
    setActionId(null);
  }

  async function handleReject(id) {
    setActionId(id);
    try {
      await apiPost(`/mentoring-sessions/${id}/reject`);
      await load();
    } catch (e) { alert(e.message); }
    setActionId(null);
  }

  async function handleComplete(id) {
    setActionId(id);
    try {
      await apiPost(`/mentoring-sessions/${id}/complete`);
      setChatSession(null);
      await load();
    } catch (e) { alert(e.message); }
    setActionId(null);
  }

  if (chatSession) {
    return (
      <ChatSession
        session={chatSession}
        onClose={() => { setChatSession(null); load(); }}
        onComplete={() => handleComplete(chatSession.id)}
      />
    );
  }

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto pb-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Dashboard</h1>
          <span className="text-xs font-bold text-gray-400">{sessions.length} sessions</span>
        </div>

        {loading ? (
          <div className="space-y-4">{[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-gray-100 rounded-[2rem] animate-pulse" />)}</div>
        ) : (
          <>
            {/* Active sessions */}
            {active.length > 0 && (
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Sessions</h2>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">LIVE</span>
                </div>
                <div className="space-y-4">
                  {active.map(s => (
                    <div key={s.id} className={`border p-6 rounded-[2rem] shadow-sm ${STATUS_STYLE[s.status]}`}>
                      <h3 className="font-bold text-gray-900 text-base mb-1">{s.topic}</h3>
                      <p className="text-xs text-gray-500 mb-1">With {s.juniorName} · {timeAgo(s.startedAt || s.createdAt)}</p>
                      {s.issueDescription && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{s.issueDescription}</p>}
                      <button
                        onClick={() => setChatSession(s)}
                        className="w-full bg-blue-600 text-white py-3 rounded-2xl font-bold text-sm hover:bg-blue-700 transition-colors"
                      >
                        Open Chat
                      </button>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pending requests */}
            {pending.length > 0 && (
              <section className="mb-8">
                <div className="flex justify-between items-center mb-4 px-2">
                  <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pending Requests</h2>
                  <span className="text-[10px] font-bold text-orange-500">{pending.length} waiting</span>
                </div>
                <div className="space-y-4">
                  {pending.map(s => (
                    <div key={s.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-gray-900 flex-1 pr-4 leading-tight">{s.topic}</h3>
                        <span className="text-[10px] font-bold text-orange-500 bg-orange-50 px-2 py-1 rounded-lg">{timeAgo(s.createdAt)}</span>
                      </div>
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-500">
                          {s.juniorName?.charAt(0) || 'J'}
                        </div>
                        <p className="text-xs font-bold text-gray-900">{s.juniorName}</p>
                      </div>
                      {s.issueDescription && <p className="text-xs text-gray-400 mb-4 line-clamp-2">{s.issueDescription}</p>}
                      <div className="flex space-x-3">
                        <button
                          onClick={() => handleReject(s.id)}
                          disabled={actionId === s.id}
                          className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          Decline
                        </button>
                        <button
                          onClick={() => handleAccept(s.id)}
                          disabled={actionId === s.id}
                          className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50"
                        >
                          {actionId === s.id ? '...' : 'Accept'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Empty state */}
            {sessions.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <div className="text-5xl mb-4">📭</div>
                <p className="font-medium text-sm">No sessions yet</p>
                <p className="text-xs mt-1">Juniors will send requests here</p>
              </div>
            )}

            {/* Completed */}
            {completed.length > 0 && (
              <section>
                <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Completed</h2>
                <div className="space-y-3">
                  {completed.slice(0, 5).map(s => (
                    <div key={s.id} className="bg-white border border-gray-100 p-4 rounded-[1.5rem] flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-gray-900">{s.topic}</p>
                        <p className="text-[10px] text-gray-400">{s.juniorName} · {timeAgo(s.completedAt || s.createdAt)}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-1 rounded-lg ${s.status === 'COMPLETED' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </PageWrapper>
  );
}
