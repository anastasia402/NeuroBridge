import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import ChatSession from '../../features/mentoring/ChatSession';
import { apiGet, apiPut } from '../../services/authService';

export default function MentorSessions() {
  const [openSessions, setOpenSessions] = useState([]);
  const [activeSessions, setActiveSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingId, setAcceptingId] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [expandedId, setExpandedId] = useState(null);

  const load = useCallback(async () => {
    try {
      const [open, active] = await Promise.all([
        apiGet('/api/sessions/open'),
        apiGet('/api/sessions/my-active'),
      ]);
      setOpenSessions(Array.isArray(open) ? open : []);
      setActiveSessions(Array.isArray(active) ? active : []);
    } catch {
      setOpenSessions([]);
      setActiveSessions([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAccept = async (sessionId) => {
    setAcceptingId(sessionId);
    try {
      await apiPut(`/api/sessions/${sessionId}/accept`, {});
      await load();
    } catch (err) {
      alert(err.message || 'Failed to accept session');
    }
    setAcceptingId(null);
  };

  return (
    <>
      <PageWrapper role="MENTOR">
        <div className="max-w-md mx-auto pb-8">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Dashboard</h1>
          </div>

          {/* Active Sessions */}
          <div className="mb-10">
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Active Sessions</h2>
              {activeSessions.length > 0 && (
                <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">LIVE</span>
              )}
            </div>

            {loading ? (
              <div className="h-28 bg-gray-100 rounded-[2rem] animate-pulse" />
            ) : activeSessions.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
                <p className="text-sm text-gray-400 font-medium">No active sessions right now</p>
                <p className="text-xs text-gray-300 mt-1">Accept a request below to start one</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activeSessions.map(session => (
                  <div key={session.id} className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
                    <div className="relative z-10">
                      <h3 className="font-bold text-gray-900 text-lg mb-1">{session.topic}</h3>
                      <p className="text-sm text-blue-600 font-medium mb-4">
                        With {session.juniorName}
                        {session.startedAt && ` · Started at ${new Date(session.startedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`}
                      </p>
                      <Button
                        variant="primary"
                        className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-2xl font-bold shadow-md"
                        onClick={() => setChatOpen(true)}
                      >
                        Open Chat
                      </Button>
                    </div>
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Open Requests */}
          <div>
            <div className="flex justify-between items-center mb-4 px-2">
              <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Requests</h2>
              <span className="text-[10px] font-bold text-gray-400 italic">
                {loading ? '…' : `${openSessions.length} Pending`}
              </span>
            </div>

            {loading ? (
              <div className="space-y-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-36 bg-gray-100 rounded-[2rem] animate-pulse" />
                ))}
              </div>
            ) : openSessions.length === 0 ? (
              <div className="bg-gray-50 border border-gray-100 rounded-[2rem] p-6 text-center">
                <p className="text-sm text-gray-400 font-medium">No pending requests</p>
              </div>
            ) : (
              <div className="space-y-4">
                {openSessions.map(session => (
                  <div key={session.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-bold text-gray-900 flex-1 pr-4 leading-tight">{session.topic}</h3>
                      <Badge text={session.waitTime} variant="ai" className="bg-orange-50 text-orange-600 shrink-0" />
                    </div>

                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                        {(session.juniorName || '?')[0]}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-gray-900">{session.juniorName}</p>
                      </div>
                    </div>

                    {session.issueDescription && (
                      <div className="mb-4">
                        <button
                          onClick={() => setExpandedId(expandedId === session.id ? null : session.id)}
                          className="text-xs font-bold text-blue-500 hover:text-blue-700"
                        >
                          {expandedId === session.id ? 'Hide details ▲' : 'View problem ▼'}
                        </button>
                        {expandedId === session.id && (
                          <p className="mt-2 text-xs text-gray-600 bg-gray-50 rounded-xl p-3 leading-relaxed">
                            {session.issueDescription}
                          </p>
                        )}
                      </div>
                    )}

                    <Button
                      variant="primary"
                      className="w-full py-2.5 text-xs font-bold"
                      onClick={() => handleAccept(session.id)}
                      disabled={acceptingId === session.id}
                    >
                      {acceptingId === session.id ? 'Accepting…' : 'Accept Session'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-12 bg-gray-900 rounded-[2rem] p-7 text-white shadow-xl">
            <div className="flex items-center space-x-3 mb-4">
              <span className="text-2xl">🧠</span>
              <h3 className="font-bold text-lg">AI Matchmaking Active</h3>
            </div>
            <p className="text-sm text-gray-300 leading-relaxed mb-6">
              Our AI is currently prioritizing requests that match your expertise in{' '}
              <span className="text-blue-300 font-bold">Neuroscience</span> to minimize your context-switching time.
            </p>
            <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
              <div className="bg-blue-400 h-full w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </PageWrapper>

      <ChatSession isOpen={chatOpen} onClose={() => setChatOpen(false)} role="MENTOR" />
    </>
  );
}
