import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PageWrapper from '../../components/layout/PageWrapper';
import Button from '../../components/common/Button';
import JuniorSnapshot from '../../features/mentoring/JuniorSnapshot';
import SessionRating from '../../features/mentoring/SessionRating';

export default function MentoringChat({ role = "JUNIOR" }) {
  const { uuid } = useParams(); 
  const [sessionState, setSessionState] = useState('ACTIVE'); 
  const [inputValue, setInputValue] = useState('');
  const scrollRef = useRef(null);

  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm stuck on how synaptic pruning relates to the quiz.", sender: "JUNIOR", time: "10:30" },
    { id: 2, text: "Hello! I see your recent score. Let's look at that specific gap.", sender: "MENTOR", time: "10:31" },
  ]);

  const isMentor = role === "MENTOR";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      text: inputValue,
      sender: role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputValue('');
  };

  if (sessionState === 'CLOSED' && !isMentor) {
    return (
      <PageWrapper role={role} activePath={`/mentoring/${uuid}`}>
        <SessionRating />
      </PageWrapper>
    );
  }

  const handleCloseSession = () => {
    setSessionState('CLOSED');
    if (isMentor) window.location.href = '/mentor/sessions';
  };

  return (
    <PageWrapper role={role} activePath={`/mentoring/${uuid}`}>
      <div className="flex flex-col md:flex-row max-w-5xl mx-auto h-[calc(100vh-100px)] relative gap-6 pb-20 md:pb-0">
        
        {isMentor && (
          <div className="hidden md:block w-80 flex-shrink-0 animate-in fade-in slide-in-from-left-4">
            <JuniorSnapshot />
          </div>
        )}

        <div className="flex-1 flex flex-col bg-white md:border md:border-gray-100 md:rounded-[2.5rem] md:shadow-sm md:overflow-hidden relative">
          
          <div className="flex justify-between items-center p-4 border-b border-gray-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
            <div>
              <h2 className="font-bold text-gray-900">{isMentor ? "Mentoring Session" : "Live Help"}</h2>
              <span className="text-[10px] font-bold text-gray-400">ID: {uuid?.slice(0,8)}</span>
            </div>
            
            <Button 
              onClick={handleCloseSession}
              variant={isMentor ? "primary" : "secondary"}
              className={`text-xs px-4 py-2 ${isMentor ? 'bg-green-500 hover:bg-green-600 text-white' : ''}`}
            >
              {isMentor ? "Marchează ca rezolvat" : "Închide sesiunea"}
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-hide">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === role ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] md:max-w-[70%] p-4 rounded-[1.8rem] shadow-sm text-sm leading-relaxed ${
                  msg.sender === role 
                  ? 'bg-blue-500 text-white rounded-tr-none' 
                  : 'bg-gray-50 border border-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {msg.text}
                  <span className={`text-[9px] block mt-2 opacity-60 font-bold ${msg.sender === role ? 'text-right' : 'text-left'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
            <div ref={scrollRef} />
          </div>

          <div className="fixed bottom-[70px] md:bottom-0 left-0 right-0 md:relative bg-white border-t border-gray-100 p-3 z-50">
            <div className="max-w-md md:max-w-none mx-auto flex items-center space-x-3 bg-gray-50 rounded-[1.5rem] p-1.5 border border-gray-200 focus-within:bg-white focus-within:border-blue-300 transition-all">
              <input 
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Write your message..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4"
              />
              <button 
                onClick={handleSend}
                className="bg-blue-500 text-white w-10 h-10 rounded-[1.2rem] flex items-center justify-center shadow-md active:scale-95 transition-all"
              >
                ➔
              </button>
            </div>
          </div>

        </div>
      </div>
    </PageWrapper>
  );
}