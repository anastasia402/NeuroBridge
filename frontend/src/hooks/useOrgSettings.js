import { useState, useEffect } from 'react';

export function useOrgSettings() {
  const [settings, setSettings] = useState({
    organizationName: 'NeuroBridge',
    primaryColor: '#111827',
    logoUrl: '',
    welcomeMessage: 'Welcome to NeuroBridge',
  });

  useEffect(() => {
    fetch('http://localhost:5294/api/settings/org')
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return;
        setSettings(data);
        if (data.primaryColor) {
          document.documentElement.style.setProperty('--color-primary', data.primaryColor);
        }
      })
      .catch(() => {});
  }, []);

  return settings;
}
