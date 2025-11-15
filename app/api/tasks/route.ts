import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, rooms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { z } from 'zod';

const createTaskSchema = z.object({
  room_id: z.string().uuid(),
  message_id: z.string().uuid().optional(),
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  due_date: z.string().datetime().optional(),
  priority: z.number().int().default(0),
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
    const data = createTaskSchema.parse(body);

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, data.room_id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const [newTask] = await db
      .insert(tasks)
      .values({
        roomId: data.room_id,
        messageId: data.message_id,
        title: data.title,
        description: data.description,
        dueDate: data.due_date ? new Date(data.due_date) : undefined,
        priority: data.priority,
      })
      .returning();

    return NextResponse.json({ task: newTask }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

