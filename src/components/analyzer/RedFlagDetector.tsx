import { RedFlag } from '@/lib/redFlags';
import { cn } from '@/lib/utils';

interface RedFlagDetectorProps {
  flags: RedFlag[];
}

export default function RedFlagDetector({ flags }: RedFlagDetectorProps) {
  if (flags.length === 0) {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 flex items-center gap-3">
        <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-emerald-800">No red flags detected</p>
          <p className="text-xs text-emerald-600 mt-0.5">Deal metrics look clean</p>
        </div>
      </div>
    );
  }

  const criticals = flags.filter((f) => f.severity === 'critical');
  const warnings = flags.filter((f) => f.severity === 'warning');

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <svg className="w-4 h-4 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
        </svg>
        <p className="text-sm font-bold text-zinc-700">
          Risk Alerts ({flags.length})
        </p>
      </div>

      {criticals.map((flag) => (
        <FlagCard key={flag.id} flag={flag} />
      ))}
      {warnings.map((flag) => (
        <FlagCard key={flag.id} flag={flag} />
      ))}
    </div>
  );
}

function FlagCard({ flag }: { flag: RedFlag }) {
  const isCritical = flag.severity === 'critical';

  return (
    <div
      className={cn(
        'rounded-xl border p-3.5 flex items-start gap-3',
        isCritical
          ? 'bg-red-50 border-red-200'
          : 'bg-amber-50 border-amber-200',
      )}
    >
      <div
        className={cn(
          'w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5',
          isCritical ? 'bg-red-100' : 'bg-amber-100',
        )}
      >
        {isCritical ? (
          <svg className="w-3.5 h-3.5 text-red-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg className="w-3.5 h-3.5 text-amber-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        )}
      </div>
      <div>
        <p
          className={cn(
            'text-xs font-bold mb-0.5',
            isCritical ? 'text-red-700' : 'text-amber-700',
          )}
        >
          {flag.title}
        </p>
        <p className={cn('text-xs leading-relaxed', isCritical ? 'text-red-600' : 'text-amber-600')}>
          {flag.description}
        </p>
      </div>
    </div>
  );
}
