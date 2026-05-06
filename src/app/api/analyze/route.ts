import { NextRequest, NextResponse } from 'next/server';
import { calculateDeal, DealInputs } from '@/lib/calculations';
import { getAIDecision } from '@/lib/aiDecision';
import { detectRedFlags } from '@/lib/redFlags';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const inputs: DealInputs = {
      purchasePrice: Number(body.purchasePrice) || 0,
      arv: Number(body.arv) || 0,
      repairCosts: Number(body.repairCosts) || 0,
      holdingCosts: Number(body.holdingCosts) || 0,
      closingCosts: Number(body.closingCosts) || 0,
      monthlyRent: body.monthlyRent ? Number(body.monthlyRent) : undefined,
    };

    if (inputs.purchasePrice <= 0 || inputs.arv <= 0) {
      return NextResponse.json(
        { error: 'purchasePrice and arv are required and must be positive numbers' },
        { status: 400 },
      );
    }

    const results = calculateDeal(inputs);
    const aiDecision = getAIDecision(inputs, results);
    const redFlags = detectRedFlags(inputs, results);

    return NextResponse.json({ inputs, results, aiDecision, redFlags });
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
