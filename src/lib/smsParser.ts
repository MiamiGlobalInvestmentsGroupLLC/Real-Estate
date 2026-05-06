export interface ParsedSMSData {
  location?: string;
  arv?: number;
  repairCosts?: number;
  purchasePrice?: number;
  holdingCosts?: number;
  closingCosts?: number;
  monthlyRent?: number;
  confidence: number;
  rawText: string;
}

function parseValue(str: string): number | null {
  if (!str) return null;
  const cleaned = str.replace(/[$,\s]/g, '').toLowerCase();
  if (/^\d*\.?\d+m$/.test(cleaned)) return parseFloat(cleaned) * 1_000_000;
  if (/^\d*\.?\d+k$/.test(cleaned)) return parseFloat(cleaned) * 1_000;
  const n = parseFloat(cleaned);
  return isNaN(n) ? null : n;
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
  const result: ParsedSMSData = { confidence: 0, rawText: text };

  const arv = tryPatterns(text, [
    /arv[:\s]+(\$?[\d,.]+[km]?)/i,
    /after[\s-]repair[\s-]value[:\s]+(\$?[\d,.]+[km]?)/i,
    /valued?\s+at\s+(\$?[\d,.]+[km]?)/i,
    /worth\s+(\$?[\d,.]+[km]?)/i,
  ]);
  if (arv) result.arv = arv;

  const repair = tryPatterns(text, [
    /(\$?[\d,.]+[km]?)\s+(?:in\s+)?(?:rehab|repair|renovation|work|fixes?)/i,
    /(?:needs?|requires?)\s+(\$?[\d,.]+[km]?)\s+(?:in\s+)?(?:rehab|repair|work)/i,
    /rehab[:\s]+(\$?[\d,.]+[km]?)/i,
    /repairs?[:\s]+(\$?[\d,.]+[km]?)/i,
    /(?:fix|renovation)[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (repair) result.repairCosts = repair;

  const price = tryPatterns(text, [
    /asking[:\s]+(\$?[\d,.]+[km]?)/i,
    /listed?\s+(?:at\s+)?(\$?[\d,.]+[km]?)/i,
    /price[:\s]+(\$?[\d,.]+[km]?)/i,
    /seller\s+wants?\s+(\$?[\d,.]+[km]?)/i,
    /they\s+want\s+(\$?[\d,.]+[km]?)/i,
    /(?:purchase|offer)\s+price[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (price) result.purchasePrice = price;

  const rent = tryPatterns(text, [
    /rents?\s+(?:for\s+)?(\$?[\d,.]+[km]?)/i,
    /rental\s+income[:\s]+(\$?[\d,.]+[km]?)/i,
    /monthly\s+rent[:\s]+(\$?[\d,.]+[km]?)/i,
  ]);
  if (rent) result.monthlyRent = rent;

  // Location extraction
  const locPatterns = [
    /(?:house|property|home|duplex|unit)\s+in\s+([A-Z][a-zA-Z\s]+?)(?:,|\.|\s+(?:ARV|asking|needs|rehab|with|rents?)|$)/i,
    /in\s+([A-Z][a-zA-Z\s]+?),?\s+(?:FL|TX|CA|NY|GA|NC|SC|AZ|NV|OH|PA|MI|IL|WA|CO|TN|VA|MD|NJ|MN|MO)\b/i,
    /([A-Z][a-zA-Z\s]+?),\s+(?:FL|TX|CA|NY|GA|NC|SC|AZ|NV|OH|PA|MI|IL|WA|CO|TN|VA|MD|NJ|MN|MO)\b/i,
  ];
  for (const p of locPatterns) {
    const m = text.match(p);
    if (m) {
      result.location = m[1].trim();
      break;
    }
  }

  // Estimate holding/closing if missing
  if (result.purchasePrice && !result.holdingCosts) {
    result.holdingCosts = Math.round(result.purchasePrice * 0.03);
  }
  if (result.purchasePrice && !result.closingCosts) {
    result.closingCosts = Math.round(result.purchasePrice * 0.025);
  }

  const keyFound = [result.arv, result.repairCosts, result.purchasePrice].filter(Boolean).length;
  result.confidence = Math.round((keyFound / 3) * 100);

  return result;
}
