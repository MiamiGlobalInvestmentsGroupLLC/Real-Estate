'use client';

import { useState, useCallback } from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import DealForm from '@/components/analyzer/DealForm';
import ResultsPanel from '@/components/analyzer/ResultsPanel';
import SMSAnalyzer from '@/components/analyzer/SMSAnalyzer';
import OfferGenerator from '@/components/analyzer/OfferGenerator';
import { DealInputs, DealResults, calculateDeal } from '@/lib/calculations';
import { AIDecisionResult, getAIDecision } from '@/lib/aiDecision';
import { RedFlag, detectRedFlags } from '@/lib/redFlags';
import { ParsedSMSData } from '@/lib/smsParser';
import { cn } from '@/lib/utils';

type ActiveTab = 'analyzer' | 'sms' | 'offer';

export default function AnalyzerPage() {
  const [inputs, setInputs] = useState<DealInputs | null>(null);
  const [results, setResults] = useState<DealResults | null>(null);
  const [aiDecision, setAIDecision] = useState<AIDecisionResult | null>(null);
  const [redFlags, setRedFlags] = useState<RedFlag[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('analyzer');
  const [smsInitialValues, setSMSInitialValues] = useState<Partial<DealInputs>>({});

  const handleCalculate = useCallback((newInputs: DealInputs) => {
    const dealResults = calculateDeal(newInputs);
    const decision = getAIDecision(newInputs, dealResults);
    const flags = detectRedFlags(newInputs, dealResults);

    setInputs(newInputs);
    setResults(dealResults);
    setAIDecision(decision);
    setRedFlags(flags);
  }, []);

  const handleSMSParsed = useCallback((data: ParsedSMSData) => {
    const newInputs: Partial<DealInputs> = {};
    if (data.purchasePrice) newInputs.purchasePrice = data.purchasePrice;
    if (data.arv) newInputs.arv = data.arv;
    if (data.repairCosts) newInputs.repairCosts = data.repairCosts;
    if (data.holdingCosts) newInputs.holdingCosts = data.holdingCosts;
    if (data.closingCosts) newInputs.closingCosts = data.closingCosts;
    if (data.monthlyRent) newInputs.monthlyRent = data.monthlyRent;

    setSMSInitialValues(newInputs);

    const fullInputs: DealInputs = {
      purchasePrice: data.purchasePrice ?? 0,
      arv: data.arv ?? 0,
      repairCosts: data.repairCosts ?? 0,
      holdingCosts: data.holdingCosts ?? 0,
      closingCosts: data.closingCosts ?? 0,
      monthlyRent: data.monthlyRent,
    };

    if (fullInputs.purchasePrice > 0 && fullInputs.arv > 0) {
      handleCalculate(fullInputs);
    }
  }, [handleCalculate]);

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'analyzer',
      label: 'Deal Analyzer',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 11h.01M12 11h.01M15 11h.01M4 19h16a2 2 0 002-2V7a2 2 0 00-2-2H4a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      id: 'sms',
      label: 'SMS Engine',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
        </svg>
      ),
    },
    {
      id: 'offer',
      label: 'Offer Generator',
      icon: (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
    },
  ];

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-zinc-50">
        {/* Page header */}
        <div className="bg-white border-b border-zinc-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-zinc-900">Deal Analyzer</h1>
                <p className="text-sm text-zinc-500 mt-0.5">
                  Know in 30 seconds if your deal is worth it
                </p>
              </div>

              {/* AI status badge */}
              <div className="hidden sm:flex items-center gap-2 bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold px-3 py-1.5 rounded-full">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
                AI Engine Active
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-5">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all',
                    activeTab === tab.id
                      ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                      : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100',
                  )}
                >
                  {tab.icon}
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          {activeTab === 'analyzer' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              {/* Input panel — 40% */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6 sticky top-24">
                  <DealForm
                    onCalculate={handleCalculate}
                    initialValues={smsInitialValues}
                  />
                </div>
              </div>

              {/* Results panel — 60% */}
              <div className="lg:col-span-3">
                <ResultsPanel
                  results={results}
                  aiDecision={aiDecision}
                  redFlags={redFlags}
                />
              </div>
            </div>
          )}

          {activeTab === 'sms' && (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                  <SMSAnalyzer onParsed={handleSMSParsed} />
                </div>
              </div>
              <div className="lg:col-span-3">
                <ResultsPanel
                  results={results}
                  aiDecision={aiDecision}
                  redFlags={redFlags}
                />
              </div>
            </div>
          )}

          {activeTab === 'offer' && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-6">
                <OfferGenerator
                  inputs={inputs}
                  results={results}
                  aiDecision={aiDecision}
                />
              </div>

              {results && (
                <div className="mt-4">
                  <ResultsPanel
                    results={results}
                    aiDecision={aiDecision}
                    redFlags={redFlags}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
