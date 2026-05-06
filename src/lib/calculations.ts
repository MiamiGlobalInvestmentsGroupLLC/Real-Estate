export interface DealInputs {
  purchasePrice: number;
  arv: number;
  repairCosts: number;
  holdingCosts: number;
  closingCosts: number;
  monthlyRent?: number;
}

export interface DealResults {
  maxAllowableOffer: number;
  flipProfit: number;
  rentalCashFlow: number | null;
  monthlyMortgage: number | null;
  roi: number;
  dealScore: number;
  riskLevel: 'Low' | 'Medium' | 'High';
  dealRating: 'Excellent' | 'Good' | 'Borderline' | 'Bad';
  marginPercent: number;
  totalInvestment: number;
  equityGained: number;
}

export function calculateDeal(inputs: DealInputs): DealResults {
  const { purchasePrice, arv, repairCosts, holdingCosts, closingCosts, monthlyRent } = inputs;

  const maxAllowableOffer = arv * 0.7 - repairCosts;
  const totalInvestment = purchasePrice + repairCosts + holdingCosts + closingCosts;
  const flipProfit = arv - totalInvestment;
  const marginPercent = arv > 0 ? (flipProfit / arv) * 100 : 0;
  const roi = totalInvestment > 0 ? (flipProfit / totalInvestment) * 100 : 0;
  const equityGained = arv - purchasePrice;

  let rentalCashFlow: number | null = null;
  let monthlyMortgage: number | null = null;

  if (monthlyRent && monthlyRent > 0 && purchasePrice > 0) {
    const loanAmount = purchasePrice * 0.8;
    const monthlyRate = 0.07 / 12;
    const n = 360;
    monthlyMortgage =
      (loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, n))) /
      (Math.pow(1 + monthlyRate, n) - 1);
    const monthlyExpenses = monthlyRent * 0.15;
    rentalCashFlow = monthlyRent - monthlyMortgage - monthlyExpenses;
  }

  // Deal Score (0–100)
  let score = 0;

  // Margin contribution (40 pts)
  if (marginPercent >= 25) score += 40;
  else if (marginPercent >= 20) score += 32;
  else if (marginPercent >= 15) score += 24;
  else if (marginPercent >= 10) score += 16;
  else if (marginPercent >= 5) score += 8;

  // Purchase vs MAO (30 pts)
  if (maxAllowableOffer > 0) {
    if (purchasePrice <= maxAllowableOffer) {
      const pctBelow = ((maxAllowableOffer - purchasePrice) / maxAllowableOffer) * 100;
      if (pctBelow >= 10) score += 30;
      else if (pctBelow >= 5) score += 22;
      else score += 14;
    } else {
      const pctAbove = ((purchasePrice - maxAllowableOffer) / maxAllowableOffer) * 100;
      if (pctAbove < 5) score += 5;
    }
  }

  // ROI contribution (20 pts)
  if (roi >= 25) score += 20;
  else if (roi >= 20) score += 16;
  else if (roi >= 15) score += 12;
  else if (roi >= 10) score += 8;
  else if (roi >= 5) score += 4;

  // Repair ratio (10 pts)
  const repairRatio = arv > 0 ? repairCosts / arv : 1;
  if (repairRatio < 0.1) score += 10;
  else if (repairRatio < 0.15) score += 8;
  else if (repairRatio < 0.2) score += 6;
  else if (repairRatio < 0.25) score += 4;
  else if (repairRatio < 0.3) score += 2;

  score = Math.min(100, Math.max(0, Math.round(score)));

  let riskLevel: 'Low' | 'Medium' | 'High';
  if (marginPercent >= 20 && repairRatio < 0.15 && purchasePrice <= maxAllowableOffer) {
    riskLevel = 'Low';
  } else if (marginPercent >= 10 && repairRatio < 0.25) {
    riskLevel = 'Medium';
  } else {
    riskLevel = 'High';
  }

  let dealRating: 'Excellent' | 'Good' | 'Borderline' | 'Bad';
  if (score >= 75) dealRating = 'Excellent';
  else if (score >= 55) dealRating = 'Good';
  else if (score >= 35) dealRating = 'Borderline';
  else dealRating = 'Bad';

  return {
    maxAllowableOffer,
    flipProfit,
    rentalCashFlow,
    monthlyMortgage,
    roi,
    dealScore: score,
    riskLevel,
    dealRating,
    marginPercent,
    totalInvestment,
    equityGained,
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
