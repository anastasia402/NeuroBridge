import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import QuizzesReview from './pages/admin/QuizzesReview';

import JuniorDashboard from './pages/junior/JuniorDashboard';
import StudyLibrary from './pages/junior/StudyLibrary';
import MentorsList from './pages/junior/MentorsList';
import Stats from './pages/junior/Stats';
import Profile from './pages/junior/Profile';

import MentorSessions from './pages/mentor/MentorSessions';

import ChatSession from './features/mentoring/ChatSession';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRole, setChatRole] = useState("JUNIOR"); 

  const handleOpenChat = (role) => {
    setChatRole(role);
    setIsChatOpen(true);
  };

  return (
    <Router>
      
      <ChatSession 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        role={chatRole} 
      />

      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- JUNIOR ROUTES --- */}
        {/* Pass the handleOpenChat function so buttons inside these pages work */}
        <Route path="/dashboard" element={<JuniorDashboard openChat={() => handleOpenChat("JUNIOR")} />} />
        <Route path="/study" element={<StudyLibrary />} />
        
        {/* This is what connects the "Chat Now" buttons in your MentorsList! */}
        <Route path="/mentors" element={<MentorsList openChat={() => handleOpenChat("JUNIOR")} />} />
        
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />

        {/* --- MENTOR ROUTES --- */}
        {/* Mentors can also trigger the chat when they accept a session */}
        <Route path="/mentor/sessions" element={<MentorSessions openChat={() => handleOpenChat("MENTOR")} />} />
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/quizzes" element={<QuizzesReview />} />
        
        {/* Fallback Route for 404 Not Found */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen bg-gray-50 text-xl font-bold text-gray-900">
            404 - Page Not Found
          </div>
        } />
      </Routes>
    </Router>
  );
}