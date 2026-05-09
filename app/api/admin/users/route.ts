import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with the service role key for admin tasks
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.auth.admin.listUsers();
    
    if (error) throw error;
    
    const users = data.users.map(user => ({
      id: user.id,
      email: user.email,
      name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Unknown User',
      role: user.user_metadata?.role || 'User',
      status: 'Active', // Supabase users are active by default unless banned
      lastLogin: user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : 'Never'
    }));

    return NextResponse.json({ users });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { email, password, name, role } = await request.json();
    
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: name,
        role: role
      }
    });

    if (error) throw error;

    return NextResponse.json({ user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id, role } = await request.json();
    
    // First get current user metadata to merge
    const { data: userData, error: getError } = await supabaseAdmin.auth.admin.getUserById(id);
    if (getError) throw getError;

    const currentMetadata = userData.user.user_metadata || {};

    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(id, {
      user_metadata: {
        ...currentMetadata,
        role: role
      }
    });

    if (error) throw error;

    return NextResponse.json({ user: data.user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    
    if (!id) throw new Error('User ID is required');

    const { error } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
