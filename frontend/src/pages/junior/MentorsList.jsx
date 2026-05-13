import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import MentorCard from '../../features/mentoring/MentorCard';
import ProgressBar from '../../components/common/ProgressBar';
import Button from '../../components/common/Button';
import { fetchMentors } from '../../services/api';

const FILTERS = ['All', 'Available Now', 'By Topic', 'By Language'];

export default function MentorsList({ openChat }) {
  const [view, setView]           = useState('find');
  const [topMentors, setTopMentors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch]       = useState('');
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    fetchMentors()
      .then(data => { setTopMentors(data); setIsLoading(false); })
      .catch(() => setIsLoading(false));
  }, []);

  const filteredMentors = topMentors.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      activeFilter === 'All' ? true :
      activeFilter === 'Available Now' ? true : // toate sunt "available" în mock
      true;
    return matchesSearch && matchesFilter;
  });

  return (
    <PageWrapper role="JUNIOR" userName="Alex" activePath="/mentors">
      <div className="max-w-md mx-auto pb-8">

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentoring</h1>
          <div className="bg-gray-100 p-1 rounded-xl flex">
            <button
              onClick={() => setView('find')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'find' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              Find
            </button>
            <button
              onClick={() => setView('rankings')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${view === 'rankings' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
            >
              Rankings
            </button>
          </div>
        </div>

        {view === 'rankings' ? (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-blue-600 rounded-[2rem] p-6 mb-10 text-white shadow-xl relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-xs font-bold uppercase tracking-widest opacity-80 mb-4">Your Progress</h3>
                <div className="flex justify-between items-end mb-3">
                  <div>
                    <p className="text-2xl font-bold">Level 12</p>
                    <p className="text-[10px] font-medium opacity-80 uppercase tracking-wider">760 pts to Level 13</p>
                  </div>
                  <span className="text-sm font-bold bg-white/20 px-3 py-1 rounded-lg">Rank #14</span>
                </div>
                <ProgressBar progress={62} colorClass="bg-white" className="h-2 opacity-100" />
              </div>
              <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
            </div>

            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6 px-2">Top Mentors</h2>
            <div className="space-y-4">
              {isLoading ? (
                <p className="text-center text-gray-400 py-4 font-bold animate-pulse">Loading mentors...</p>
              ) : topMentors.length === 0 ? (
                <p className="text-center text-gray-400 py-4">No mentors found.</p>
              ) : (
                topMentors.map(mentor => (
                  <div key={mentor.id} className="bg-white border border-gray-100 p-5 rounded-[2rem] flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-2xl shadow-inner">
                        {mentor.avatar}
                      </div>
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
                ))
              )}
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Search */}
            <div className="relative mb-4">
              <span className="absolute left-4 top-3.5 text-gray-400">🔍</span>
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search subjects or names..."
                className="w-full bg-gray-50 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all border border-transparent focus:bg-white"
              />
            </div>

            {/* Filter tabs */}
            <div className="flex space-x-2 mb-8 overflow-x-auto pb-2">
              {FILTERS.map(f => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`whitespace-nowrap px-5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    activeFilter === f ? 'bg-blue-500 text-white' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Mentor cards */}
            {isLoading ? (
              <p className="text-center text-gray-400 py-4 font-bold animate-pulse">Loading mentors...</p>
            ) : filteredMentors.length === 0 ? (
              <div className="text-center py-12 text-gray-400">
                <div className="text-4xl mb-3">👥</div>
                <p className="font-medium">Niciun mentor găsit</p>
              </div>
            ) : (
              filteredMentors.map(mentor => (
                <MentorCard
                  key={mentor.id}
                  name={mentor.name}
                  initials={mentor.name.substring(0, 2).toUpperCase()}
                  subjects="Neuroscience • Biology"
                  status="ACTIVE"
                  description={`Level ${mentor.level} mentor. Passionate about bridging the gap between complex science and student understanding.`}
                  languages="English, Romanian"
                  availability="Available in 10m"
                  onChat={openChat}
                />
              ))
            )}

            {/* AI Matchmaking */}
            <div className="mt-8 p-8 border-2 border-dashed border-blue-100 rounded-[2.5rem] text-center">
              <div className="w-14 h-14 bg-blue-50 text-blue-400 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-bold text-gray-900 mb-2">Let us find your perfect match</h3>
              <p className="text-xs text-gray-400 leading-relaxed mb-8 px-4">
                Can't find a mentor? Our AI will pair you with the best available expert based on your specific goals.
              </p>
              <Button
                onClick={openChat}
                variant="primary"
                className="w-full bg-gray-900 text-white hover:bg-black py-4 rounded-2xl font-bold"
              >
                Pair Me Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </PageWrapper>
  );
}
