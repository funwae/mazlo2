import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { tasks, rooms } from '@/db/schema';
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

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const roomTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.roomId, params.id));

    // Sort in memory (Drizzle ordering syntax varies)
    roomTasks.sort((a, b) => {
      const statusOrder = { todo: 1, doing: 2, done: 3 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      if (a.priority !== b.priority) {
        return (b.priority || 0) - (a.priority || 0);
      }
      if (a.dueDate && b.dueDate) {
        return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      }
      return 0;
    });

    return NextResponse.json({ tasks: roomTasks });
  } catch (error: any) {
    console.error('Error fetching tasks:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

