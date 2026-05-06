const USAGE_KEY = 'dealedge_usage';
export const FREE_DAILY_LIMIT = 5;

interface UsageData {
  count: number;
  date: string;
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function read(): UsageData {
  if (typeof window === 'undefined') return { count: 0, date: today() };
  try {
    const raw = localStorage.getItem(USAGE_KEY);
    if (!raw) return { count: 0, date: today() };
    const data: UsageData = JSON.parse(raw);
    if (data.date !== today()) return { count: 0, date: today() };
    return data;
  } catch {
    return { count: 0, date: today() };
  }
}

function write(data: UsageData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USAGE_KEY, JSON.stringify(data));
}

export function getUsageCount(): number {
  return read().count;
}

export function incrementUsage(): number {
  const data = read();
  const updated = { count: data.count + 1, date: today() };
  write(updated);
  return updated.count;
}

export function getRemainingAnalyses(plan: string): number {
  if (plan !== 'free') return Infinity;
  return Math.max(0, FREE_DAILY_LIMIT - read().count);
}

export function canAnalyze(plan: string): boolean {
  if (plan !== 'free') return true;
  return read().count < FREE_DAILY_LIMIT;
}
