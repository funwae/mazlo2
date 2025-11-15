import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { usageSessions } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get session and verify ownership
    const sessionRecord = await db.query.usageSessions.findFirst({
      where: eq(usageSessions.id, params.id),
    });

    if (!sessionRecord || sessionRecord.userId !== session.user.id) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }

    // Calculate duration
    const startedAt = sessionRecord.startedAt;
    const endedAt = new Date();
    const totalSeconds = Math.floor((endedAt.getTime() - startedAt.getTime()) / 1000);

    // Update session
    const [updatedSession] = await db
      .update(usageSessions)
      .set({
        endedAt,
        totalSeconds,
      })
      .where(eq(usageSessions.id, params.id))
      .returning();

    return NextResponse.json({ session: updatedSession });
  } catch (error: any) {
    console.error('Error ending session:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
