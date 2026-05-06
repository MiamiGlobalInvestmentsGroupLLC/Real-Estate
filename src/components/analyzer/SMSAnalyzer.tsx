'use client';

import { useState } from 'react';
import { parseSMSText, ParsedSMSData } from '@/lib/smsParser';
import { formatCurrency } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface SMSAnalyzerProps {
  onParsed: (data: ParsedSMSData) => void;
}

const examples = [
  'House in Tampa, FL — ARV 250k, needs 40k rehab, asking 180k',
  'Off-market duplex in Orlando. ARV $320,000. Repairs around $55k. Seller wants $215,000. Rents for $2,400/mo',
  'Motivated seller in Phoenix, AZ. Listed at 145k, worth 210k after 35k fix',
];

export default function SMSAnalyzer({ onParsed }: SMSAnalyzerProps) {
  const [text, setText] = useState('');
  const [parsed, setParsed] = useState<ParsedSMSData | null>(null);
  const [loading, setLoading] = useState(false);

  const analyze = (input: string) => {
    if (!input.trim()) return;
    setLoading(true);
    setTimeout(() => {
      const result = parseSMSText(input);
      setParsed(result);
      if (result.confidence >= 60) {
        onParsed(result);
      }
      setLoading(false);
    }, 400);
  };

  const handleSubmit = () => analyze(text);

  const handleExample = (ex: string) => {
    setText(ex);
    analyze(ex);
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-zinc-900 mb-1">SMS Deal Engine</h3>
        <p className="text-sm text-zinc-500">
          Paste any deal description in plain English — we extract the numbers and run the analysis instantly.
        </p>
      </div>

      {/* Input */}
      <div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          placeholder={`Try: "House in Tampa, ARV 250k, needs 40k rehab, asking 180k"`}
          className="w-full px-4 py-3 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
        />
        <div className="flex items-center justify-between mt-2.5">
          <div className="flex flex-wrap gap-1.5">
            {examples.map((ex, i) => (
              <button
                key={i}
                onClick={() => handleExample(ex)}
                className="text-xs text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-2.5 py-1 rounded-lg transition-colors font-medium"
              >
                Example {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!text.trim() || loading}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
              text.trim() && !loading
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'
                : 'bg-zinc-100 text-zinc-400 cursor-not-allowed',
            )}
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Parsing...
              </>
            ) : (
              <>
                Analyze
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Parsed result */}
      {parsed && (
        <div className={cn(
          'rounded-2xl border p-5 animate-fadeIn',
          parsed.confidence >= 90 ? 'bg-emerald-50 border-emerald-200' :
          parsed.confidence >= 60 ? 'bg-amber-50 border-amber-200' :
          'bg-red-50 border-red-200',
        )}>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-bold text-zinc-800">Extracted Data</p>
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-2 h-2 rounded-full',
                parsed.confidence >= 90 ? 'bg-emerald-500' :
                parsed.confidence >= 60 ? 'bg-amber-500' : 'bg-red-500',
              )} />
              <span className="text-xs font-semibold text-zinc-600">{parsed.confidence}% confidence</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Purchase Price', value: parsed.purchasePrice },
              { label: 'ARV', value: parsed.arv },
              { label: 'Repair Costs', value: parsed.repairCosts },
              { label: 'Holding Costs', value: parsed.holdingCosts },
              { label: 'Closing Costs', value: parsed.closingCosts },
              { label: 'Monthly Rent', value: parsed.monthlyRent },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/60 rounded-xl p-3">
                <p className="text-[10px] font-semibold text-zinc-400 uppercase">{label}</p>
                <p className={cn('text-sm font-bold mt-0.5', value ? 'text-zinc-900' : 'text-zinc-300')}>
                  {value ? formatCurrency(value) : '—'}
                </p>
              </div>
            ))}
          </div>

          {parsed.location && (
            <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
              {parsed.location}
            </p>
          )}

          {/* Errors (critical) */}
          {parsed.errors && parsed.errors.length > 0 && (
            <div className="mt-3 space-y-1.5">
              {parsed.errors.map((err, i) => (
                <div key={i} className="flex items-start gap-2 bg-red-100 border border-red-300 rounded-lg px-3 py-2">
                  <span className="text-red-600 text-xs font-bold mt-0.5 shrink-0">✕</span>
                  <p className="text-xs text-red-700 font-medium">{err}</p>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {parsed.warnings && parsed.warnings.length > 0 && (
            <div className="mt-2 space-y-1.5">
              {parsed.warnings.map((w, i) => (
                <div key={i} className="flex items-start gap-2 bg-amber-100 border border-amber-300 rounded-lg px-3 py-2">
                  <span className="text-amber-600 text-xs font-bold mt-0.5 shrink-0">⚠</span>
                  <p className="text-xs text-amber-800">{w}</p>
                </div>
              ))}
            </div>
          )}

          {parsed.confidence < 90 && parsed.confidence >= 60 && (
            <p className="text-xs text-amber-600 mt-3 font-medium">
              ⚠ Confidence below 90% — verify extracted values before relying on results.
            </p>
          )}

          {parsed.confidence >= 60 && (
            <p className="text-xs text-zinc-500 mt-2">
              ✓ Analysis updated in the Deal Analyzer above
            </p>
          )}

          {parsed.confidence < 60 && (
            <p className="text-xs text-red-500 mt-3">
              Could not extract enough data. Try including ARV, repair costs, and asking price.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
