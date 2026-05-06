'use client';

import { useState, useEffect } from 'react';
import { DealInputs, DealResults, formatCurrency } from '@/lib/calculations';
import { AIDecisionResult } from '@/lib/aiDecision';
import { cn } from '@/lib/utils';

interface OfferGeneratorProps {
  inputs: DealInputs | null;
  results: DealResults | null;
  aiDecision: AIDecisionResult | null;
}

const PROFILE_KEY = 'dealedge_offer_profile';

interface OfferForm {
  buyerCompany: string;
  buyerName: string;
  buyerPhone: string;
  buyerEmail: string;
  sellerName: string;
  propertyAddress: string;
  offerPrice: string;
  closingDate: string;
  closingCostsPayer: 'buyer' | 'seller' | 'split';
  assignable: boolean;
  personalNote: string;
}

const defaults: OfferForm = {
  buyerCompany: '',
  buyerName: '',
  buyerPhone: '',
  buyerEmail: '',
  sellerName: '',
  propertyAddress: '',
  offerPrice: '',
  closingDate: '',
  closingCostsPayer: 'buyer',
  assignable: true,
  personalNote: '',
};

function loadForm(): Partial<OfferForm> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(PROFILE_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveForm(data: Partial<OfferForm>) {
  localStorage.setItem(PROFILE_KEY, JSON.stringify(data));
}

function Field({
  label, hint, children,
}: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-zinc-600 mb-1">
        {label}
        {hint && <span className="ml-1.5 font-normal text-zinc-400">{hint}</span>}
      </label>
      {children}
    </div>
  );
}

const inputCls = 'w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent';

