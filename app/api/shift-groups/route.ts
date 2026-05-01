import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

// GET all shift groups
export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('shift_groups')
    .select('*, shaqalaha(id, magaca_buuxa, xirfadda, xaaladda)')
    .order('magaca');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT — set which group is active
export async function PUT(req: NextRequest) {
  const supabase = getServiceClient();
  const { activeGroupId } = await req.json();
  
  // Set all inactive first
  await supabase.from('shift_groups').update({ is_active: false }).neq('id', 0);
  // Then set the chosen one active
  const { data, error } = await supabase
    .from('shift_groups')
    .update({ is_active: true })
    .eq('id', activeGroupId)
    .select()
    .single();
  
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
