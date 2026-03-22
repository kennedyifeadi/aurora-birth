'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface ProfileData {
  pregnancyStartDate?: string;
  gestationalAgeDays?: number;
  medications?: string[];
  allergies?: string[];
  gravidity?: number;
  parity?: number;
  phoneNumber?: string;
  doctor?: { name?: string; phone?: string; email?: string };
  emergencyContact?: { name?: string; phone?: string; email?: string };
}

interface Appointment {
  _id: string;
  date: string;
  note: string;
}

interface UserContextType {
  user: User | null;
  profile: ProfileData | null;
  appointments: Appointment[];
  isProfileComplete: boolean;
  isLoading: boolean;
  updateProfile: (payload: ProfileData) => Promise<boolean>;
  addAppointment: (date: string, note: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Computed state
  const isProfileComplete = !!(
    profile?.phoneNumber &&
    profile?.doctor?.name &&
    profile?.emergencyContact?.name
  );

  const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    };

    const res = await fetch(url, { ...options, headers });
    if (res.status === 401) {
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
      throw new Error('Unauthorized');
    }
    return res;
  };

  const loadData = async () => {
    try {
      setIsLoading(true);
      
      const [profileRes, appointmentsRes] = await Promise.all([
        fetchWithAuth('/api/profile'),
        fetchWithAuth('/api/appointments')
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile(profileData.profile);
        setUser(profileData.user);
      }

      if (appointmentsRes.ok) {
        setAppointments(await appointmentsRes.json());
      }
    } catch (error) {
      console.error('Failed to load user context:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateProfile = async (payload: ProfileData) => {
    try {
      const res = await fetchWithAuth('/api/profile', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        return true;
      }
    } catch (error) {
      console.error('Update Profile failed:', error);
    }
    return false;
  };

  const addAppointment = async (date: string, note: string) => {
    try {
      const res = await fetchWithAuth('/api/appointments', {
        method: 'POST',
        body: JSON.stringify({ date, note }),
      });

      if (res.ok) {
        const created = await res.json();
        setAppointments(prev => [...prev, created].sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
        return true;
      }
    } catch (error) {
      console.error('Add Appointment failed:', error);
    }
    return false;
  };

  return (
    <UserContext.Provider value={{ 
      user, 
      profile, 
      appointments, 
      isProfileComplete, 
      isLoading,
      updateProfile,
      addAppointment,
      refreshData: loadData
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
