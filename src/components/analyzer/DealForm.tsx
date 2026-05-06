'use client';

import { useState, useCallback } from 'react';
import { DealInputs } from '@/lib/calculations';
import { cn } from '@/lib/utils';

interface DealFormProps {
  onCalculate: (inputs: DealInputs) => void;
  initialValues?: Partial<DealInputs>;
}

type FieldKey = keyof DealInputs;

const fields: { key: FieldKey; label: string; placeholder: string; required: boolean; hint?: string }[] = [
  { key: 'purchasePrice', label: 'Purchase Price', placeholder: '180,000', required: true, hint: 'Seller asking price' },
  { key: 'arv', label: 'After Repair Value (ARV)', placeholder: '250,000', required: true, hint: 'Estimated value after repairs' },
  { key: 'repairCosts', label: 'Repair / Rehab Costs', placeholder: '40,000', required: true, hint: 'Total estimated repairs' },
  { key: 'holdingCosts', label: 'Holding Costs', placeholder: '5,000', required: false, hint: 'Taxes, insurance, utilities' },
  { key: 'closingCosts', label: 'Closing Costs', placeholder: '5,000', required: false, hint: 'Buy & sell closing fees' },
  { key: 'monthlyRent', label: 'Monthly Rent', placeholder: '2,000', required: false, hint: 'Optional — for rental analysis' },
];

function parseInput(value: string): number {
  return parseFloat(value.replace(/[^0-9.]/g, '')) || 0;
}

export default function DealForm({ onCalculate, initialValues }: DealFormProps) {
  const [values, setValues] = useState<Record<FieldKey, string>>({
    purchasePrice: initialValues?.purchasePrice?.toString() ?? '',
    arv: initialValues?.arv?.toString() ?? '',
    repairCosts: initialValues?.repairCosts?.toString() ?? '',
    holdingCosts: initialValues?.holdingCosts?.toString() ?? '',
    closingCosts: initialValues?.closingCosts?.toString() ?? '',
    monthlyRent: initialValues?.monthlyRent?.toString() ?? '',
  });

  const handleChange = useCallback(
    (field: FieldKey, raw: string) => {
      const newValues = { ...values, [field]: raw };
      setValues(newValues);

      const inputs: DealInputs = {
        purchasePrice: parseInput(newValues.purchasePrice),
        arv: parseInput(newValues.arv),
        repairCosts: parseInput(newValues.repairCosts),
        holdingCosts: parseInput(newValues.holdingCosts),
        closingCosts: parseInput(newValues.closingCosts),
        monthlyRent: newValues.monthlyRent ? parseInput(newValues.monthlyRent) : undefined,
      };

      if (inputs.purchasePrice > 0 && inputs.arv > 0) {
        onCalculate(inputs);
      }
    },
    [values, onCalculate],
  );

  const handleClear = () => {
    const cleared: Record<FieldKey, string> = {
      purchasePrice: '',
      arv: '',
      repairCosts: '',
      holdingCosts: '',
      closingCosts: '',
      monthlyRent: '',
    };
    setValues(cleared);
  };

  const hasValues = Object.values(values).some((v) => v !== '');

  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-bold text-zinc-900">Deal Details</h2>
          <p className="text-sm text-zinc-500 mt-0.5">Results update instantly as you type</p>
        </div>
        {hasValues && (
          <button
            onClick={handleClear}
            className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors font-medium"
          >
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
              {field.hint && (
                <span className="text-xs text-zinc-400">{field.hint}</span>
              )}
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <span className="text-zinc-400 font-semibold text-sm select-none">$</span>
              </div>
              <input
                type="text"
                inputMode="numeric"
                value={values[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                placeholder={field.placeholder}
                className={cn(
                  'w-full pl-8 pr-4 py-3 bg-white border rounded-xl text-sm font-semibold text-zinc-900 placeholder-zinc-300',
                  'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent',
                  'transition-all duration-150',
                  values[field.key] ? 'border-zinc-300' : 'border-zinc-200',
                )}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick-fill example */}
      <div className="mt-5 p-3.5 bg-zinc-50 rounded-xl border border-zinc-200">
        <p className="text-xs font-semibold text-zinc-500 mb-2">Try an example</p>
        <button
          onClick={() => {
            const example: Record<FieldKey, string> = {
              purchasePrice: '180000',
              arv: '250000',
              repairCosts: '40000',
              holdingCosts: '5000',
              closingCosts: '6000',
              monthlyRent: '2000',
            };
            setValues(example);
            onCalculate({
              purchasePrice: 180000,
              arv: 250000,
              repairCosts: 40000,
              holdingCosts: 5000,
              closingCosts: 6000,
              monthlyRent: 2000,
            });
          }}
          className="text-xs font-medium text-indigo-600 hover:text-indigo-800 transition-colors"
        >
          Tampa flip — ARV $250k, asking $180k, $40k rehab →
        </button>
      </div>
    </div>
  );
}
