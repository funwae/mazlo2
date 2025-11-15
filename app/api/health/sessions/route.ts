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

    let query = db.select().from(usageSessions).where(eq(usageSessions.userId, session.user.id));

    if (startDate) {
      query = query.where(and(eq(usageSessions.userId, session.user.id), gte(usageSessions.startedAt, new Date(startDate))));
    }

    if (endDate) {
      query = query.where(and(eq(usageSessions.userId, session.user.id), lte(usageSessions.startedAt, new Date(endDate))));
    }

    const sessions = await query;

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

