import { DealInputs, DealResults } from './calculations';

export interface RedFlag {
  id: string;
  severity: 'critical' | 'warning';
  title: string;
  description: string;
}

export function detectRedFlags(inputs: DealInputs, results: DealResults): RedFlag[] {
  const { purchasePrice, arv, repairCosts, holdingCosts, closingCosts } = inputs;
  const { maxAllowableOffer, flipProfit, marginPercent, roi } = results;

  const flags: RedFlag[] = [];
  const repairRatio = arv > 0 ? repairCosts / arv : 0;

  if (flipProfit < 0) {
    flags.push({
      id: 'negative-profit',
      severity: 'critical',
      title: 'Negative Profit',
      description: `This deal loses $${Math.abs(Math.round(flipProfit / 1000))}k at current price. Do not buy.`,
    });
  }

  if (purchasePrice > maxAllowableOffer * 1.05) {
    const overK = Math.round((purchasePrice - maxAllowableOffer) / 1000);
    flags.push({
      id: 'over-mao',
      severity: 'critical',
      title: 'Above Max Allowable Offer',
      description: `Asking price exceeds MAO by $${overK}k. Fails the 70% rule — margin is unsustainable.`,
    });
  }

  if (marginPercent >= 0 && marginPercent < 10) {
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

  if (marginPercent >= 10 && marginPercent < 15) {
    flags.push({
      id: 'tight-margin',
      severity: 'warning',
      title: 'Tight Profit Margin',
      description: `${marginPercent.toFixed(1)}% margin works but leaves little room for surprises. Minimum recommended: 15%.`,
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

  if (holdingCosts < arv * 0.01 && arv > 80000 && holdingCosts > 0) {
    flags.push({
      id: 'low-holding',
      severity: 'warning',
      title: 'Holding Costs May Be Low',
      description: `Include taxes, insurance, utilities, and loan interest. Typical holding costs: 1–3% of ARV per 6 months.`,
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

  if (roi >= 0 && roi < 12) {
    flags.push({
      id: 'low-roi',
      severity: 'warning',
      title: 'Below-Target ROI',
      description: `${roi.toFixed(1)}% ROI is below the 15% minimum most flippers target. Consider other deals.`,
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
