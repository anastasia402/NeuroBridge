import React from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import ProfileHero from '../../features/profile/ProfileHero';
import SettingsItem from '../../features/profile/SettingsItem';

export default function Profile() {
  return (
    <PageWrapper role="JUNIOR" userName="Alex" activePath="/profile">
      <div className="max-w-md mx-auto pb-10">
        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button className="text-xl text-gray-400 hover:text-gray-900">⚙️</button>
        </div>

        <ProfileHero
          name="Alex Chen"
          bio="Aspiring Neural Network Expert"
          level="Level 12 Learner"
          streak="42 Day Streak"
        />

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Account & Learning</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem icon="🔔" label="Notifications" subtext="Daily reminders & activity alerts" />
          <SettingsItem icon="⏱" label="Study Reminders" subtext="Mon, Wed, Fri at 6:00 PM" />
          <SettingsItem icon="🧠" label="AI Quiz Preferences" subtext="Short format, Conceptual focus" />
          <SettingsItem icon="🌐" label="App Language" value="English (US)" />
        </div>

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Experience</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem icon="🌙" label="Quiet Mode" subtext="Mutes all sounds during study" isToggle={true} />
          <SettingsItem icon="🍃" label="Gentle Copy" subtext="Use softer, encouraging feedback" isToggle={true} />
        </div>

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Support</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem icon="❓" label="Help Center" subtext="FAQs and platform tutorials" />
          <SettingsItem icon="💬" label="Send Feedback" subtext="Help us improve your experience" />
          <SettingsItem icon="🛡️" label="Privacy & Data" subtext="Manage your learning history" />
        </div>

        {/* Sign Out Button [cite: 721] */}
        <button className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-[2rem] flex items-center justify-center space-x-3 hover:bg-red-100 transition-colors">
          <span>🚪</span>
          <span>Sign Out</span>
        </button>

        <p className="text-center text-[10px] text-gray-300 font-bold mt-8 uppercase tracking-widest">
          NeuroBridge Version 2.4.0 (Build 482)
        </p>

      </div>
    </PageWrapper>
  );
}