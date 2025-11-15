import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const parkRoomSchema = z.object({
  thaw_date: z.string().datetime().optional(),
});

export async function POST(
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

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const body = await request.json();
    const data = parkRoomSchema.parse(body);

    // Generate summary (simplified - in production, use LLM)
    const summary = room.summary || `Room "${room.name}" paused on ${new Date().toLocaleDateString()}`;

    // Update room status to paused
    const [updatedRoom] = await db
      .update(rooms)
      .set({
        status: 'paused',
        summary,
        updatedAt: new Date(),
      })
      .where(eq(rooms.id, params.id))
      .returning();

    return NextResponse.json({
      room: updatedRoom,
      summary,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error parking room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

