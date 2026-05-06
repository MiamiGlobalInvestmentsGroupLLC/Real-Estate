export interface DealInputs {
  purchasePrice: number;
  arv: number;
  repairCosts: number;
  holdingCosts: number;
  closingCosts: number;
  monthlyRent?: number;
  holdingMonths?: number;   // default 4 if omitted
  sellingCostRate?: number; // default 0.08 (8% of ARV)
}

export interface DealResults {
  // Core profit (includes selling costs — the real net profit)
  netProfit: number;
  sellingCosts: number;
  sellingCostRate: number;
  totalInvestment: number;

  // Legacy alias kept for display compatibility
  flipProfit: number; // same as netProfit

  // MAO
  maxAllowableOffer: number;
  maoRate: number; // the % used (0.75 default)

  // Wholesale
  wholesaleAssignmentFee: number;

  // Rates
  marginPercent: number; // netProfit / ARV
  roi: number;           // netProfit / totalInvestment
  equityGained: number;  // ARV - purchasePrice

  // Scoring
  dealScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  dealRating: 'Excellent' | 'Good' | 'Borderline' | 'Bad';

  // Rental (if monthlyRent provided)
  rentalCashFlow: number | null;
  monthlyMortgage: number | null;
  capRate: number | null;
  cashOnCash: number | null;

  // Target offer to achieve 18% margin (for NEGOTIATE guidance)
  targetOfferAt18: number;

  // Flags
  holdingCostWarning: boolean;
}

// Price target to achieve a specific margin % after selling costs
export function targetOfferForMargin(
  arv: number,
  repairCosts: number,
  holdingCosts: number,
  closingCosts: number,
  sellingCostRate: number,
  targetMargin: number,
): number {
  // netProfit / ARV = targetMargin
  // ARV - ARV*sellingRate - (offer + repair + holding + closing) = ARV * targetMargin
  // offer = ARV*(1 - sellingRate - targetMargin) - repair - holding - closing
  return arv * (1 - sellingCostRate - targetMargin) - repairCosts - holdingCosts - closingCosts;
}

