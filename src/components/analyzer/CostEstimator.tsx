'use client';

import { useState } from 'react';
import { DealInputs } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface CostEstimatorProps {
  purchasePrice: number;
  onApply: (values: Partial<DealInputs>) => void;
  onClose: () => void;
}

type Condition = 'light' | 'medium' | 'heavy';
type PropertyType = 'single' | 'duplex' | 'condo';

const conditionConfig: Record<Condition, { label: string; range: string; low: number; high: number; color: string }> = {
  light: { label: 'Light', range: '$15–25/sqft', low: 15, high: 25, color: 'border-emerald-300 bg-emerald-50 text-emerald-700' },
  medium: { label: 'Medium', range: '$25–40/sqft', low: 25, high: 40, color: 'border-amber-300 bg-amber-50 text-amber-700' },
  heavy: { label: 'Heavy', range: '$40–70/sqft', low: 40, high: 70, color: 'border-red-300 bg-red-50 text-red-700' },
};

const conditionDescriptions: Record<Condition, string> = {
  light: 'Cosmetic only — paint, flooring, fixtures',
  medium: 'Kitchen/bath updates, some systems',
  heavy: 'Full gut renovation or major structural',
};

const typeMultiplier: Record<PropertyType, number> = {
  single: 1.0,
  duplex: 1.05,
  condo: 0.9,
};

export default function CostEstimator({ purchasePrice, onApply, onClose }: CostEstimatorProps) {
  const [step, setStep] = useState(1);
  const [condition, setCondition] = useState<Condition | null>(null);
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [sqft, setSqft] = useState('');
  const [months, setMonths] = useState('6');

  const totalSteps = 4;
  const sqftNum = parseInt(sqft) || 0;
  const monthsNum = parseInt(months) || 6;

  function calcEstimates() {
    if (!condition || !propertyType || !sqftNum) return null;
    const cfg = conditionConfig[condition];
    const mult = typeMultiplier[propertyType];
    const midRate = ((cfg.low + cfg.high) / 2) * mult;
    const rehab = Math.round((sqftNum * midRate) / 500) * 500;
    const holding = Math.round((purchasePrice * 0.015 * monthsNum) / 500) * 500;
    const closing = Math.round((purchasePrice * 0.09) / 500) * 500;
    return { rehab, holding, closing };
  }

  const estimates = step === 4 ? calcEstimates() : null;

  const canAdvance = () => {
    if (step === 1) return condition !== null;
    if (step === 2) return propertyType !== null;
    if (step === 3) return sqftNum > 0;
    return true;
  };

  const handleApply = () => {
    if (!estimates) return;
    onApply({
      repairCosts: estimates.rehab,
      holdingCosts: estimates.holding,
      closingCosts: estimates.closing,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 animate-fadeIn">

        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-extrabold text-zinc-900">Cost Estimator</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition-colors">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-sm text-zinc-500 mb-5">Answer 4 quick questions to auto-fill your costs</p>

        {/* Progress */}
        <div className="flex gap-1.5 mb-6">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all duration-300',
                s <= step ? 'bg-indigo-500' : 'bg-zinc-200',
              )}
            />
          ))}
        </div>

        {/* Step 1: Condition */}
        {step === 1 && (
          <div>
            <p className="text-sm font-bold text-zinc-700 mb-4">What's the property condition?</p>
            <div className="space-y-2.5">
              {(Object.keys(conditionConfig) as Condition[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCondition(c)}
                  className={cn(
                    'w-full text-left p-4 rounded-xl border-2 transition-all',
                    condition === c
                      ? conditionConfig[c].color + ' border-2'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white',
                  )}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-zinc-900">{conditionConfig[c].label}</span>
                    <span className={cn(
                      'text-xs font-semibold px-2 py-0.5 rounded-full',
                      condition === c ? conditionConfig[c].color : 'bg-zinc-100 text-zinc-500',
                    )}>
                      {conditionConfig[c].range}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-500 mt-0.5">{conditionDescriptions[c]}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Property Type */}
        {step === 2 && (
          <div>
            <p className="text-sm font-bold text-zinc-700 mb-4">What type of property?</p>
            <div className="grid grid-cols-3 gap-2.5">
              {([
                { key: 'single', label: 'Single Family', icon: '🏠' },
                { key: 'duplex', label: 'Duplex / Multi', icon: '🏘️' },
                { key: 'condo', label: 'Condo / Townhouse', icon: '🏢' },
              ] as const).map(({ key, label, icon }) => (
                <button
                  key={key}
                  onClick={() => setPropertyType(key)}
                  className={cn(
                    'p-3 rounded-xl border-2 text-center transition-all',
                    propertyType === key
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-zinc-200 hover:border-zinc-300 bg-white',
                  )}
                >
                  <div className="text-2xl mb-1">{icon}</div>
                  <p className="text-xs font-semibold text-zinc-700 leading-tight">{label}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Sqft + Duration */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                Approximate square footage
              </label>
              <input
                type="text"
                inputMode="numeric"
                value={sqft}
                onChange={(e) => setSqft(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 1,400"
                className="w-full px-4 py-3 border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-900 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-zinc-700 mb-1.5">
                Estimated project duration
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['3', '6', '9', '12'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMonths(m)}
                    className={cn(
                      'py-2.5 rounded-xl border-2 text-xs font-bold transition-all',
                      months === m
                        ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                        : 'border-zinc-200 text-zinc-600 hover:border-zinc-300',
                    )}
                  >
                    {m} mo
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Summary */}
        {step === 4 && estimates && (
          <div>
            <p className="text-sm font-bold text-zinc-700 mb-4">Here are your estimated costs</p>
            <div className="space-y-3 mb-5">
              {[
                { label: 'Repair / Rehab', value: estimates.rehab, note: `Based on ${condition} condition, ${sqft} sqft` },
                { label: 'Holding Costs', value: estimates.holding, note: `${months} months at ~1.5%/mo` },
                { label: 'Closing Costs', value: estimates.closing, note: '~9% of purchase price' },
              ].map(({ label, value, note }) => (
                <div key={label} className="bg-zinc-50 rounded-xl p-3.5 border border-zinc-200">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-zinc-500">{label}</span>
                    <span className="text-base font-extrabold text-zinc-900 tabular-nums">
                      ${value.toLocaleString()}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 mt-0.5">{note}</p>
                </div>
              ))}
            </div>
            <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-3 mb-4">
              <p className="text-xs text-indigo-700 font-medium text-center">
                Estimated values — adjust anytime in the form
              </p>
            </div>
            <button
              onClick={handleApply}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
            >
              Apply These Estimates →
            </button>
          </div>
        )}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 py-2.5 border border-zinc-200 text-zinc-600 font-semibold rounded-xl text-sm hover:bg-zinc-50 transition-colors"
              >
                Back
              </button>
            )}
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className={cn(
                'flex-1 py-2.5 font-bold rounded-xl text-sm transition-all',
                canAdvance()
                  ? 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  : 'bg-zinc-100 text-zinc-400 cursor-not-allowed',
              )}
            >
              {step === 3 ? 'Calculate →' : 'Next →'}
            </button>
          </div>
        )}

        <p className="text-center text-xs text-zinc-400 mt-3">Step {step} of {totalSteps}</p>
      </div>
    </div>
  );
}
