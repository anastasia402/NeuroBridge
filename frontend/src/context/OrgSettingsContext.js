import { createContext, useContext } from 'react';

export const OrgSettingsContext = createContext({
  organizationName: 'NeuroBridge',
  primaryColor: '#111827',
  logoUrl: '',
  welcomeMessage: 'Welcome to NeuroBridge',
});

export function useOrgSettingsContext() {
  return useContext(OrgSettingsContext);
}
