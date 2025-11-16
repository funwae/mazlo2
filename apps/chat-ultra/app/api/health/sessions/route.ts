import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usageSessions } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';
import { z } from 'zod';

const createSessionSchema = z.object({
  room_id: z.string().uuid().optional(),
});

export async function GET(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const url = new URL(request.url);
    const startDate = url.searchParams.get('start_date');
    const endDate = url.searchParams.get('end_date');

    const conditions = [eq(usageSessions.userId, session.user.id)];

    if (startDate) {
      conditions.push(gte(usageSessions.startedAt, new Date(startDate)));
    }

    if (endDate) {
      conditions.push(lte(usageSessions.startedAt, new Date(endDate)));
    }

    const sessions = await db
      .select()
      .from(usageSessions)
      .where(conditions.length > 1 ? and(...conditions) : conditions[0]);

    return NextResponse.json({ sessions });
  } catch (error: any) {
    console.error('Error fetching sessions:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createSessionSchema.parse(body);

    const [newSession] = await db
      .insert(usageSessions)
      .values({
        userId: session.user.id,
        startedAt: new Date(),
        roomId: data.room_id,
      })
      .returning();

    return NextResponse.json({ session: newSession }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

