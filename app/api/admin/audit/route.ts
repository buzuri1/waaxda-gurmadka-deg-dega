import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
      
    if (error) {
      // If table doesn't exist yet, return empty array instead of failing
      if (error.code === '42P01') {
        return NextResponse.json({ logs: [] });
      }
      throw error;
    }
    
    return NextResponse.json({ logs: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { action, user_email, user_role, details } = await request.json();
    
    const { data, error } = await supabase
      .from('audit_logs')
      .insert([
        {
          action,
          user_email,
          user_role,
          details
        }
      ])
      .select()
      .single();

    if (error) {
      // If table doesn't exist, we just ignore the log silently to not break the app
      if (error.code === '42P01') {
        return NextResponse.json({ success: false, message: 'audit_logs table missing' });
      }
      throw error;
    }

    return NextResponse.json({ log: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
