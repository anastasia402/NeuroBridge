import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import AdminDashboard from './pages/admin/AdminDashboard';
import QuizzesReview from './pages/admin/QuizzesReview';

import JuniorDashboard from './pages/junior/JuniorDashboard';
import StudyLibrary from './pages/junior/StudyLibrary';
import MentorsList from './pages/junior/MentorsList';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Default Redirect: Send users to the Junior dashboard by default for now */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* --- JUNIOR ROUTES --- */}
        <Route path="/dashboard" element={<JuniorDashboard />} />
        <Route path="/study" element={<StudyLibrary />} />
        <Route path="/mentors" element={<MentorsList />} />
        
        {/* <Route path="/stats" element={<Stats />} /> */}
        {/* <Route path="/profile" element={<Profile />} /> */}

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