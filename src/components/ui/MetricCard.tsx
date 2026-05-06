import { cn } from '@/lib/utils';

interface MetricCardProps {
  label: string;
  value: string;
  subtext?: string;
  positive?: boolean;
  negative?: boolean;
  highlight?: boolean;
}

export default function MetricCard({
  label,
  value,
  subtext,
  positive,
  negative,
  highlight,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border p-4 transition-all',
        highlight
          ? 'bg-indigo-50 border-indigo-200'
          : 'bg-white border-zinc-200',
      )}
    >
      <p className="text-xs font-medium text-zinc-500 mb-1">{label}</p>
      <p
        className={cn(
          'text-xl font-bold tabular-nums leading-tight',
          positive && 'text-emerald-600',
          negative && 'text-red-500',
          !positive && !negative && 'text-zinc-900',
          highlight && 'text-indigo-700',
        )}
      >
        {value}
      </p>
      {subtext && <p className="text-xs text-zinc-400 mt-0.5">{subtext}</p>}
    </div>
  );
}
