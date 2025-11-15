import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pins, rooms, messages } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const createPinSchema = z.object({
  room_id: z.string().uuid(),
  message_id: z.string().uuid(),
  title: z.string().min(1).max(255),
  tag: z.enum(['decision', 'insight', 'spec', 'link']),
});

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
    const data = createPinSchema.parse(body);

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, data.room_id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Verify message exists in room
    const message = await db.query.messages.findFirst({
      where: and(eq(messages.id, data.message_id), eq(messages.roomId, data.room_id)),
    });

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 });
    }

    const [newPin] = await db
      .insert(pins)
      .values({
        roomId: data.room_id,
        messageId: data.message_id,
        title: data.title,
        tag: data.tag,
      })
      .returning();

    return NextResponse.json({ pin: newPin }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating pin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

