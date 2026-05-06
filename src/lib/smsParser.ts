export interface ParsedSMSData {
  location?: string;
  arv?: number;
  repairCosts?: number;
  purchasePrice?: number;
  holdingCosts?: number;
  closingCosts?: number;
  monthlyRent?: number;
  confidence: number;
  warnings: string[];
  errors: string[];
  rawText: string;
}

function parseValue(str: string): number | null {
  if (!str) return null;
  const cleaned = str.replace(/[$,\s]/g, '').toLowerCase();
  if (/^\d*\.?\d+m$/.test(cleaned)) return Math.round(parseFloat(cleaned) * 1_000_000);
  if (/^\d*\.?\d+k$/.test(cleaned)) return Math.round(parseFloat(cleaned) * 1_000);
  const n = parseFloat(cleaned);
  return isNaN(n) || n <= 0 ? null : n;
}

function tryPatterns(text: string, patterns: RegExp[]): number | null {
  for (const p of patterns) {
    const m = text.match(p);
    if (m) {
      const val = parseValue(m[1]);
      if (val !== null) return val;
    }
  }
  return null;
}

export function parseSMSText(text: string): ParsedSMSData {
  const result: ParsedSMSData = {
    confidence: 0,
    rawText: text,
    warnings: [],
    errors: [],
  };

  // ── ARV ──────────────────────────────────────────────────────────────────
  const arv = tryPatterns(text, [
    /arv[:\s]+(\$?[\d,.]+[km]?)/i,
    /after[\s-]repair[\s-]value[:\s]+(\$?[\d,.]+[km]?)/i,
    /value\s+after\s+repair[s]?[:\s]+(\$?[\d,.]+[km]?)/i,
    /arv\s+(?:is\s+)?(\$?[\d,.]+[km]?)/i,
    /valued?\s+at\s+(\$?[\d,.]+[km]?)/i,
    /worth\s+(\$?[\d,.]+[km]?)\s+after/i,
  ]);
  if (arv) result.arv = arv;

  // ── Repair / Rehab ────────────────────────────────────────────────────────
  const repair = tryPatterns(text, [
    /rehab[:\s]+(\$?[\d,.]+[km]?)/i,
    /repairs?[:\s]+(\$?[\d,.]+[km]?)/i,
    /renovation[:\s]+(\$?[\d,.]+[km]?)/i,
    /(\$?[\d,.]+[km]?)\s+(?:in\s+)?(?:rehab|repairs?|renovation|work|fixes?)/i,
    /(?:needs?|requires?)\s+(\$?[\d,.]+[km]?)\s+(?:in\s+)?(?:rehab|repairs?|work)/i,
    /fix(?:es)?[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (repair) result.repairCosts = repair;

  // ── Purchase Price ────────────────────────────────────────────────────────
  const price = tryPatterns(text, [
    /purchase[:\s]+(\$?[\d,.]+[km]?)/i,
    /buy(?:ing)?[:\s]+(\$?[\d,.]+[km]?)/i,
    /asking[:\s]+(\$?[\d,.]+[km]?)/i,
    /(?:purchase|offer)\s+price[:\s]+(\$?[\d,.]+[km]?)/i,
    /price[:\s]+(\$?[\d,.]+[km]?)/i,
    /listed?\s+(?:at\s+)?(\$?[\d,.]+[km]?)/i,
    /seller\s+wants?\s+(\$?[\d,.]+[km]?)/i,
    /they\s+want\s+(\$?[\d,.]+[km]?)/i,
    /offer[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (price) result.purchasePrice = price;

  // ── Holding Costs — ONLY if explicitly stated. NEVER invent. ─────────────
  const holding = tryPatterns(text, [
    /hold(?:ing)?\s+costs?[:\s]+(\$?[\d,.]+[km]?)/i,
    /hold(?:ing)?[:\s]+(\$?[\d,.]+[km]?)/i,
    /taxes?[:\s]+(\$?[\d,.]+[km]?)\s*(?:\/mo|per\s+month)?/i,
    /insurance[:\s]+(\$?[\d,.]+[km]?)/i,
    /utilities[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (holding) result.holdingCosts = holding;

  // ── Closing Costs — ONLY if explicitly stated. NEVER invent. ─────────────
  const closing = tryPatterns(text, [
    /clos(?:ing)?\s+costs?[:\s]+(\$?[\d,.]+[km]?)/i,
    /clos(?:ing)?[:\s]+(\$?[\d,.]+[km]?)/i,
    /transaction\s+costs?[:\s]+(\$?[\d,.]+[km]?)/i,
    /fees?[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (closing) result.closingCosts = closing;

  // ── Monthly Rent ──────────────────────────────────────────────────────────
  const rent = tryPatterns(text, [
    /monthly\s+rent[:\s]+(\$?[\d,.]+[km]?)/i,
    /rental\s+income[:\s]+(\$?[\d,.]+[km]?)/i,
    /rent[:\s]+(\$?[\d,.]+[km]?)/i,
    /rents?\s+(?:for\s+)?(\$?[\d,.]+[km]?)/i,
  ]);
  if (rent) result.monthlyRent = rent;

  // ── Location ──────────────────────────────────────────────────────────────
  const locPatterns = [
    /(?:house|property|home|duplex|unit)\s+in\s+([A-Z][a-zA-Z\s]+?)(?:,|\.|\s+(?:ARV|asking|needs|rehab|with|rents?)|$)/i,
    /in\s+([A-Z][a-zA-Z\s]+?),?\s+(?:FL|TX|CA|NY|GA|NC|SC|AZ|NV|OH|PA|MI|IL|WA|CO|TN|VA|MD|NJ|MN|MO)\b/i,
    /([A-Z][a-zA-Z\s]+?),\s+(?:FL|TX|CA|NY|GA|NC|SC|AZ|NV|OH|PA|MI|IL|WA|CO|TN|VA|MD|NJ|MN|MO)\b/i,
  ];
  for (const p of locPatterns) {
    const m = text.match(p);
    if (m) { result.location = m[1].trim(); break; }
  }

  // ── Validation Layer ──────────────────────────────────────────────────────

  if (result.repairCosts && result.arv && result.repairCosts > result.arv) {
    result.errors.push('Rehab cost exceeds ARV — likely incorrect extraction');
  }

  if (result.purchasePrice && result.arv && result.purchasePrice > result.arv) {
    result.warnings.push('Purchase price exceeds ARV — verify these numbers');
  }

  // 10x outlier check
  const nonZeroValues = [
    result.purchasePrice,
    result.arv,
    result.repairCosts,
    result.holdingCosts,
    result.closingCosts,
  ].filter((v): v is number => v !== undefined && v > 0);

  if (nonZeroValues.length >= 2) {
    const max = Math.max(...nonZeroValues);
    const min = Math.min(...nonZeroValues);
    if (max > min * 10) {
      result.warnings.push('Suspicious value detected — possible misread (one value is 10× larger than others)');
    }
  }

  // ── Confidence Score (0–100) ───────────────────────────────────────────────
  // Required fields: purchase_price (30), arv (30), rehab (20)
  // Optional:        holding (5), closing (5) → small penalty if absent
  // Deductions:      warnings (-5 each), errors (-15 each)
  let confidence = 100;
  if (!result.purchasePrice) confidence -= 30;
  if (!result.arv) confidence -= 30;
  if (!result.repairCosts) confidence -= 20;
  if (!result.holdingCosts) confidence -= 5;
  if (!result.closingCosts) confidence -= 5;
  confidence -= result.warnings.length * 5;
  confidence -= result.errors.length * 15;
  result.confidence = Math.max(0, Math.min(100, confidence));

  return result;
}
