'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  company: string;
  phone: string;
  plan: string;
  subscription_status: string | null;
  subscription_current_period_end: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  subscription_validated: boolean;
  created_at: string;
}

const PLAN_LABELS: Record<string, string> = { free: 'Free', pro: 'Pro', investor: 'Investor' };
const PLAN_COLORS: Record<string, string> = {
  free: 'bg-zinc-100 text-zinc-600',
  pro: 'bg-indigo-100 text-indigo-700',
  investor: 'bg-amber-100 text-amber-700',
};
const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  canceled: 'bg-red-100 text-red-700',
  past_due: 'bg-orange-100 text-orange-700',
  inactive: 'bg-zinc-100 text-zinc-500',
};

function fmt(dateStr: string | null) {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [planFilter, setPlanFilter] = useState<string>('all');

  const loadUsers = useCallback(async () => {
    const res = await fetch('/api/admin/users');
    if (res.status === 401) { router.push('/admin/login'); return; }
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, [router]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const updateUser = async (id: string, updates: Record<string, unknown>) => {
    setUpdating(id);
    await fetch(`/api/admin/users/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
    await loadUsers();
    setUpdating(null);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  };

  const filtered = users.filter((u) => {
    const matchSearch =
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      (u.company || '').toLowerCase().includes(search.toLowerCase());
    const matchPlan = planFilter === 'all' || u.plan === planFilter;
    return matchSearch && matchPlan;
  });

  const stats = {
    total: users.length,
    free: users.filter((u) => u.plan === 'free').length,
    pro: users.filter((u) => u.plan === 'pro').length,
    investor: users.filter((u) => u.plan === 'investor').length,
    active: users.filter((u) => u.subscription_status === 'active').length,
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="bg-zinc-900 border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          </div>
          <div>
            <h1 className="font-extrabold text-white text-lg leading-none">DealEdge Admin</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Management Dashboard</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
          Sign Out
        </button>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            { label: 'Total Users', value: stats.total, color: 'text-white' },
            { label: 'Free', value: stats.free, color: 'text-zinc-400' },
            { label: 'Pro', value: stats.pro, color: 'text-indigo-400' },
            { label: 'Investor', value: stats.investor, color: 'text-amber-400' },
            { label: 'Active Subs', value: stats.active, color: 'text-green-400' },
          ].map((s) => (
            <div key={s.label} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
              <p className="text-xs text-zinc-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, or company..."
            className="flex-1 px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <select
            value={planFilter}
            onChange={(e) => setPlanFilter(e.target.value)}
            className="px-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="all">All Plans</option>
            <option value="free">Free</option>
            <option value="pro">Pro</option>
            <option value="investor">Investor</option>
          </select>
          <button
            onClick={loadUsers}
            className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl text-sm text-zinc-300 transition-colors"
          >
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="text-center py-16 text-zinc-500">Loading users...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-zinc-500">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800">
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Plan</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Subscription</th>
                    <th className="text-left px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Joined</th>
                    <th className="text-right px-5 py-3.5 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800">
                  {filtered.map((u) => (
                    <tr key={u.id} className="hover:bg-zinc-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <p className="font-semibold text-white">{u.name || '(no name)'}</p>
                        <p className="text-zinc-400 text-xs mt-0.5">{u.email}</p>
                        {u.company && <p className="text-zinc-500 text-xs">{u.company}</p>}
                        {u.phone && <p className="text-zinc-500 text-xs">{u.phone}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${PLAN_COLORS[u.plan] || 'bg-zinc-100 text-zinc-600'}`}>
                          {PLAN_LABELS[u.plan] || u.plan}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${STATUS_COLORS[u.subscription_status || 'inactive']}`}>
                          {u.subscription_status || 'inactive'}
                        </span>
                        {u.subscription_current_period_end && (
                          <p className="text-zinc-500 text-xs mt-1">Renews {fmt(u.subscription_current_period_end)}</p>
                        )}
                        {u.subscription_validated && (
                          <p className="text-green-500 text-xs mt-0.5">Validated</p>
                        )}
                      </td>
                      <td className="px-5 py-4 text-zinc-400 text-xs">
                        {fmt(u.created_at)}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2 flex-wrap">
                          {/* Plan management */}
                          <select
                            value={u.plan}
                            disabled={updating === u.id}
                            onChange={(e) => updateUser(u.id, { plan: e.target.value })}
                            className="px-2.5 py-1.5 bg-zinc-800 border border-zinc-700 rounded-lg text-xs text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                          >
                            <option value="free">Free</option>
                            <option value="pro">Pro</option>
                            <option value="investor">Investor</option>
                          </select>

                          {/* Activate / Deactivate */}
                          {u.subscription_status === 'active' ? (
                            <button
                              disabled={updating === u.id}
                              onClick={() => updateUser(u.id, { subscription_status: 'canceled' })}
                              className="px-3 py-1.5 bg-red-900/60 hover:bg-red-900 border border-red-700 text-red-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              Deactivate
                            </button>
                          ) : (
                            <button
                              disabled={updating === u.id}
                              onClick={() => updateUser(u.id, { subscription_status: 'active', subscription_validated: true })}
                              className="px-3 py-1.5 bg-green-900/60 hover:bg-green-900 border border-green-700 text-green-300 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50"
                            >
                              Activate
                            </button>
                          )}

                          {updating === u.id && (
                            <span className="text-xs text-zinc-500">Saving...</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <p className="text-center text-xs text-zinc-600">
          {filtered.length} of {users.length} users shown
        </p>
      </div>
    </div>
  );
}
