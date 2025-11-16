import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getOrCreateUser } from '@/lib/db/users';

export async function POST() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get or create user in database
    await getOrCreateUser(user.id, user.email || '');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error syncing user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

