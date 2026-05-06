import { cn } from '@/lib/utils';

interface RiskBadgeProps {
  level: 'Low' | 'Medium' | 'High';
  size?: 'sm' | 'md';
}

const config = {
  Low: {
    dot: 'bg-emerald-500',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Low Risk',
  },
  Medium: {
    dot: 'bg-amber-500',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Medium Risk',
  },
  High: {
    dot: 'bg-red-500',
    badge: 'bg-red-50 text-red-700 border-red-200',
    label: 'High Risk',
  },
};

export default function RiskBadge({ level, size = 'md' }: RiskBadgeProps) {
  const { dot, badge, label } = config[level];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold border rounded-full',
        badge,
        size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1',
      )}
    >
      <span className={cn('rounded-full', dot, size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2')} />
      {label}
    </span>
  );
}
