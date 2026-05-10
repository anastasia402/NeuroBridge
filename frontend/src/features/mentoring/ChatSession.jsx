import React, { useState, useRef, useEffect } from 'react';
import JuniorSnapshot from './JuniorSnapshot'; 

export default function ChatSession({ isOpen, onClose, role = "JUNIOR" }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "I'm stuck on how synaptic pruning relates to the quiz.", sender: "JUNIOR", time: "10:30" },
    { id: 2, text: "Let's look at your recent score and bridge that gap.", sender: "MENTOR", time: "10:31" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const scrollRef = useRef(null);
  const isMentor = role === "MENTOR";

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!isOpen) return null;

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;
    setMessages([...messages, {
      id: Date.now(),
      text: inputValue,
      sender: role,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }]);
    setInputValue("");
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4">
      
      <div className="bg-white w-full max-w-3xl h-[90vh] sm:h-[80vh] sm:rounded-[2.5rem] rounded-t-[2.5rem] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
        
        <div className="flex justify-between items-center p-6 border-b border-gray-50 bg-white">
          <div>
            <h2 className="font-bold text-gray-900 text-lg">
              {isMentor ? "Mentoring Alex" : "Flash Mentoring"}
            </h2>
            <div className="flex items-center text-[10px] font-bold text-green-500 uppercase">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-2 animate-pulse"></span>
              Connected
            </div>
          </div>
          <button 
            onClick={onClose}
            className="bg-gray-100 text-gray-400 w-10 h-10 rounded-full hover:bg-gray-200 hover:text-gray-900 transition-colors flex items-center justify-center font-bold"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 flex overflow-hidden">
          
          {isMentor && (
            <div className="hidden sm:block w-80 bg-gray-50 border-r border-gray-100 p-6 overflow-y-auto">
              <JuniorSnapshot />
            </div>
          )}

          <div className="flex-1 flex flex-col bg-white">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === role ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] p-4 rounded-[1.8rem] shadow-sm ${
                    msg.sender === role ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                    <span className="text-[9px] block mt-2 opacity-60 font-bold">{msg.time}</span>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t border-gray-50">
              <div className="flex items-center space-x-3 bg-gray-50 rounded-[1.5rem] p-2 border border-gray-200">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your message..."
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm px-4"
                />
                <button 
                  onClick={handleSendMessage}
                  className="bg-blue-500 text-white w-10 h-10 rounded-xl flex items-center justify-center shadow-md active:scale-95 transition-all"
                >
                  ➔
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}