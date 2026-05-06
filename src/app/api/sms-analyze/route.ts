import { NextRequest, NextResponse } from 'next/server';
import { parseSMSText } from '@/lib/smsParser';
import { calculateDeal, DealInputs } from '@/lib/calculations';
import { getAIDecision } from '@/lib/aiDecision';
import { detectRedFlags } from '@/lib/redFlags';

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

    const parsed = parseSMSText(text.trim());

    if (parsed.confidence === 0) {
      return NextResponse.json({
        parsed,
        message: 'Could not extract deal data from the provided text.',
      });
    }

    const inputs: DealInputs = {
      purchasePrice: parsed.purchasePrice ?? 0,
      arv: parsed.arv ?? 0,
      repairCosts: parsed.repairCosts ?? 0,
      holdingCosts: parsed.holdingCosts ?? 0,
      closingCosts: parsed.closingCosts ?? 0,
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
