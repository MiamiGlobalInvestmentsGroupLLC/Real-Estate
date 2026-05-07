import { NextResponse } from 'next/server';
import { createServiceClient } from '@/lib/supabase/service';

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const service = process.env.SUPABASE_SERVICE_ROLE_KEY;

  let dbOk = false;
  let dbError = '';
  try {
    const supabase = createServiceClient();
    const { error } = await supabase.from('profiles').select('id').limit(1);
    dbOk = !error;
    dbError = error?.message ?? '';
  } catch (e) {
    dbError = String(e);
  }

  return NextResponse.json({
    supabaseUrl: url ? url.slice(0, 30) + '...' : 'MISSING',
    anonKey: anon ? 'SET (' + anon.length + ' chars)' : 'MISSING',
    serviceKey: service ? 'SET (' + service.length + ' chars)' : 'MISSING',
    dbConnected: dbOk,
    dbError,
  });
}
