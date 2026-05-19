import React, { useState, useEffect, useCallback } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MentorCard from '../../features/mentoring/MentorCard';
import { fetchMentors } from '../../services/api';
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

const STATUS_BADGE = {
  PENDING:     { label: 'Pending',    cls: 'bg-orange-50 text-orange-600' },
  ACCEPTED:    { label: 'Accepted',   cls: 'bg-green-50 text-green-700' },
  IN_PROGRESS: { label: 'In Progress',cls: 'bg-blue-50 text-blue-700' },
  COMPLETED:   { label: 'Completed',  cls: 'bg-gray-50 text-gray-500' },
  CANCELLED:   { label: 'Cancelled',  cls: 'bg-red-50 text-red-500' },
};

export default function MentorsList() {
  const [view, setView]             = useState('find');
  const [topMentors, setTopMentors] = useState([]);
  const [isLoading, setIsLoading]   = useState(true);
  const [search, setSearch]         = useState('');

  // My sessions
  const [sessions, setSessions]     = useState([]);
  const [sessionsLoading, setSessionsLoading] = useState(false);
  const [chatSession, setChatSession] = useState(null);

  // Request session modal
  const [showRequest, setShowRequest] = useState(false);
  const [topic, setTopic]             = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    fetchMentors()
      .then(data => { setTopMentors(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const loadSessions = useCallback(async () => {
    setSessionsLoading(true);
    try {
      const data = await apiGet('/mentoring-sessions');
      setSessions(Array.isArray(data) ? data : []);
    } catch {}
    setSessionsLoading(false);
  }, []);

  useEffect(() => {
    if (view === 'sessions') loadSessions();
  }, [view, loadSessions]);

  const filteredMentors = topMentors.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase())
  );

  async function handleRequest() {
    if (!topic.trim()) return;
    setSubmitting(true);
    try {
      await apiPost('/mentoring-sessions', { topic: topic.trim(), issueDescription: description.trim() });
      setSuccess(true);
      setTopic('');
      setDescription('');
      setTimeout(() => { setSuccess(false); setShowRequest(false); }, 2000);
    } catch (e) { alert(e.message); }
    setSubmitting(false);
  }

  if (chatSession) {
    return (
      <ChatSession
        session={chatSession}
        onClose={() => { setChatSession(null); loadSessions(); }}
      />
    );
  }

  return (
    <>
      <PageWrapper>
        <div className="max-w-md mx-auto pb-8">

          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentoring</h1>
          </div>

          {/* Tabs */}
          <div className="bg-gray-100 p-1 rounded-xl flex mb-8">
            {[
              { key: 'find',     label: 'Find Mentor' },
              { key: 'sessions', label: 'My Sessions' },
              { key: 'rankings', label: 'Rankings' },
            ].map(tab => (
              <button
                key={tab.key}
                onClick={() => setView(tab.key)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${view === tab.key ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FIND TAB */}
          {view === 'find' && (
            <div>
              <div className="relative mb-6">
                <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search mentors..."
                  className="w-full bg-gray-50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 border border-transparent focus:bg-white transition-all"
                />
              </div>

              {isLoading ? (
                <p className="text-center text-gray-400 py-4 font-bold animate-pulse">Loading mentors...</p>
              ) : filteredMentors.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">👥</div>
                  <p className="font-medium">No mentors found</p>
                </div>
              ) : (
                filteredMentors.map(mentor => (
                  <MentorCard
                    key={mentor.id}
                    name={mentor.name}
                    initials={mentor.name.substring(0, 2).toUpperCase()}
                    subjects="Neuroscience • Biology"
                    status="ACTIVE"
                    description={`Level ${mentor.level} mentor.`}
                    languages="English, Romanian"
                    availability="Available"
                    onChat={() => setShowRequest(true)}
                  />
                ))
              )}

              <div className="mt-8 p-8 border-2 border-dashed border-blue-100 rounded-[2.5rem] text-center">
                <div className="w-14 h-14 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                  <span className="text-2xl">✨</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-2">Request a mentor session</h3>
                <p className="text-xs text-gray-400 leading-relaxed mb-6 px-4">
                  Describe your problem and an available mentor will pick it up.
                </p>
                <button
                  onClick={() => setShowRequest(true)}
                  className="w-full bg-gray-900 text-white hover:bg-black py-4 rounded-2xl font-bold text-sm transition-colors"
                >
                  Request Session
                </button>
              </div>
            </div>
          )}

          {/* MY SESSIONS TAB */}
          {view === 'sessions' && (
            <div>
              {sessionsLoading ? (
                <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-gray-100 rounded-[2rem] animate-pulse" />)}</div>
              ) : sessions.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-4">💬</div>
                  <p className="font-medium text-sm">No sessions yet</p>
                  <p className="text-xs mt-1">Request a session from the Find tab</p>
                  <button
                    onClick={() => setView('find')}
                    className="mt-4 text-xs font-bold text-blue-600 hover:underline"
                  >
                    Find a mentor →
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {sessions.map(s => {
                    const badge = STATUS_BADGE[s.status] || STATUS_BADGE.PENDING;
                    const canChat = ['ACCEPTED', 'IN_PROGRESS'].includes(s.status);
                    return (
                      <div key={s.id} className="bg-white border border-gray-100 rounded-[2rem] p-5 shadow-sm">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-gray-900 text-sm flex-1 pr-3 leading-tight">{s.topic}</h3>
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-lg flex-shrink-0 ${badge.cls}`}>{badge.label}</span>
                        </div>
                        {s.issueDescription && (
                          <p className="text-xs text-gray-400 mb-2 line-clamp-2">{s.issueDescription}</p>
                        )}
                        <div className="flex items-center justify-between mt-3">
                          <div className="text-[10px] text-gray-400">
                            {s.mentorName ? `Mentor: ${s.mentorName}` : 'Waiting for mentor'} · {timeAgo(s.createdAt)}
                          </div>
                          {canChat && (
                            <button
                              onClick={() => setChatSession(s)}
                              className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors"
                            >
                              Open Chat
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                onClick={loadSessions}
                className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 py-2"
              >
                ↻ Refresh
              </button>
            </div>
          )}

          {/* RANKINGS TAB */}
          {view === 'rankings' && (
            <div>
              <div className="space-y-4">
                {topMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl shadow-inner">{mentor.avatar}</div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm">{mentor.name}</h4>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">⭐ {mentor.rating?.toFixed(1)} · {mentor.sessions} sessions</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-blue-600">{mentor.points}</p>
                      <p className="text-[9px] text-gray-300 font-bold uppercase tracking-tighter">Points</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </PageWrapper>

      {/* Request Session Modal */}
      {showRequest && (
        <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
          <div className="bg-white w-full max-w-md sm:rounded-[2.5rem] rounded-t-[2.5rem] p-8 shadow-2xl">
            {success ? (
              <div className="text-center py-6">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-xl font-bold text-gray-900">Request Sent!</h2>
                <p className="text-sm text-gray-500 mt-2">A mentor will accept your request soon.</p>
                <p className="text-xs text-gray-400 mt-1">Check "My Sessions" tab for updates.</p>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Request a Session</h2>
                  <button onClick={() => setShowRequest(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500">✕</button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Topic *</label>
                    <input
                      value={topic}
                      onChange={e => setTopic(e.target.value)}
                      placeholder="e.g. Synaptic pruning in neural networks"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Describe your problem</label>
                    <textarea
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      rows={4}
                      placeholder="What exactly are you stuck on?"
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                  </div>
                  <button
                    onClick={handleRequest}
                    disabled={submitting || !topic.trim()}
                    className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold text-sm disabled:opacity-50 hover:bg-blue-700 transition-colors"
                  >
                    {submitting ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
