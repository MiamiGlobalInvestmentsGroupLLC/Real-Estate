import { NextRequest, NextResponse } from 'next/server';
import { parseSMSText } from '@/lib/smsParser';
import { calculateDeal, DealInputs } from '@/lib/calculations';
import { getAIDecision } from '@/lib/aiDecision';
import { detectRedFlags } from '@/lib/redFlags';

const FORBIDDEN_KEYWORDS = [
  'contract', 'agreement', 'pdf', 'offer letter', 'purchase agreement',
  'legally binding', 'binding document', 'formal offer',
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { text } = body;

    if (!text || typeof text !== 'string' || text.trim().length < 10) {
      return NextResponse.json(
        { error: 'text field is required and must be at least 10 characters' },
        { status: 400 },
      );
    }

    // Legal restriction check
    const lowerText = text.toLowerCase();
    if (FORBIDDEN_KEYWORDS.some((k) => lowerText.includes(k))) {
      return NextResponse.json(
        { error: 'This feature is not available. DealEdge AI only extracts and analyzes deal data.' },
        { status: 400 },
      );
    }

    const parsed = parseSMSText(text.trim());

    if (parsed.confidence === 0 || (!parsed.purchasePrice && !parsed.arv)) {
      return NextResponse.json({
        parsed,
        message: 'Could not extract deal data from the provided text.',
      });
    }

    const inputs: DealInputs = {
      purchasePrice: parsed.purchasePrice ?? 0,
      arv: parsed.arv ?? 0,
      repairCosts: parsed.repairCosts ?? 0,
      holdingCosts: parsed.holdingCosts ?? 0,   // null → 0, never invented
      closingCosts: parsed.closingCosts ?? 0,   // null → 0, never invented
      monthlyRent: parsed.monthlyRent,
    };

    if (inputs.purchasePrice > 0 && inputs.arv > 0) {
      const results = calculateDeal(inputs);
      const aiDecision = getAIDecision(inputs, results);
      const redFlags = detectRedFlags(inputs, results);
      return NextResponse.json({ parsed, inputs, results, aiDecision, redFlags });
    }

    return NextResponse.json({ parsed });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
