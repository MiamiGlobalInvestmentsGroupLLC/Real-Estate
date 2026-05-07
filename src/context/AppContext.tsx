'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { EARLY_ACCESS, FREE_DAILY_LIMIT } from '@/lib/config';
import { createClient } from '@/lib/supabase/client';

export type Plan = 'free' | 'pro' | 'investor';

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  plan: Plan;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  subscriptionStatus?: 'active' | 'canceled' | 'past_due';
  subscriptionCurrentPeriodEnd?: string;
  subscriptionValidated?: boolean;
}

interface AppContextValue {
  user: UserProfile | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  showUpgradeModal: boolean;
  setShowUpgradeModal: (v: boolean) => void;
  usageCount: number;
  incrementUsage: () => boolean;
}

const AppContext = createContext<AppContextValue | null>(null);

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

function rowToProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: row.email as string,
    name: (row.name as string) || '',
    company: (row.company as string) || '',
    phone: (row.phone as string) || '',
    plan: (row.plan as Plan) || 'free',
    stripeCustomerId: (row.stripe_customer_id as string) || undefined,
    stripeSubscriptionId: (row.stripe_subscription_id as string) || undefined,
    subscriptionStatus: (row.subscription_status as UserProfile['subscriptionStatus']) || undefined,
    subscriptionCurrentPeriodEnd: (row.subscription_current_period_end as string) || undefined,
    subscriptionValidated: (row.subscription_validated as boolean) || false,
  };
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [usageCount, setUsageCount] = useState(0);

  useEffect(() => {
    const supabase = createClient();

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      if (data) setUser(rowToProfile(data as Record<string, unknown>));
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id).finally(() => setIsLoading(false));
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
      }
    });

    const usage = readUsage();
    setUsageCount(usage.count);

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: 'Invalid email or password' };
    return {};
  }, []);

  const signup = useCallback(async (email: string, password: string, name: string) => {
    const supabase = createClient();
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'An account with this email already exists' };
      }
      return { error: error.message };
    }
    if (data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        email,
        name,
        plan: 'free',
      });
    }
    return {};
  }, []);

  const logout = useCallback(async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (updates: Partial<UserProfile>) => {
    if (!user) return;
    const optimistic = { ...user, ...updates };
    setUser(optimistic);

    const supabase = createClient();
    const dbUpdates: Record<string, unknown> = {};
    if (updates.name !== undefined) dbUpdates.name = updates.name;
    if (updates.company !== undefined) dbUpdates.company = updates.company;
    if (updates.phone !== undefined) dbUpdates.phone = updates.phone;
    if (updates.plan !== undefined) dbUpdates.plan = updates.plan;
    if (updates.stripeCustomerId !== undefined) dbUpdates.stripe_customer_id = updates.stripeCustomerId;
    if (updates.stripeSubscriptionId !== undefined) dbUpdates.stripe_subscription_id = updates.stripeSubscriptionId;
    if (updates.subscriptionStatus !== undefined) dbUpdates.subscription_status = updates.subscriptionStatus;
    if (updates.subscriptionCurrentPeriodEnd !== undefined) dbUpdates.subscription_current_period_end = updates.subscriptionCurrentPeriodEnd;
    if (updates.subscriptionValidated !== undefined) dbUpdates.subscription_validated = updates.subscriptionValidated;

    if (Object.keys(dbUpdates).length > 0) {
      await supabase.from('profiles').update(dbUpdates).eq('id', user.id);
    }
  }, [user]);

  const incrementUsage = useCallback((): boolean => {
    const usage = readUsage();
    const updated = { count: usage.count + 1, date: today() };
    localStorage.setItem(USAGE_KEY, JSON.stringify(updated));
    setUsageCount(updated.count);

    if (EARLY_ACCESS) return true;

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
