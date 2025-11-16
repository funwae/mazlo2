import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getProviderConfigsForUser, createProviderConfig } from '@/lib/data/providers';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = await getProviderConfigsForUser(user.id);
    return NextResponse.json({ configs });
  } catch (error: any) {
    console.error('Error fetching provider configs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const config = await createProviderConfig({
      ownerUserId: user.id,
      ...body,
    });
    return NextResponse.json({ config });
  } catch (error: any) {
    console.error('Error creating provider config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