export default function OfferGenerator({ inputs, results, aiDecision }: OfferGeneratorProps) {
  const [form, setForm] = useState<OfferForm>({ ...defaults });
  const [copied, setCopied] = useState(false);
  const [section, setSection] = useState<'form' | 'preview'>('form');

  useEffect(() => {
    const saved = loadForm();
    setForm((prev) => ({ ...prev, ...saved }));
  }, []);

  useEffect(() => {
    if (aiDecision && !form.offerPrice) {
      setForm((prev) => ({ ...prev, offerPrice: aiDecision.suggestedOffer.toString() }));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiDecision]);

  function update(key: keyof OfferForm, value: string | boolean) {
    const updated = { ...form, [key]: value };
    setForm(updated);
    saveForm(updated);
  }

  if (!results || !aiDecision || !inputs) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 bg-zinc-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 font-medium">Analyze a deal first to generate a message</p>
      </div>
    );
  }

  const offerPrice = parseFloat(form.offerPrice.replace(/[^0-9.]/g, '')) || aiDecision.suggestedOffer;
  const company = form.buyerCompany || 'Miami Global Investments Group LLC';
  const name = form.buyerName || 'Your Name';
  const phone = form.buyerPhone || '(305) 000-0000';
  const email = form.buyerEmail;
  const address = form.propertyAddress || '123 Main Street, Tampa, FL 33601';
  const closingDate = form.closingDate
    ? new Date(form.closingDate + 'T00:00:00').toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    : 'Within 14 days of accepted offer';
  const closingCostText = form.closingCostsPayer === 'buyer' ? 'Paid by Buyer' : form.closingCostsPayer === 'seller' ? 'Paid by Seller' : 'Split 50/50';

  const message = `Hi${form.sellerName ? ` ${form.sellerName}` : ''}! I'm ${name}${form.buyerCompany ? ` with ${company}` : ''}.

I came across your property at ${address} and I'm very interested in making you a cash offer.

My offer: ${formatCurrency(offerPrice)}

• All-cash, no financing
• Close by ${closingDate}
• Closing costs: ${closingCostText}
• As-is — no repairs needed${form.assignable ? '\n• Buyer reserves right to assign contract' : ''}${form.personalNote ? `\n\n${form.personalNote}` : ''}

This is a serious offer. Would you be open to a quick 5-minute call?

Call or text me: ${phone}${email ? `\nEmail: ${email}` : ''}

— ${name}${form.buyerCompany ? `, ${company}` : ''}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-zinc-900">Offer Message</h3>
          <p className="text-sm text-zinc-500">Fill in all details, then preview your message.</p>
        </div>
        <div className="flex bg-zinc-100 rounded-xl p-0.5">
          <button
            onClick={() => setSection('form')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', section === 'form' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500')}
          >
            Edit
          </button>
          <button
            onClick={() => setSection('preview')}
            className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold transition-all', section === 'preview' ? 'bg-white text-zinc-900 shadow-sm' : 'text-zinc-500')}
          >
            Preview
          </button>
        </div>
      </div>

      {section === 'form' ? (
        <div className="space-y-5">
          {/* Buyer info */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Your Info (Buyer)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Company Name">
                <input type="text" value={form.buyerCompany} onChange={(e) => update('buyerCompany', e.target.value)}
                  placeholder="Miami Global Investments Group LLC" className={inputCls} />
              </Field>
              <Field label="Your Name">
                <input type="text" value={form.buyerName} onChange={(e) => update('buyerName', e.target.value)}
                  placeholder="John Smith" className={inputCls} />
              </Field>
              <Field label="Phone Number">
                <input type="tel" value={form.buyerPhone} onChange={(e) => update('buyerPhone', e.target.value)}
                  placeholder="(305) 555-0100" className={inputCls} />
              </Field>
              <Field label="Email" hint="(optional)">
                <input type="email" value={form.buyerEmail} onChange={(e) => update('buyerEmail', e.target.value)}
                  placeholder="you@company.com" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Seller + property */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Seller & Property</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Seller Name" hint="(optional)">
                <input type="text" value={form.sellerName} onChange={(e) => update('sellerName', e.target.value)}
                  placeholder="Property Owner" className={inputCls} />
              </Field>
              <Field label="Property Address">
                <input type="text" value={form.propertyAddress} onChange={(e) => update('propertyAddress', e.target.value)}
                  placeholder="123 Main St, Tampa, FL 33601" className={inputCls} />
              </Field>
            </div>
          </div>

          {/* Offer terms */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Offer Terms</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Field label="Offer Price" hint={`AI suggests ${formatCurrency(aiDecision.suggestedOffer)}`}>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-400 text-sm font-semibold">$</span>
                  <input type="text" inputMode="numeric" value={form.offerPrice}
                    onChange={(e) => update('offerPrice', e.target.value)}
                    placeholder={aiDecision.suggestedOffer.toString()}
                    className={cn(inputCls, 'pl-7')} />
                </div>
              </Field>
              <Field label="Closing Date">
                <input type="date" value={form.closingDate} onChange={(e) => update('closingDate', e.target.value)}
                  className={inputCls} />
              </Field>
              <Field label="Closing Costs Paid By">
                <select value={form.closingCostsPayer} onChange={(e) => update('closingCostsPayer', e.target.value as OfferForm['closingCostsPayer'])}
                  className={inputCls}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="split">Split 50/50</option>
                </select>
              </Field>
              <Field label="Assignable Contract">
                <div className="flex items-center gap-3 h-[42px]">
                  <button
                    type="button"
                    onClick={() => update('assignable', !form.assignable)}
                    className={cn(
                      'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                      form.assignable ? 'bg-indigo-600' : 'bg-zinc-300',
                    )}
                  >
                    <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm',
                      form.assignable ? 'translate-x-6' : 'translate-x-1')} />
                  </button>
                  <span className="text-sm text-zinc-600">{form.assignable ? 'Yes — buyer can assign' : 'No assignment'}</span>
                </div>
              </Field>
            </div>
          </div>

          {/* Personal note */}
          <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4 space-y-3">
            <p className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Personal Message to Seller <span className="font-normal text-zinc-400">(optional)</span></p>
            <textarea
              value={form.personalNote}
              onChange={(e) => update('personalNote', e.target.value)}
              rows={3}
              placeholder="Add a personal note that builds rapport with the seller…"
              className={cn(inputCls, 'resize-none')}
            />
          </div>

          <button
            onClick={() => setSection('preview')}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl text-sm transition-colors"
          >
            Preview Message →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Message Preview</p>

          <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 whitespace-pre-wrap font-mono leading-relaxed max-h-96 overflow-y-auto">
            {message}
          </pre>

          <button
            onClick={handleCopy}
            className={cn(
              'w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border',
              copied ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50',
            )}
          >
            {copied ? (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg> Copied!</>
            ) : (
              <><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg> Copy Message</>
            )}
          </button>

          <button onClick={() => setSection('form')} className="text-xs text-zinc-400 hover:text-zinc-600 transition-colors">
            ← Back to edit form
          </button>
        </div>
      )}
    </div>
  );
}
