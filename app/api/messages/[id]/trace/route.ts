import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { traces, messages, rooms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(
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

    // Get message and verify ownership
    const message = await db.query.messages.findFirst({
      where: eq(messages.id, params.id),
      with: {
        room: true,
      },
    });

    if (!message || message.room.userId !== session.user.id) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    // Get trace
    const trace = await db.query.traces.findFirst({
      where: eq(traces.messageId, params.id),
    });

    if (!trace) {
      return NextResponse.json({ error: 'Trace not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: trace.id,
      steps: trace.stepsJson,
      tokenUsage: trace.tokenUsageJson,
    });
  } catch (error: any) {
    console.error('Error fetching trace:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

