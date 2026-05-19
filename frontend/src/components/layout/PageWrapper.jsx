import React from 'react';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import AdminBottomNav from './AdminBottomNav';
import MentorBottomNav from './MentorBottomNav';

export default function PageWrapper({ children }) {
  const role = (localStorage.getItem('role') || 'JUNIOR').toUpperCase();
  const userName = localStorage.getItem('fullName') || 'User';
  const isAdmin  = role === 'ADMIN';
  const isMentor = role === 'MENTOR';

  const Nav = isAdmin ? AdminBottomNav : isMentor ? MentorBottomNav : BottomNav;

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={userName} role={role} />

        <main className="flex-1 overflow-y-auto p-6 pb-24">
          <div className={isAdmin ? 'w-full' : 'max-w-md mx-auto'}>
            {children}
          </div>
        </main>

        <Nav />
      </div>
    </div>
  );
}
