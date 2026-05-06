'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { EARLY_ACCESS, FREE_DAILY_LIMIT } from '@/lib/config';

export type Plan = 'free' | 'pro' | 'investor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  plan: Plan;
}

interface AppContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => void;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (v: boolean) => void;
  usageCount: number;
  incrementUsage: () => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

const USERS_KEY = 'dealedge_users';
const SESSION_KEY = 'dealedge_session';
const USAGE_KEY = 'dealedge_usage';

function today() {
  return new Date().toISOString().split('T')[0];
}

function readUsage(): { count: number; date: string } {
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { count: 0, date: today() };
    const data = JSON.parse(raw);
    if (data.date !== today()) return { count: 0, date: today() };
    return data;
  } catch {
    return { count: 0, date: today() };
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const sessionId = localStorage.getItem(SESSION_KEY);
    if (sessionId) {
      const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
      const found = users.find((u) => u.id === sessionId);
      if (found) setUser(found);
    }
    const usage = readUsage();
    setUsageCount(usage.count);
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const creds: Record<string, string> = JSON.parse(localStorage.getItem('dealedge_creds') || '{}');
    const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!found || creds[found.id] !== password) {
      return { error: 'Invalid email or password' };
    }
    localStorage.setItem(SESSION_KEY, found.id);
    setUser(found);
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { error: 'An account with this email already exists' };
    }
    const newUser: UserProfile = {
      id: crypto.randomUUID(),
      email,
      name,
      company: '',
      phone: '',
      plan: 'free',
    };
    users.push(newUser);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    const creds: Record<string, string> = JSON.parse(localStorage.getItem('dealedge_creds') || '{}');
    creds[newUser.id] = password;
    localStorage.setItem('dealedge_creds', JSON.stringify(creds));
    localStorage.setItem(SESSION_KEY, newUser.id);
    setUser(newUser);
    return {};
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...updates };
    setUser(updated);
    const users: UserProfile[] = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex((u) => u.id === updated.id);
    if (idx !== -1) users[idx] = updated;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, [user]);

  // Returns true if analysis is allowed, false if blocked.
  // In early access mode tracking always happens but never blocks.
  const incrementUsage = useCallback((): boolean => {
    // Always record the usage count for future monetization decisions
    const usage = readUsage();
    const updated = { count: usage.count + 1, date: today() };
    localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
    setUsageCount(updated.count);

    // Early access: unlimited for everyone
    if (EARLY_ACCESS) return true;

    // Future paywall path (active when EARLY_ACCESS = false)
    const plan = user?.plan ?? 'free';
    if (plan !== 'free') return true;
    if (usage.count >= FREE_DAILY_LIMIT) {
      setShowUpgradeModal(true);
      return false;
    }
    return true;
  }, [user]);

  return (
    <AppContext.Provider value={{
      user, isLoading, login, signup, logout, updateProfile,
      showUpgradeModal, setShowUpgradeModal,
      usageCount, incrementUsage,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}
