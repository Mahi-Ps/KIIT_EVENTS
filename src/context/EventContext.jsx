import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const EventContext = createContext();

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const API_URL = `${BASE}/api/events`;
const REG_URL = `${BASE}/api/register`;

export function EventProvider({ children }) {
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);

  // Get current user email from localStorage
  const getUserEmail = () => {
    try {
      const stored = localStorage.getItem('user');
      if (stored) return JSON.parse(stored).email;
    } catch {}
    return null;
  };

  // Fetch all events from backend
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setEvents(data.events || []);
    } catch (err) {
      console.error('Failed to fetch events:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch registrations for current user
  const fetchRegistrations = useCallback(async () => {
    const email = getUserEmail();
    if (!email) return;
    try {
      const res = await fetch(`${REG_URL}/${encodeURIComponent(email)}`);
      const data = await res.json();
      setRegistrations(data.registrations || []);
    } catch (err) {
      console.error('Failed to fetch registrations:', err);
    }
  }, []);

  // Load events on mount
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // Society: create a new event via POST API
  const addEvent = async (eventData) => {
    const email = getUserEmail();
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...eventData, createdBy: email }),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => [...prev, data.event]);
        return { success: true, event: data.event };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to create event:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Faculty/Admin: approve an event via PUT API
  const approveEvent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/approve`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? data.event : e))
        );
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to approve event:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Faculty/Admin: reject an event via PUT API
  const rejectEvent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}/reject`, { method: 'PUT' });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? data.event : e))
        );
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to reject event:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Society: edit an event via PUT API
  const editEvent = async (id, eventData) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) =>
          prev.map((e) => (e.id === id ? data.event : e))
        );
        return { success: true, event: data.event };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to edit event:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Society: delete an event via DELETE API
  const deleteEvent = async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.id !== id));
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to delete event:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Student: register for an event via POST API
  const registerEvent = async (eventId) => {
    const email = getUserEmail();
    if (!email) return { success: false, error: 'Not logged in' };

    try {
      const res = await fetch(REG_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userEmail: email }),
      });
      const data = await res.json();
      if (res.ok) {
        // Refresh registrations from backend
        await fetchRegistrations();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Failed to register:', err);
      return { success: false, error: 'Network error' };
    }
  };

  // Student: check if already registered
  const isRegistered = (eventId) =>
    registrations.some((r) => r.eventId === eventId);

  // Derived lists
  const approvedEvents = events.filter((e) => e.status === 'approved');
  const pendingEvents = events.filter((e) => e.status === 'pending');

  return (
    <EventContext.Provider
      value={{
        events,
        approvedEvents,
        pendingEvents,
        registrations,
        loading,
        addEvent,
        editEvent,
        deleteEvent,
        approveEvent,
        rejectEvent,
        registerEvent,
        isRegistered,
        fetchEvents,
        fetchRegistrations,
      }}
    >
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const ctx = useContext(EventContext);
  if (!ctx) throw new Error('useEvents must be used inside EventProvider');
  return ctx;
}
