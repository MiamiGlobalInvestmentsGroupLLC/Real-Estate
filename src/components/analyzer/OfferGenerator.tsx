'use client';

import { useState } from 'react';
import { DealInputs, DealResults, formatCurrency } from '@/lib/calculations';
import { AIDecisionResult } from '@/lib/aiDecision';
import { cn } from '@/lib/utils';

interface OfferGeneratorProps {
  inputs: DealInputs | null;
  results: DealResults | null;
  aiDecision: AIDecisionResult | null;
}

export default function OfferGenerator({ inputs, results, aiDecision }: OfferGeneratorProps) {
  const [address, setAddress] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [activeTab, setActiveTab] = useState<'sms' | 'letter'>('sms');
  const [copied, setCopied] = useState(false);

  if (!results || !aiDecision || !inputs) {
    return (
      <div className="text-center py-10">
        <div className="w-12 h-12 bg-zinc-100 rounded-xl mx-auto mb-3 flex items-center justify-center">
          <svg className="w-6 h-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <p className="text-sm text-zinc-500 font-medium">Analyze a deal first to generate offers</p>
      </div>
    );
  }

  const suggestedOffer = aiDecision.suggestedOffer;
  const finalOffer = offerPrice ? parseFloat(offerPrice.replace(/[^0-9.]/g, '')) || suggestedOffer : suggestedOffer;
  const propAddress = address || '123 Main Street, Tampa, FL 33601';

  const smsMessage = `Hi! I came across your property at ${propAddress} and I'm very interested.

I'd like to make you a cash offer of ${formatCurrency(finalOffer)}.

• All-cash, no financing contingency
• Close in as little as 14 days
• We cover all closing costs
• No repairs needed — as-is sale

This is a serious offer from a local investor. Would you be open to a quick call to discuss?

— DealEdge Investments`;

  const offerDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const letterContent = `REAL ESTATE PURCHASE OFFER

Date: ${offerDate}
Property: ${propAddress}

Dear Property Owner,

Miami Global Investments Group LLC ("Buyer") hereby submits this offer to purchase the above-referenced property.

OFFER DETAILS
─────────────────────────────────────
Purchase Price:     ${formatCurrency(finalOffer)}
Earnest Money:      ${formatCurrency(Math.round(finalOffer * 0.01))} (due within 3 business days)
Closing Date:       Within 14 days of accepted offer
Sale Type:          As-Is — no repairs required
Financing:          All-cash — no financing contingency
Closing Costs:      Paid by Buyer

DEAL ANALYSIS SUMMARY
─────────────────────────────────────
ARV:                ${formatCurrency(inputs.arv)}
Estimated Repairs:  ${formatCurrency(inputs.repairCosts)}
Offer / ARV Ratio:  ${((finalOffer / inputs.arv) * 100).toFixed(1)}%

TERMS & CONDITIONS
─────────────────────────────────────
• Offer valid for 5 business days from date above
• Buyer will conduct standard due diligence inspection within 7 days
• Title to be conveyed via warranty deed, free and clear of liens
• Buyer reserves right to assign this contract

This offer represents a fair, fast, and hassle-free transaction. We are committed to making this process as smooth as possible for you.

To accept or discuss, please contact us at:

Miami Global Investments Group LLC
Phone: (305) 000-0000
Email: deals@miamiglobalinvestments.com

─────────────────────────────────────
ACCEPTANCE

Seller Signature: _____________________  Date: ___________

Seller Printed Name: ___________________________________

Buyer: Miami Global Investments Group LLC`;

  const displayContent = activeTab === 'sms' ? smsMessage : letterContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handlePrint = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <html><head><title>Offer Letter — ${propAddress}</title>
      <style>body{font-family:monospace;padding:40px;max-width:700px;margin:0 auto;line-height:1.6;}
      h1{font-size:14px;margin-bottom:20px;}pre{white-space:pre-wrap;font-size:13px;}</style>
      </head><body><pre>${letterContent}</pre></body></html>
    `);
    win.document.close();
    win.print();
  };

  return (
    <div className="space-y-5">
      <div>
        <h3 className="text-base font-bold text-zinc-900 mb-1">Offer Generator</h3>
        <p className="text-sm text-zinc-500">
          Generate a seller SMS or PDF offer letter in seconds.
        </p>
      </div>

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">Property Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St, Tampa, FL"
            className="w-full px-3.5 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
            Offer Price
            <span className="ml-2 text-zinc-400 font-normal">
              (AI suggests: {formatCurrency(suggestedOffer)})
            </span>
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-3.5 flex items-center text-zinc-400 text-sm font-semibold">$</span>
            <input
              type="text"
              inputMode="numeric"
              value={offerPrice}
              onChange={(e) => setOfferPrice(e.target.value)}
              placeholder={suggestedOffer.toString()}
              className="w-full pl-7 pr-4 py-2.5 bg-white border border-zinc-200 rounded-xl text-sm font-semibold text-zinc-800 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-zinc-100 rounded-xl p-1">
        {([['sms', 'Seller SMS'], ['letter', 'PDF Offer Letter']] as const).map(([tab, label]) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'flex-1 text-sm font-semibold py-2 rounded-lg transition-all',
              activeTab === tab
                ? 'bg-white text-zinc-900 shadow-sm'
                : 'text-zinc-500 hover:text-zinc-700',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="relative">
        <pre className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 text-xs text-zinc-700 whitespace-pre-wrap font-mono leading-relaxed max-h-64 overflow-y-auto">
          {displayContent}
        </pre>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-3">
          <button
            onClick={handleCopy}
            className={cn(
              'flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all border',
              copied
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                : 'bg-white border-zinc-200 text-zinc-700 hover:bg-zinc-50',
            )}
          >
            {copied ? (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy {activeTab === 'sms' ? 'Message' : 'Letter'}
              </>
            )}
          </button>
          {activeTab === 'letter' && (
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print / PDF
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
