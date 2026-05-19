import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import ProfileHero from '../../features/profile/ProfileHero';
import SettingsItem from '../../features/profile/SettingsItem';
import { logout } from '../../utils/authUtils';
import { apiGet, apiUpload } from '../../services/authService';

const getPref = (key, def) => {
  const v = localStorage.getItem(`pref_${key}`);
  return v === null ? def : v === 'true';
};
const setPref = (key, val) => localStorage.setItem(`pref_${key}`, String(val));

export default function Profile() {
  const [user, setUser]               = useState(null);
  const [isEditing, setIsEditing]     = useState(false);
  const [nameInput, setNameInput]     = useState('');
  const [saving, setSaving]           = useState(false);

  const [notifications, setNotifications] = useState(() => getPref('notifications', true));
  const [quietMode, setQuietMode]         = useState(() => getPref('quietMode', false));
  const [gentleCopy, setGentleCopy]       = useState(() => getPref('gentleCopy', true));

  useEffect(() => {
    apiGet('/users/me').then(u => {
      setUser(u);
      setNameInput(u.fullName || '');
    }).catch(() => {});
  }, []);

  const handleToggle = (key, setter) => val => {
    setter(val);
    setPref(key, val);
  };

  const handleSaveName = async () => {
    if (!nameInput.trim()) return;
    setSaving(true);
    try {
      const fd = new FormData();
      const res = await fetch('http://localhost:5294/api/users/me', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ fullName: nameInput.trim() }),
      });
      if (res.ok) {
        const data = await res.json();
        setUser(u => ({ ...u, fullName: data.fullName }));
        localStorage.setItem('fullName', data.fullName);
        setIsEditing(false);
      }
    } catch {}
    setSaving(false);
  };

  return (
    <PageWrapper>
      <div className="max-w-md mx-auto pb-10">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <button
            onClick={() => setIsEditing(e => !e)}
            className="text-xs font-bold text-blue-600 hover:text-blue-700"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </button>
        </div>

        {isEditing ? (
          <div className="bg-white border border-gray-100 rounded-[2rem] p-6 mb-8 shadow-sm space-y-4">
            <div>
              <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">Display Name</label>
              <input
                value={nameInput}
                onChange={e => setNameInput(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={handleSaveName}
              disabled={saving || !nameInput.trim()}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold disabled:opacity-50 hover:bg-blue-700"
            >
              {saving ? 'Saving…' : 'Save Changes'}
            </button>
          </div>
        ) : (
          <ProfileHero
            name={user?.fullName || localStorage.getItem('fullName') || 'User'}
            email={user?.email}
            xp={user?.experiencePoints}
            level={user ? `Level ${user.level} Learner` : '—'}
            streak={user ? `${user.currentStreak} Day Streak` : '—'}
          />
        )}

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Account & Learning</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem
            icon="🔔"
            label="Notifications"
            subtext={notifications ? 'Daily reminders & activity alerts' : 'Notifications off'}
            isToggle={true}
            toggled={notifications}
            onClick={() => handleToggle('notifications', setNotifications)(!notifications)}
          />
          <SettingsItem
            icon="⏱"
            label="Study Reminders"
            subtext="Mon, Wed, Fri at 6:00 PM"
            onClick={() => alert('Study Reminders — coming soon')}
          />
          <SettingsItem
            icon="🧠"
            label="AI Quiz Preferences"
            subtext="Short format, Conceptual focus"
            onClick={() => alert('AI Quiz Preferences — coming soon')}
          />
          <SettingsItem
            icon="🌐"
            label="App Language"
            value="English (US)"
            onClick={() => alert('Language settings — coming soon')}
          />
        </div>

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Experience</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem
            icon="🌙"
            label="Quiet Mode"
            subtext="Mutes all sounds during study"
            isToggle={true}
            toggled={quietMode}
            onClick={() => handleToggle('quietMode', setQuietMode)(!quietMode)}
          />
          <SettingsItem
            icon="🍃"
            label="Gentle Copy"
            subtext="Use softer, encouraging feedback"
            isToggle={true}
            toggled={gentleCopy}
            onClick={() => handleToggle('gentleCopy', setGentleCopy)(!gentleCopy)}
          />
        </div>

        <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4 ml-2">Support</h3>
        <div className="bg-white border border-gray-100 rounded-[2rem] overflow-hidden shadow-sm mb-8 divide-y divide-gray-50">
          <SettingsItem icon="❓" label="Help Center" subtext="FAQs and platform tutorials" onClick={() => alert('Help Center — coming soon')} />
          <SettingsItem icon="💬" label="Send Feedback" subtext="Help us improve your experience" onClick={() => alert('Feedback — coming soon')} />
          <SettingsItem icon="🛡️" label="Privacy & Data" subtext="Manage your learning history" onClick={() => alert('Privacy & Data — coming soon')} />
        </div>

        <button
          onClick={logout}
          className="w-full bg-red-50 text-red-600 font-bold py-4 rounded-[2rem] flex items-center justify-center space-x-3 hover:bg-red-100 transition-colors"
        >
          <span>🚪</span>
          <span>Sign Out</span>
        </button>

        <p className="text-center text-[10px] text-gray-300 font-bold mt-8 uppercase tracking-widest">
          NeuroBridge Version 2.4.0
        </p>
      </div>
    </PageWrapper>
  );
}
