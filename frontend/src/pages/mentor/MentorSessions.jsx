import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';

export default function MentorSessions() {
  const [openSessions, setOpenSessions] = useState([
    { id: 1, issue: "Neural Pathway Calculation Error", junior: "Alex Rivera", waitTime: "4m", type: "Neuroscience" },
    { id: 2, issue: "Memory Leak in Python Script", junior: "Jordan Bridge", waitTime: "12m", type: "Computer Science" }
  ]);

  const [activeSessions, setActiveSessions] = useState([
    { id: 3, issue: "Cognitive Load Theory Case Study", junior: "Sarah Jenkins", startTime: "10:30 AM" }
  ]);

  return (
    <PageWrapper role="MENTOR" userName="Dr. Aris Thorne" activePath="/mentor/sessions">
      <div className="max-w-md mx-auto pb-8">
        
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Mentor Dashboard</h1>
          <div className="flex space-x-3">
             <button className="text-xl p-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">⚙️</button>
          </div>
        </div>

        <div className="mb-10">
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">My Active Sessions</h2>
            <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded-lg">LIVE</span>
          </div>
          
          <div className="space-y-4">
            {activeSessions.map(session => (
              <div key={session.id} className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] shadow-sm relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="font-bold text-gray-900 text-lg mb-1">{session.issue}</h3>
                  <p className="text-sm text-blue-600 font-medium mb-4">With {session.junior} • Started at {session.startTime}</p>
                  <Button variant="primary" className="w-full bg-blue-600 text-white hover:bg-blue-700 py-3 rounded-2xl font-bold shadow-md">
                    Open Chat
                  </Button>
                </div>
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4 px-2">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Requests</h2>
            <span className="text-[10px] font-bold text-gray-400 italic">{openSessions.length} Pending</span>
          </div>

          <div className="space-y-4">
            {openSessions.map(session => (
              <div key={session.id} className="bg-white border border-gray-100 p-6 rounded-[2rem] shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-gray-900 flex-1 pr-4 leading-tight">{session.issue}</h3>
                  <Badge text={session.waitTime} variant="ai" className="bg-orange-50 text-orange-600" />
                </div>
                
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-xs text-gray-500 uppercase">
                    {session.junior.charAt(0)}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900">{session.junior}</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">{session.type}</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <Button variant="secondary" className="flex-1 py-2.5 bg-gray-50 hover:bg-gray-100 border-none text-xs">View Problem</Button>
                  <Button variant="primary" className="flex-1 py-2.5 text-xs font-bold">Accept Session</Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 bg-gray-900 rounded-[2rem] p-7 text-white shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <span className="text-2xl">🧠</span>
            <h3 className="font-bold text-lg">AI Matchmaking Active</h3>
          </div>
          <p className="text-sm text-gray-300 leading-relaxed mb-6">
            Our AI is currently prioritizing requests that match your expertise in <span className="text-blue-300 font-bold">Neuroscience</span> to minimize your context-switching time.
          </p>
          <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
             <div className="bg-blue-400 h-full w-2/3 animate-pulse"></div>
          </div>
        </div>

      </div>
    </PageWrapper>
  );
}