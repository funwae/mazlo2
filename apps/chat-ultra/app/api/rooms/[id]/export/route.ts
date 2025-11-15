import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms, threads, messages, pins, tasks } from '@/db/schema';
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

    const url = new URL(request.url);
    const format = url.searchParams.get('format') || 'json';

    // Fetch all room data
    const roomThreads = await db
      .select()
      .from(threads)
      .where(eq(threads.roomId, params.id));

    const roomMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.roomId, params.id));

    const roomPins = await db
      .select()
      .from(pins)
      .where(eq(pins.roomId, params.id));

    const roomTasks = await db
      .select()
      .from(tasks)
      .where(eq(tasks.roomId, params.id));

    const exportData = {
      room,
      threads: roomThreads,
      messages: roomMessages,
      pins: roomPins,
      tasks: roomTasks,
      exportedAt: new Date().toISOString(),
    };

    if (format === 'markdown') {
      // Generate Markdown
      let markdown = `# ${room.name}\n\n`;
      if (room.summary) {
        markdown += `${room.summary}\n\n`;
      }
      markdown += `---\n\n`;

      // Add threads and messages
      for (const thread of roomThreads) {
        markdown += `## ${thread.title}\n\n`;
        const threadMessages = roomMessages.filter((m) => m.threadId === thread.id);
        for (const msg of threadMessages) {
          markdown += `**${msg.role}**: ${msg.content}\n\n`;
        }
      }

      // Add pins
      if (roomPins.length > 0) {
        markdown += `## Pins\n\n`;
        for (const pin of roomPins) {
          markdown += `- [${pin.tag}] ${pin.title}\n`;
        }
        markdown += `\n`;
      }

      // Add tasks
      if (roomTasks.length > 0) {
        markdown += `## Tasks\n\n`;
        for (const task of roomTasks) {
          markdown += `- [${task.status === 'done' ? 'x' : ' '}] ${task.title}\n`;
        }
      }

      return new NextResponse(markdown, {
        headers: {
          'Content-Type': 'text/markdown',
          'Content-Disposition': `attachment; filename="${room.name}.md"`,
        },
      });
    }

    // JSON format
    return NextResponse.json(exportData, {
      headers: {
        'Content-Disposition': `attachment; filename="${room.name}.json"`,
      },
    });
  } catch (error: any) {
    console.error('Error exporting room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

