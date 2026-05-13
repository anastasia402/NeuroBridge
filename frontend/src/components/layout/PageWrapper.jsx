import React from 'react';
import Topbar from './Topbar';
import BottomNav from './BottomNav';
import AdminBottomNav from './AdminBottomNav';

export default function PageWrapper({ children, role = 'JUNIOR', userName = 'Alex' }) {
  const isAdmin = role === 'ADMIN';

  return (
    <div className="flex min-h-screen bg-white">
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar userName={userName} role={role} />

        <main className="flex-1 overflow-y-auto p-6 pb-24">
          <div className={isAdmin ? 'w-full' : 'max-w-md mx-auto'}>
            {children}
          </div>
        </main>

        {isAdmin ? <AdminBottomNav /> : <BottomNav />}
      </div>
    </div>
  );
}
