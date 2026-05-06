import { RedFlag } from '@/lib/redFlags';
import { cn } from '@/lib/utils';

export default function RedFlagDetector({ flags }: { flags: RedFlag[] }) {
  if (flags.length === 0) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 flex items-center gap-2.5">
        <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-sm font-semibold text-emerald-700">No red flags detected</p>
      </div>
    );
  }

  const criticals = flags.filter((f) => f.severity === 'critical');
  const warnings = flags.filter((f) => f.severity === 'warning');

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white overflow-hidden shadow-sm">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-100 bg-zinc-50">
        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-xs font-bold text-zinc-600 uppercase tracking-wider">Risk Alerts</p>
        {criticals.length > 0 && (
          <span className="ml-auto text-[10px] font-bold bg-red-500 text-white px-2 py-0.5 rounded-full">
            {criticals.length} Critical
          </span>
        )}
        {warnings.length > 0 && (
          <span className={cn(
            'text-[10px] font-bold bg-amber-500 text-white px-2 py-0.5 rounded-full',
            criticals.length > 0 ? 'ml-1' : 'ml-auto',
          )}>
            {warnings.length} Warning
          </span>
        )}
      </div>

      <ul className="divide-y divide-zinc-100">
        {[...criticals, ...warnings].map((flag) => (
          <li key={flag.id} className="flex items-start gap-3 px-4 py-3">
            <span className={cn(
              'w-1.5 h-1.5 rounded-full mt-1.5 shrink-0',
              flag.severity === 'critical' ? 'bg-red-500' : 'bg-amber-500',
            )} />
            <div className="min-w-0">
              <p className={cn(
                'text-xs font-bold',
                flag.severity === 'critical' ? 'text-red-700' : 'text-amber-700',
              )}>
                {flag.title}
              </p>
              <p className="text-xs text-zinc-500 mt-0.5 leading-relaxed">{flag.description}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
