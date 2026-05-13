import React, { useState, useEffect } from 'react';
import PageWrapper from '../../components/layout/PageWrapper';
import { apiGet, apiPut } from '../../services/authService';

const PRESETS = [
  { name: 'Midnight',  color: '#111827' },
  { name: 'Ocean',     color: '#0ea5e9' },
  { name: 'Violet',    color: '#7c3aed' },
  { name: 'Rose',      color: '#e11d48' },
  { name: 'Amber',     color: '#d97706' },
  { name: 'Emerald',   color: '#059669' },
  { name: 'Slate',     color: '#475569' },
  { name: 'Indigo',    color: '#4f46e5' },
];

export default function OrgSettingsPage() {
  const [form, setForm] = useState({
    organizationName: '',
    primaryColor: '#111827',
    logoUrl: '',
    welcomeMessage: '',
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    apiGet('/api/settings/org').then(data => {
      setForm({
        organizationName: data.organizationName || '',
        primaryColor: data.primaryColor || '#111827',
        logoUrl: data.logoUrl || '',
        welcomeMessage: data.welcomeMessage || '',
      });
    }).catch(() => {});
  }, []);

  const handlePreset = (color) => {
    setForm(f => ({ ...f, primaryColor: color }));
    document.documentElement.style.setProperty('--color-primary', color);
  };

  const handleColorChange = (e) => {
    const c = e.target.value;
    setForm(f => ({ ...f, primaryColor: c }));
    document.documentElement.style.setProperty('--color-primary', c);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      await apiPut('/api/admin/settings', form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      setError(err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  return (
    <PageWrapper role="ADMIN">
      <div className="space-y-6 max-w-xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Org Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Customize your organization's branding</p>
        </div>

        {/* Live Preview */}
        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          <div className="h-16 flex items-center px-5 gap-3" style={{ backgroundColor: form.primaryColor }}>
            {form.logoUrl && (
              <img src={form.logoUrl} alt="logo" className="h-8 w-8 rounded-full object-cover" />
            )}
            <span className="text-white font-bold text-lg">{form.organizationName || 'NeuroBridge'}</span>
          </div>
          <div className="bg-white p-4">
            <p className="text-gray-700 text-sm">{form.welcomeMessage || 'Welcome to NeuroBridge'}</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Organization Name</label>
            <input
              type="text"
              value={form.organizationName}
              onChange={e => setForm(f => ({ ...f, organizationName: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Welcome Message</label>
            <input
              type="text"
              value={form.welcomeMessage}
              onChange={e => setForm(f => ({ ...f, welcomeMessage: e.target.value }))}
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Logo URL</label>
            <input
              type="url"
              value={form.logoUrl}
              onChange={e => setForm(f => ({ ...f, logoUrl: e.target.value }))}
              placeholder="https://..."
              className="mt-1 w-full border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Theme Color</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {PRESETS.map(p => (
                <button
                  key={p.color}
                  type="button"
                  onClick={() => handlePreset(p.color)}
                  title={p.name}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    form.primaryColor === p.color ? 'border-gray-900 scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: p.color }}
                />
              ))}
            </div>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={form.primaryColor}
                onChange={handleColorChange}
                className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={form.primaryColor}
                onChange={e => handlePreset(e.target.value)}
                className="w-32 border border-gray-200 rounded-xl px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm transition-all disabled:opacity-60"
            style={{ backgroundColor: form.primaryColor }}
          >
            {saving ? 'Saving…' : saved ? '✓ Saved!' : 'Save Settings'}
          </button>
        </form>
      </div>
    </PageWrapper>
  );
}
