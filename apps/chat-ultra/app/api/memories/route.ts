import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getMemoriesForUser } from '@/lib/data/memories';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const memories = await getMemoriesForUser(user.id);
    return NextResponse.json({ memories });
  } catch (error: any) {
    console.error('Error fetching memories:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

