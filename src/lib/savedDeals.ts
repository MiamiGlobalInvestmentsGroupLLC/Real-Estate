import { DealInputs, DealResults } from './calculations';
import { AIDecisionResult } from './aiDecision';

export interface SavedDeal {
  id: string;
  savedAt: string;
  label: string;
  strategy: 'flip' | 'wholesale' | 'rental';
  inputs: DealInputs;
  results: DealResults;
  decision: AIDecisionResult;
}

const KEY = 'dealedge_saved_deals';

export function getSavedDeals(): SavedDeal[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveDeal(deal: Omit<SavedDeal, 'id' | 'savedAt'>): SavedDeal {
  const deals = getSavedDeals();
  const newDeal: SavedDeal = {
    ...deal,
    id: crypto.randomUUID(),
    savedAt: new Date().toISOString(),
  };
  deals.unshift(newDeal);
  if (deals.length > 50) deals.splice(50);
  localStorage.setItem(KEY, JSON.stringify(deals));
  return newDeal;
}

export function deleteSavedDeal(id: string): void {
  const deals = getSavedDeals().filter((d) => d.id !== id);
  localStorage.setItem(KEY, JSON.stringify(deals));
}
