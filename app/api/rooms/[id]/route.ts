import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms, threads, pins, tasks } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { z } from 'zod';

const updateRoomSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['active', 'paused', 'archived']).optional(),
  summary: z.string().optional(),
  primary_language: z.string().length(5).optional(),
  secondary_languages: z.array(z.string()).optional(),
  world_theme: z.string().optional(),
});

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

    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Fetch related data
    const roomThreads = await db
      .select()
      .from(threads)
      .where(eq(threads.roomId, params.id))
      .orderBy(desc(threads.updatedAt));

    const roomPins = await db
      .select()
      .from(pins)
      .where(eq(pins.roomId, params.id));

    const roomTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.roomId, params.id));

    return NextResponse.json({
      room: {
        ...room,
        threads: roomThreads,
        pins: roomPins,
        tasks: roomTasks,
      },
    });
  } catch (error: any) {
    console.error('Error fetching room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

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

    // Verify room ownership
    const existingRoom = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!existingRoom) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const body = await request.json();
    const data = updateRoomSchema.parse(body);

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (data.name !== undefined) updateData.name = data.name;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.summary !== undefined) updateData.summary = data.summary;
    if (data.primary_language !== undefined) updateData.primaryLanguage = data.primary_language;
    if (data.secondary_languages !== undefined) updateData.secondaryLanguages = data.secondary_languages;
    if (data.world_theme !== undefined) updateData.worldTheme = data.world_theme;

    const [updatedRoom] = await db
      .update(rooms)
      .set(updateData)
      .where(eq(rooms.id, params.id))
      .returning();

    return NextResponse.json({ room: updatedRoom });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error updating room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
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
    const existingRoom = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!existingRoom) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    // Archive instead of delete
    await db
      .update(rooms)
      .set({ status: 'archived', updatedAt: new Date() })
      .where(eq(rooms.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error archiving room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

