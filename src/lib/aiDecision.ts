import { DealInputs, DealResults } from './calculations';

export type Decision = 'BUY' | 'PASS' | 'NEGOTIATE';
export type Strategy = 'Flip' | 'Wholesale' | 'Rental' | 'Flip or Rental';

export interface AIDecisionResult {
  decision: Decision;
  reason: string;
  strategy: Strategy;
  suggestedOffer: number;
  confidence: number; // 0-100, displayed as percentage
}

export function getAIDecision(inputs: DealInputs, results: DealResults): AIDecisionResult {
  const { purchasePrice, arv, repairCosts } = inputs;
  const {
    netProfit,
    marginPercent,
    roi,
    maxAllowableOffer,
    rentalCashFlow,
    targetOfferAt18,
  } = results;

  const repairRatio = arv > 0 ? repairCosts / arv : 0;
  const isAboveMao = purchasePrice > maxAllowableOffer && maxAllowableOffer > 0;
  const maoGapPct = maxAllowableOffer > 0
    ? ((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100
    : 0;

  // ── Strategy ──────────────────────────────────────────────────────────────
  // Wholesale: price is well below MAO — easy assignment margin
  let strategy: Strategy;
  if (maxAllowableOffer > 0 && purchasePrice < maxAllowableOffer * 0.85) {
    strategy = 'Wholesale';
  } else if (rentalCashFlow !== null && rentalCashFlow > 200 && marginPercent < 16) {
    strategy = 'Rental';
  } else if (rentalCashFlow !== null && rentalCashFlow > 0 && marginPercent >= 16) {
    strategy = 'Flip or Rental';
  } else {
    strategy = 'Flip';
  }

  // ── Decision (priority: Net Profit → Margin → MAO → ROI) ─────────────────

  let decision: Decision;
  let reason: string;
  let suggestedOffer: number;
  let confidence: number;

  const targetOffer = targetOfferAt18 > 0 ? targetOfferAt18 : maxAllowableOffer;

  // TIER 1 — BUY: Net Profit ≥ $30K AND Margin ≥ 18%
  if (netProfit >= 30000 && marginPercent >= 18) {
    decision = 'BUY';
    reason = marginPercent >= 25
      ? `Strong ${marginPercent.toFixed(0)}% margin with ${fmtK(netProfit)} net profit — excellent upside`
      : `${fmtK(netProfit)} net profit at ${marginPercent.toFixed(0)}% margin — meets buy threshold`;
    suggestedOffer = purchasePrice;
    confidence = calcConfidence(netProfit, marginPercent, maoGapPct);
  }

  // TIER 2 — BUY or NEGOTIATE: Net Profit ≥ $25K AND Margin 14–18%
  else if (netProfit >= 25000 && marginPercent >= 14) {
    if (!isAboveMao) {
      decision = 'BUY';
      reason = `${fmtK(netProfit)} net profit at ${marginPercent.toFixed(0)}% margin — solid deal at or below MAO`;
      suggestedOffer = purchasePrice;
    } else {
      decision = 'NEGOTIATE';
      reason = `${fmtK(netProfit)} profit but ${maoGapPct.toFixed(0)}% above MAO — negotiate to lock in margin`;
      suggestedOffer = targetOffer;
    }
    confidence = calcConfidence(netProfit, marginPercent, maoGapPct);
  }

  // TIER 3 — NEGOTIATE: Net Profit ≥ $20K AND Margin 12–16%
  // (OVERRIDE: being above MAO alone does not trigger PASS if profit & margin are acceptable)
  else if (netProfit >= 20000 && marginPercent >= 12) {
    decision = 'NEGOTIATE';
    const targetK = Math.round(targetOffer / 1000);
    reason = `${marginPercent.toFixed(0)}% margin is below the 18% target — aim for $${targetK}k to improve`;
    suggestedOffer = targetOffer;
    confidence = calcConfidence(netProfit, marginPercent, maoGapPct);
  }

  // TIER 4 — PASS: Insufficient profit or margin
  else {
    decision = 'PASS';
    if (netProfit < 0) {
      reason = `Deal loses ${fmtK(Math.abs(netProfit))} at current price — not viable`;
    } else if (marginPercent < 12) {
      reason = `${marginPercent.toFixed(0)}% margin is too thin — no buffer for cost overruns`;
    } else {
      reason = `${fmtK(netProfit)} net profit is below $20K minimum — risk-reward doesn't justify the deal`;
    }
    suggestedOffer = Math.min(targetOffer, maxAllowableOffer * 0.90);
    confidence = calcPassConfidence(netProfit, marginPercent);
  }

  return {
    decision,
    reason,
    strategy,
    suggestedOffer: Math.max(0, Math.round(suggestedOffer / 500) * 500),
    confidence: Math.round(confidence),
  };
}

function fmtK(value: number): string {
  return `$${Math.round(Math.abs(value) / 1000)}k`;
}

function calcConfidence(netProfit: number, marginPercent: number, maoGapPct: number): number {
  let score = 0;

  // Profit strength (0-50)
  if (netProfit >= 50000) score += 50;
  else if (netProfit >= 40000) score += 44;
  else if (netProfit >= 30000) score += 38;
  else if (netProfit >= 25000) score += 30;
  else if (netProfit >= 20000) score += 22;
  else score += 10;

  // Margin strength (0-30)
  if (marginPercent >= 22) score += 30;
  else if (marginPercent >= 18) score += 24;
  else if (marginPercent >= 15) score += 16;
  else if (marginPercent >= 12) score += 8;
  else score += 0;

  // MAO distance (0-20)
  if (maoGapPct <= -10) score += 20;    // 10%+ below MAO
  else if (maoGapPct <= 0) score += 15; // at or below MAO
  else if (maoGapPct <= 5) score += 8;  // slightly above
  else if (maoGapPct <= 10) score += 3; // moderately above
  else score += 0;                       // far above MAO

  return Math.min(95, Math.max(35, score));
}

function calcPassConfidence(netProfit: number, marginPercent: number): number {
  // For PASS, high confidence = we are sure it's a bad deal
  let score = 70;
  if (netProfit < 0) score += 20;
  else if (netProfit < 10000) score += 12;
  if (marginPercent < 8) score += 10;
  else if (marginPercent < 12) score += 5;
  return Math.min(97, score);
}