export function calculateDeal(inputs: DealInputs): DealResults {
  const {
    purchasePrice,
    arv,
    repairCosts,
    holdingCosts,
    closingCosts,
    monthlyRent,
    holdingMonths,
    sellingCostRate: customSellingRate,
  } = inputs;

  // ── Selling costs (8% of ARV default) ──────────────────────────────────
  const sellingCostRate = customSellingRate ?? 0.08;
  const sellingCosts = arv * sellingCostRate;

  // ── Total investment ────────────────────────────────────────────────────
  const totalInvestment = purchasePrice + repairCosts + holdingCosts + closingCosts;

  // ── Net profit (the real number — after selling costs) ──────────────────
  const netProfit = arv - sellingCosts - totalInvestment;

  // ── Margin on ARV ────────────────────────────────────────────────────────
  const marginPercent = arv > 0 ? (netProfit / arv) * 100 : 0;

  // ── ROI (secondary metric) ──────────────────────────────────────────────
  const roi = totalInvestment > 0 ? (netProfit / totalInvestment) * 100 : 0;

  // ── Equity ──────────────────────────────────────────────────────────────
  const equityGained = arv - purchasePrice;

  // ── Dynamic MAO rate (section 25) ───────────────────────────────────────
  // Margin is already known (doesn't depend on MAO) — no circularity.
  // Strong deal → allow 75–80% | Acceptable → 70–75% | Weak → 65–70%
  let maoRate: number;
  if (marginPercent >= 18 && netProfit >= 30000) {
    maoRate = 0.78; // strong
  } else if (marginPercent >= 14) {
    maoRate = 0.73; // acceptable
  } else {
    maoRate = 0.68; // weak / risky
  }
  const maxAllowableOffer = arv * maoRate - repairCosts;

  // ── Wholesale assignment (conservative — buyer at MAO) ───────────────────
  const wholesaleAssignmentFee = Math.max(0, maxAllowableOffer - purchasePrice);

  // ── Target offer to achieve 18% margin ──────────────────────────────────
  const targetOfferAt18 = targetOfferForMargin(
    arv, repairCosts, holdingCosts, closingCosts, sellingCostRate, 0.18,
  );

  // ── Effective holding months (section 16) ───────────────────────────────
  const effectiveMonths = holdingMonths ?? 4;

  // ── Holding cost realism warning (section 20) ────────────────────────────
  // Typical: ~1%/month of purchase price. Warn if actual is under 50% of expected.
  const minExpectedHolding = purchasePrice * 0.005 * effectiveMonths;
  const holdingCostWarning = holdingCosts > 0 && holdingCosts < minExpectedHolding && purchasePrice > 80000;

  // ── Rental calculations ──────────────────────────────────────────────────
  let rentalCashFlow: number | null = null;
  let monthlyMortgage: number | null = null;
  let capRate: number | null = null;
  let cashOnCash: number | null = null;

  if (monthlyRent && monthlyRent > 0 && purchasePrice > 0) {
    const loanAmount = purchasePrice * 0.8;
    const monthlyRate = 0.07 / 12;
    const n = 360;
    monthlyMortgage =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
    const monthlyExpenses = monthlyRent * 0.15; // vacancy + maintenance
    rentalCashFlow = monthlyRent - monthlyMortgage - monthlyExpenses;

    const annualNOI = monthlyRent * 12 * 0.85;
    capRate = (annualNOI / purchasePrice) * 100;

    const downPayment = purchasePrice * 0.2;
    cashOnCash = downPayment > 0 ? ((rentalCashFlow * 12) / downPayment) * 100 : null;
  }

  // ── Deal Score (0–100) ───────────────────────────────────────────────────
  // Priority: 1) Net Profit (35pts), 2) Margin (30pts), 3) Price vs MAO (25pts), 4) Rehab (10pts)
  let score = 0;

  // Net Profit tier (35 pts)
  if (netProfit >= 40000) score += 35;
  else if (netProfit >= 30000) score += 28;
  else if (netProfit >= 25000) score += 21;
  else if (netProfit >= 20000) score += 14;
  else if (netProfit >= 15000) score += 7;

  // Margin tier (30 pts)
  if (marginPercent >= 20) score += 30;
  else if (marginPercent >= 18) score += 25;
  else if (marginPercent >= 15) score += 20;
  else if (marginPercent >= 12) score += 14;
  else if (marginPercent >= 8) score += 7;

  // Price vs MAO (25 pts)
  if (maxAllowableOffer > 0) {
    const pctAboveMao = ((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100;
    if (pctAboveMao <= -10) score += 25;       // ≥10% below MAO
    else if (pctAboveMao <= 0) score += 18;    // at or below MAO
    else if (pctAboveMao <= 5) score += 10;    // up to 5% above
    else if (pctAboveMao <= 10) score += 4;    // up to 10% above
    // >10% above MAO → 0 pts
  }

  // Rehab ratio (10 pts)
  const repairRatio = arv > 0 ? repairCosts / arv : 1;
  if (repairRatio < 0.10) score += 10;
  else if (repairRatio < 0.15) score += 8;
  else if (repairRatio < 0.20) score += 6;
  else if (repairRatio < 0.25) score += 4;
  else if (repairRatio < 0.30) score += 2;

  score = Math.min(100, Math.max(0, Math.round(score)));

  // ── Risk Level ───────────────────────────────────────────────────────────
  const pctAboveMaoForRisk = maxAllowableOffer > 0
    ? ((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100
    : 100;

  let riskLevel: 'Low' | 'Medium' | 'High';
  if (marginPercent >= 18 && netProfit >= 30000 && pctAboveMaoForRisk <= 0 && repairRatio < 0.15) {
    riskLevel = 'Low';
  } else if (marginPercent >= 12 && netProfit >= 20000 && pctAboveMaoForRisk <= 10 && repairRatio < 0.25) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  // ── Holding time adjustment (section 16) ────────────────────────────────
  // > 6 months → market risk increases → downgrade one level
  // < 3 months → faster exit → upgrade one level if margin supports it
  if (effectiveMonths > 6) {
    if (riskLevel === 'Low') riskLevel = 'Medium';
    else if (riskLevel === 'Medium') riskLevel = 'High';
  } else if (effectiveMonths < 3) {
    if (riskLevel === 'Medium' && marginPercent >= 18) riskLevel = 'Low';
    else if (riskLevel === 'High' && marginPercent >= 15 && netProfit >= 25000) riskLevel = 'Medium';
  }

  // ── Deal Rating ──────────────────────────────────────────────────────────
  let dealRating: 'Excellent' | 'Good' | 'Borderline' | 'Bad';
  if (score >= 75) dealRating = 'Excellent';
  else if (score >= 55) dealRating = 'Good';
  else if (score >= 35) dealRating = 'Borderline';
  else dealRating = 'Bad';

  return {
    netProfit,
    flipProfit: netProfit, // alias
    sellingCosts,
    sellingCostRate,
    totalInvestment,
    maxAllowableOffer,
    maoRate,
    wholesaleAssignmentFee,
    marginPercent,
    roi,
    equityGained,
    dealScore: score,
    riskLevel,
    dealRating,
    rentalCashFlow,
    monthlyMortgage,
    capRate,
    cashOnCash,
    targetOfferAt18: Math.max(0, Math.round(targetOfferAt18 / 500) * 500),
    holdingCostWarning,
  };
}

export function formatCurrency(value: number): string {
  const abs = Math.abs(value);
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(abs);
  return value < 0 ? `-${formatted}` : formatted;
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
}
