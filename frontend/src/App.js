import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { OrgSettingsContext } from './context/OrgSettingsContext';
import { useOrgSettings } from './hooks/useOrgSettings';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

import AdminDashboard from './pages/admin/AdminDashboard';
import QuizzesReview from './pages/admin/QuizzesReview';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import GenerateQuizPage from './pages/admin/GenerateQuizPage';

import JuniorDashboard from './pages/junior/JuniorDashboard';
import StudyLibrary from './pages/junior/StudyLibrary';
import MentorsList from './pages/junior/MentorsList';
import Stats from './pages/junior/Stats';
import MaterialView from './pages/junior/MaterialView';
import Profile from './pages/junior/Profile';
import QuizListPage from './pages/junior/QuizListPage';

import MentorSessions from './pages/mentor/MentorSessions';
import OrgSettingsPage from './pages/admin/OrgSettingsPage';

import ChatSession from './features/mentoring/ChatSession';

export default function App() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatRole, setChatRole] = useState("JUNIOR");
  const orgSettings = useOrgSettings();

  const handleOpenChat = (role) => {
    setChatRole(role);
    setIsChatOpen(true);
  };

  return (
    <OrgSettingsContext.Provider value={orgSettings}>
    <Router>
      
      <ChatSession 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
        role={chatRole} 
      />

      <Routes>
        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- AUTH ROUTES --- */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* --- JUNIOR ROUTES --- */}
        {/* Pass the handleOpenChat function so buttons inside these pages work */}
        <Route path="/dashboard" element={<JuniorDashboard openChat={() => handleOpenChat("JUNIOR")} />} />
        <Route path="/study" element={<StudyLibrary />} />
        <Route path="/study/:id" element={<MaterialView />} />
        
        {/* This is what connects the "Chat Now" buttons in your MentorsList! */}
        <Route path="/mentors" element={<MentorsList openChat={() => handleOpenChat("JUNIOR")} />} />
        
        <Route path="/quizzes" element={<QuizListPage />} />
        <Route path="/stats" element={<Stats />} />
        <Route path="/profile" element={<Profile />} />

        {/* --- MENTOR ROUTES --- */}
        {/* Mentors can also trigger the chat when they accept a session */}
        <Route path="/mentor/sessions" element={<MentorSessions openChat={() => handleOpenChat("MENTOR")} />} />
        
        {/* --- ADMIN ROUTES --- */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsersPage />} />
        <Route path="/admin/generate" element={<GenerateQuizPage />} />
        <Route path="/admin/quizzes" element={<QuizzesReview />} />
        <Route path="/admin/settings" element={<OrgSettingsPage />} />
        
        {/* Fallback Route for 404 Not Found */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen bg-gray-50 text-xl font-bold text-gray-900">
            404 - Page Not Found
          </div>
        } />
      </Routes>
    </Router>
    </OrgSettingsContext.Provider>
  );
}