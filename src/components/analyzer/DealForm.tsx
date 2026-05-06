'use client';

import { useState, useCallback } from 'react';
import { DealInputs } from '@/lib/calculations';
import { cn } from '@/lib/utils';
import CostEstimator from './CostEstimator';

interface DealFormProps {
  onCalculate: (inputs: DealInputs) => void;
  initialValues?: Partial<DealInputs>;
}

type FieldKey = keyof Omit<DealInputs, 'sellingCostRate'>;
type FieldMeta = { key: FieldKey; label: string; placeholder: string; required: boolean; hint?: string; unit?: 'currency' | 'months' };

const fields: FieldMeta[] = [
  { key: 'purchasePrice', label: 'Purchase Price', placeholder: '180,000', required: true, hint: 'Seller asking price', unit: 'currency' },
  { key: 'arv', label: 'After Repair Value (ARV)', placeholder: '250,000', required: true, hint: 'Value after repairs', unit: 'currency' },
  { key: 'repairCosts', label: 'Repair / Rehab Costs', placeholder: '40,000', required: true, hint: 'Total estimated repairs', unit: 'currency' },
  { key: 'holdingCosts', label: 'Holding Costs', placeholder: '5,000', required: false, hint: 'Taxes, insurance, utilities', unit: 'currency' },
  { key: 'holdingMonths', label: 'Holding Period', placeholder: '4', required: false, hint: 'Months — defaults to 4', unit: 'months' },
  { key: 'closingCosts', label: 'Closing Costs', placeholder: '5,000', required: false, hint: 'Buy & sell closing fees', unit: 'currency' },
  { key: 'monthlyRent', label: 'Monthly Rent', placeholder: '2,000', required: false, hint: 'Optional — rental analysis', unit: 'currency' },
];

function parseInput(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

type FormValues = Record<FieldKey, string>;

function buildInputs(values: FormValues): DealInputs {
  return {
    purchasePrice: parseInput(values.purchasePrice),
    arv: parseInput(values.arv),
    repairCosts: parseInput(values.repairCosts),
    holdingCosts: parseInput(values.holdingCosts),
    holdingMonths: values.holdingMonths ? parseInput(values.holdingMonths) : undefined,
    closingCosts: parseInput(values.closingCosts),
    monthlyRent: values.monthlyRent ? parseInput(values.monthlyRent) : undefined,
  };
}

export default function DealForm({ onCalculate, initialValues }: DealFormProps) {
  const [values, setValues] = useState<FormValues>({
    purchasePrice: initialValues?.purchasePrice?.toString() ?? '',
    arv: initialValues?.arv?.toString() ?? '',
    repairCosts: initialValues?.repairCosts?.toString() ?? '',
    holdingCosts: initialValues?.holdingCosts?.toString() ?? '',
    holdingMonths: initialValues?.holdingMonths?.toString() ?? '',
    closingCosts: initialValues?.closingCosts?.toString() ?? '',
    monthlyRent: initialValues?.monthlyRent?.toString() ?? '',
  });
  const [showEstimator, setShowEstimator] = useState(false);

  const handleChange = useCallback((field: FieldKey, raw: string) => {
    const newValues = { ...values, [field]: raw };
    setValues(newValues);
    const inputs = buildInputs(newValues);
    if (inputs.purchasePrice > 0 && inputs.arv > 0) {
      onCalculate(inputs);
    }
  }, [values, onCalculate]);

  const handleEstimatorApply = useCallback((partial: Partial<DealInputs>) => {
    const newValues: FormValues = {
      ...values,
      ...(partial.repairCosts !== undefined && { repairCosts: partial.repairCosts.toString() }),
      ...(partial.holdingCosts !== undefined && { holdingCosts: partial.holdingCosts.toString() }),
      ...(partial.closingCosts !== undefined && { closingCosts: partial.closingCosts.toString() }),
    };
    setValues(newValues);
    const inputs = buildInputs(newValues);
    if (inputs.purchasePrice > 0 && inputs.arv > 0) {
      onCalculate(inputs);
    }
  }, [values, onCalculate]);

  const hasValues = Object.values(values).some((v) => v !== '');

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Deal Details</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Results update instantly as you type</p>
        </div>
        {hasValues && (
          <button onClick={() => setValues({ purchasePrice: '', arv: '', repairCosts: '', holdingCosts: '', holdingMonths: '', closingCosts: '', monthlyRent: '' })}
            className="text-xs text-zinc-400 hover:text-zinc-600 font-medium transition-colors">
            Clear
          </button>
        )}
      </div>

      <div className="space-y-3.5">
        {fields.map((field) => (
          <div key={field.key}>
            <div className="flex items-baseline justify-between mb-1.5">
              <label className="text-sm font-medium text-zinc-700">
                {field.label}
                {field.required && <span className="text-indigo-500 ml-1">*</span>}
              </label>
              {field.hint && <span className="text-xs text-zinc-400">{field.hint}</span>}
            </div>
            <div className="relative">
              {field.unit !== 'months' && (
                <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-400 font-semibold text-sm pointer-events-none">$</span>
              )}
              <input
                type="text"
                inputMode="numeric"
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={cn(
                  'w-full py-3 bg-white border rounded-xl text-sm font-semibold text-zinc-900 placeholder-zinc-300',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-150',
                  field.unit !== 'months' ? 'pl-8' : 'pl-4',
                  field.unit === 'months' ? 'pr-10' : 'pr-4',
                  values[field.key] ? 'border-zinc-300' : 'border-zinc-200',
                )}
              />
              {field.unit === 'months' && (
                <span className="absolute inset-y-0 right-3.5 flex items-center text-zinc-400 text-xs font-medium pointer-events-none">mo</span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Cost Estimator CTA */}
      <button
        onClick={() => setShowEstimator(true)}
        className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 border border-dashed border-indigo-300 text-indigo-600 hover:bg-indigo-50 rounded-xl text-xs font-semibold transition-all"
      >
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
        </svg>
        Help me estimate costs
      </button>

      {/* Quick example */}
      <div className="mt-4 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
        <p className="text-xs font-semibold text-zinc-500 mb-2">Try a quick example</p>
        <button
          onClick={() => {
            const ex: FormValues = { purchasePrice: '180000', arv: '250000', repairCosts: '40000', holdingCosts: '5000', holdingMonths: '4', closingCosts: '6000', monthlyRent: '2000' };
            setValues(ex);
            onCalculate(buildInputs(ex));
          }}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Tampa flip — ARV $250k, asking $180k, $40k rehab →
        </button>
      </div>

      {showEstimator && (
        <CostEstimator
          purchasePrice={parseInput(values.purchasePrice)}
          onApply={handleEstimatorApply}
          onClose={() => setShowEstimator(false)}
        />
      )}
    </div>
  );
}
