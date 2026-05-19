import React, { useState, useRef, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { getToken, getUserId } from '../../utils/authUtils';

const HUB_URL = 'http://localhost:5294/chatHub';

export default function ChatSession({ session, onClose, onComplete }) {
  const [messages, setMessages]   = useState([]);
  const [input, setInput]         = useState('');
  const [connected, setConnected] = useState(false);
  const [error, setError]         = useState(null);
  const hubRef  = useRef(null);
  const scrollRef = useRef(null);
  const userId  = parseInt(getUserId(), 10);
  const isMentor = session?.mentorId === userId;

  useEffect(() => {
    if (!session) return;

    let cancelled = false;

    const hub = new signalR.HubConnectionBuilder()
      .withUrl(HUB_URL, {
        accessTokenFactory: () => getToken(),
        transport: signalR.HttpTransportType.WebSockets,
        skipNegotiation: true,
      })
      .withAutomaticReconnect()
      .build();

    hub.on('LoadMessages', (msgs) => { if (!cancelled) setMessages(Array.isArray(msgs) ? msgs : []); });
    hub.on('ReceiveMessage', (msg) => { if (!cancelled) setMessages(prev => [...prev, msg]); });
    hub.on('Error', (err) => { if (!cancelled) setError(err); });
    hub.onclose(() => { if (!cancelled) setConnected(false); });

    hub.start()
      .then(() => {
        if (cancelled) return;
        setConnected(true);
        setError(null);
        hub.invoke('JoinSession', { sessionId: session.id, userId });
      })
      .catch((err) => {
        if (!cancelled && !err?.message?.includes('stop()')) {
          setError('Could not connect to chat');
        }
      });

    hubRef.current = hub;

    return () => {
      cancelled = true;
      hub.stop().catch(() => {});
    };
  }, [session?.id]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!session) return null;

  function getSenderName(senderId) {
    if (senderId === session.juniorId) return session.juniorName || 'Junior';
    if (senderId === session.mentorId) return session.mentorName || 'Mentor';
    return 'User';
  }

  function handleSend() {
    if (!input.trim() || !connected) return;
    hubRef.current?.invoke('SendMessage', { message: input.trim(), messageType: 0 });
    setInput('');
  }

  function formatTime(dateStr) {
    return new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg h-[600px] max-h-[90vh] rounded-[2rem] shadow-2xl flex flex-col overflow-hidden">

        {/* Header */}
        <div className="flex justify-between items-center px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-bold text-gray-900 text-sm">{session?.topic || 'Chat'}</h2>
            <div className="flex items-center text-[10px] font-bold uppercase mt-0.5">
              {connected
                ? <><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" /><span className="text-green-500">Connected</span></>
                : <><span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-1.5" /><span className="text-gray-400">Connecting...</span></>
              }
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isMentor && onComplete && (
              <button onClick={onComplete} className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1.5 rounded-xl hover:bg-green-200 transition-colors">
                Complete
              </button>
            )}
            <button onClick={onClose} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold text-sm">
              ✕
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-xs font-medium px-5 py-1.5 border-b border-red-100">{error}</div>
        )}

        {/* With who */}
        <div className="px-5 py-1.5 bg-gray-50 border-b border-gray-100">
          <span className="text-[10px] text-gray-400 font-medium">
            {isMentor ? `With: ${session?.juniorName}` : `With: ${session?.mentorName || 'Waiting for mentor...'}`}
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center text-gray-400 text-sm mt-10">
              <div className="text-3xl mb-2">💬</div>
              <p className="font-medium text-xs">No messages yet. Say hello!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isMe = msg.senderId === userId;
            const name = getSenderName(msg.senderId);
            return (
              <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                {!isMe && (
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600 mr-2 shrink-0 mt-1">
                    {name.charAt(0)}
                  </div>
                )}
                <div className={`max-w-[75%] px-3 py-2.5 rounded-2xl text-sm shadow-sm ${
                  isMe ? 'bg-blue-500 text-white rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                }`}>
                  {!isMe && <p className="text-[10px] font-bold mb-1 opacity-70">{name}</p>}
                  <p className="leading-relaxed text-sm">{msg.message}</p>
                  <p className={`text-[9px] mt-1 font-bold opacity-50 ${isMe ? 'text-right' : ''}`}>
                    {msg.sentAt ? formatTime(msg.sentAt) : ''}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center space-x-2 bg-gray-50 rounded-2xl px-3 py-2 border border-gray-200 focus-within:border-blue-300 focus-within:bg-white transition-all">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 bg-transparent border-none focus:ring-0 text-sm"
              disabled={!connected}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || !connected}
              className="w-8 h-8 bg-blue-500 text-white rounded-xl flex items-center justify-center disabled:opacity-40 hover:bg-blue-600 transition-colors shrink-0"
            >
              ➔
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
