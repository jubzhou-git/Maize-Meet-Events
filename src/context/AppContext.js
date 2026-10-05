import React, { createContext, useContext, useEffect, useState } from 'react';
import { getEvents, getSavedEventIds, toggleSavedEvent } from '../db/database';
import { defaultPreferences, getPreferences } from '../storage/preferences';

const AppContext = createContext(null);

export function AppContextProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);
  const [events, setEvents] = useState([]);
  const [savedEventIds, setSavedEventIds] = useState([]);
  const [preferences, setPreferences] = useState(defaultPreferences);

  useEffect(() => {
    getEvents().then(setEvents);
    getSavedEventIds().then(setSavedEventIds);
    getPreferences().then(setPreferences);
  }, []);

  async function toggleSaved(eventId) {
    const isSaved = await toggleSavedEvent(eventId);
    setSavedEventIds((current) =>
      isSaved ? [...current, eventId] : current.filter((id) => id !== eventId)
    );
    return isSaved;
  }

  const value = {
    session,
    setSession,
    events,
    setEvents,
    savedEventIds,
    toggleSaved,
    preferences,
    setPreferences,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppContextProvider');
  }
  return context;
}
