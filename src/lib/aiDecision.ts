import { DealInputs, DealResults } from './calculations';

export type Decision = 'BUY' | 'PASS' | 'NEGOTIATE';
export type Strategy = 'Flip' | 'Wholesale' | 'Rental' | 'Flip or Rental';

export interface AIDecisionResult {
  decision: Decision;
  reason: string;
  strategy: Strategy;
  suggestedOffer: number;
  confidence: number;
}

export function getAIDecision(inputs: DealInputs, results: DealResults): AIDecisionResult {
  const { purchasePrice, arv, repairCosts } = inputs;
  const { flipProfit, marginPercent, roi, dealScore, maxAllowableOffer, riskLevel, rentalCashFlow } = results;

  const repairRatio = arv > 0 ? repairCosts / arv : 0;

  let strategy: Strategy;
  if (purchasePrice < maxAllowableOffer * 0.82) {
    strategy = 'Wholesale';
  } else if (repairRatio < 0.12 && marginPercent > 18) {
    strategy = 'Flip';
  } else if (rentalCashFlow && rentalCashFlow > 200 && marginPercent < 15) {
    strategy = 'Rental';
  } else if (marginPercent > 15) {
    strategy = 'Flip or Rental';
  } else {
    strategy = 'Flip';
  }

  let decision: Decision;
  let reason: string;
  let suggestedOffer: number;
  let confidence: number;

  if (dealScore >= 65 && marginPercent >= 15 && purchasePrice <= maxAllowableOffer) {
    decision = 'BUY';
    confidence = Math.min(99, 60 + dealScore * 0.35);

    if (marginPercent >= 25) {
      reason = `Strong ${marginPercent.toFixed(0)}% margin with ${roi.toFixed(0)}% ROI — excellent upside`;
    } else if (riskLevel === 'Low') {
      reason = `Healthy deal at ${marginPercent.toFixed(0)}% margin with low risk profile`;
    } else {
      reason = `Solid margin at ${marginPercent.toFixed(0)}% and ${roi.toFixed(0)}% ROI — numbers work`;
    }

    suggestedOffer = purchasePrice;
  } else if (dealScore >= 40 && (marginPercent >= 8 || flipProfit > 0)) {
    decision = 'NEGOTIATE';
    confidence = Math.min(88, 35 + dealScore * 0.45);

    const gap = purchasePrice - maxAllowableOffer;
    const reduceK = Math.ceil(Math.abs(gap) / 1000);

    if (purchasePrice > maxAllowableOffer) {
      reason = `Above MAO — negotiate down by $${reduceK}k to hit target margin`;
    } else if (marginPercent < 12) {
      reason = `Margin is thin at ${marginPercent.toFixed(0)}% — push for lower price to build buffer`;
    } else {
      reason = `Decent deal but room to improve — squeeze margin before committing`;
    }

    suggestedOffer = Math.max(maxAllowableOffer * 0.9, purchasePrice * 0.9);
  } else {
    decision = 'PASS';
    confidence = Math.min(97, 55 + (100 - dealScore) * 0.35);

    if (flipProfit < 0) {
      reason = `Deal loses money at current price — not viable`;
    } else if (marginPercent < 5) {
      reason = `Margin too thin at ${marginPercent.toFixed(0)}% — no buffer for overruns`;
    } else if (purchasePrice > maxAllowableOffer * 1.1) {
      const overPct = (((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100).toFixed(0);
      reason = `Asking price is ${overPct}% above MAO — deal doesn't pencil`;
    } else {
      reason = `Risk-reward doesn't justify investment — better deals exist`;
    }

    suggestedOffer = Math.max(0, maxAllowableOffer * 0.88);
  }

  return {
    decision,
    reason,
    strategy,
    suggestedOffer: Math.round(suggestedOffer / 500) * 500,
    confidence: Math.round(confidence),
  };
}
