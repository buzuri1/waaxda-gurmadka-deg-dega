import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getServiceClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET() {
  const supabase = getServiceClient();
  const { data, error } = await supabase
    .from('shaqalaha')
    .select('*, shift_groups(magaca, sharax, waqtiga_bilowga, waqtiga_dhammaadka, is_active)')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const supabase = getServiceClient();
  const body = await req.json();
  const { data, error } = await supabase.from('shaqalaha').insert(body).select().single();
  if (error) {
    console.error('Insert shaqaale error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(req: NextRequest) {
  const supabase = getServiceClient();
  const body = await req.json();
  const { id, ...updates } = body;
  updates.updated_at = new Date().toISOString();
  const { data, error } = await supabase.from('shaqalaha').update(updates).eq('id', id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(req: NextRequest) {
  const supabase = getServiceClient();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });
  const { error } = await supabase.from('shaqalaha').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
