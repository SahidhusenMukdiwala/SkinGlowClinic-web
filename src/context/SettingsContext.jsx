'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchSettings } from '@/lib/api';
import { CLINIC_DEFAULTS } from '@/lib/constants';

const SettingsContext = createContext({
  settings: CLINIC_DEFAULTS,
  loading: false,
  refetchSettings: async () => {},
});

export function SettingsProvider({ children, initialSettings }) {
  const [settings, setSettings] = useState(initialSettings || CLINIC_DEFAULTS);
  const [loading, setLoading] = useState(!initialSettings);

  const loadSettings = useCallback(async () => {
    try {
      const data = await fetchSettings();
      if (data && typeof data === 'object') {
        setSettings((prev) => ({ ...prev, ...data }));
      }
    } catch (err) {
      console.warn('Failed to load site settings:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSettings();

    // Listen for live updates dispatched when admin updates settings
    const handleSettingsChanged = (e) => {
      if (e.detail && typeof e.detail === 'object') {
        setSettings((prev) => ({ ...prev, ...e.detail }));
      } else {
        loadSettings();
      }
    };

    window.addEventListener('settings-changed', handleSettingsChanged);
    return () => {
      window.removeEventListener('settings-changed', handleSettingsChanged);
    };
  }, [loadSettings]);

  return (
    <SettingsContext.Provider value={{ settings, loading, refetchSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    return { settings: CLINIC_DEFAULTS, loading: false, refetchSettings: async () => {} };
  }
  return context;
}
