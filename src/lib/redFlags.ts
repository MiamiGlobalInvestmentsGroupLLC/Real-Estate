import { DealInputs, DealResults } from './calculations';

export interface RedFlag {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
}

export function detectRedFlags(inputs: DealInputs, results: DealResults): RedFlag[] {
  const { purchasePrice, arv, repairCosts, holdingCosts, closingCosts, holdingMonths } = inputs;
  const { maxAllowableOffer, netProfit, marginPercent, roi, holdingCostWarning } = results;
  const effectiveMonths = holdingMonths ?? 4;

  const flags: RedFlag[] = [];
  const repairRatio = arv > 0 ? repairCosts / arv : 0;

  if (netProfit < 0) {
    flags.push({
      id: 'negative-profit',
      severity: 'critical',
      title: 'Negative Net Profit',
      description: `This deal loses ${fmtK(Math.abs(netProfit))} after all costs including selling fees. Do not buy.`,
    });
  }

  if (purchasePrice > maxAllowableOffer * 1.05 && maxAllowableOffer > 0) {
    const overK = Math.round((purchasePrice - maxAllowableOffer) / 1000);
    flags.push({
      id: 'over-mao',
      severity: 'critical',
      title: 'Above Max Allowable Offer',
      description: `Asking price exceeds MAO by $${overK}k. Based on the 75% rule — margin is unsustainable at this price.`,
    });
  }

  if (marginPercent >= 0 && marginPercent < 12) {
    flags.push({
      id: 'low-margin',
      severity: 'critical',
      title: 'Critically Low Margin',
      description: `${marginPercent.toFixed(1)}% margin offers no buffer. A 10–15% cost overrun kills the deal.`,
    });
  }

  if (repairRatio > 0.25) {
    flags.push({
      id: 'high-rehab',
      severity: 'critical',
      title: 'Heavy Rehab Risk',
      description: `Rehab is ${(repairRatio * 100).toFixed(0)}% of ARV. High chance of cost overruns and timeline delays.`,
    });
  }

  if (marginPercent >= 12 && marginPercent < 18) {
    flags.push({
      id: 'tight-margin',
      severity: 'warning',
      title: 'Tight Profit Margin',
      description: `${marginPercent.toFixed(1)}% margin works but leaves little room for surprises. Target is 18%+.`,
    });
  }

  if (repairRatio > 0.15 && repairRatio <= 0.25) {
    flags.push({
      id: 'moderate-rehab',
      severity: 'warning',
      title: 'Above-Average Rehab Costs',
      description: `Rehab at ${(repairRatio * 100).toFixed(0)}% of ARV increases risk. Budget a 15% contingency.`,
    });
  }

  if (holdingCostWarning) {
    flags.push({
      id: 'low-holding',
      severity: 'warning',
      title: 'Holding Costs May Be Underestimated',
      description: `Typical holding costs are ~1% of purchase price per month (taxes, insurance, utilities, financing). For ${effectiveMonths} months, expect ~${fmtK(purchasePrice * 0.01 * effectiveMonths)}.`,
    });
  }

  if (effectiveMonths > 6) {
    flags.push({
      id: 'long-hold',
      severity: 'warning',
      title: 'Extended Holding Period',
      description: `${effectiveMonths}-month hold increases financing costs, property taxes, and market exposure. Ensure your margin accounts for the extended timeline.`,
    });
  }

  if (closingCosts > 0 && closingCosts < purchasePrice * 0.015) {
    flags.push({
      id: 'low-closing',
      severity: 'warning',
      title: 'Closing Costs Appear Low',
      description: `Typical closing costs are 2–4% of purchase price. Low estimates can erode your margin.`,
    });
  }

  if (roi >= 0 && roi < 15) {
    flags.push({
      id: 'low-roi',
      severity: 'warning',
      title: 'Below-Target ROI',
      description: `${roi.toFixed(1)}% ROI is below the 15% minimum most investors target. Consider the opportunity cost.`,
    });
  }

  const arvRatio = purchasePrice > 0 ? arv / purchasePrice : 0;
  if (arvRatio < 1.2 && arv > 0 && purchasePrice > 0) {
    flags.push({
      id: 'low-arv-ratio',
      severity: 'warning',
      title: 'Low Appreciation Upside',
      description: `ARV is only ${((arvRatio - 1) * 100).toFixed(0)}% above purchase price. Limited room for error on valuation.`,
    });
  }

  return flags;
}

function fmtK(value: number): string {
  return `$${Math.round(value / 1000)}k`;
}
