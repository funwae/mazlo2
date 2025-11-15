import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms, messages, pins, tasks } from '@/db/schema';
import { eq, and, or, like, sql } from 'drizzle-orm';

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
    const query = url.searchParams.get('q');
    const type = url.searchParams.get('type') || 'all';
    const roomId = url.searchParams.get('roomId');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    if (!query || query.length < 2) {
      return NextResponse.json({ results: [], total: 0, query });
    }

    const results: any[] = [];
    const searchTerm = `%${query}%`;

    // Search Rooms
    if (type === 'all' || type === 'rooms') {
      const roomResults = await db
        .select()
        .from(rooms)
        .where(
          and(
            eq(rooms.userId, session.user.id),
            or(
              like(rooms.name, searchTerm),
              like(rooms.summary || sql`''`, searchTerm)
            )
          )
        )
        .limit(limit)
        .offset(offset);

      results.push(
        ...roomResults.map((room) => ({
          type: 'room',
          id: room.id,
          roomId: room.id,
          roomName: room.name,
          content: room.summary || room.name,
          highlight: room.name.replace(
            new RegExp(query, 'gi'),
            (match) => `<mark>${match}</mark>`
          ),
          createdAt: room.createdAt.toISOString(),
        }))
      );
    }

    // Search Messages
    if (type === 'all' || type === 'messages') {
      let messageQuery = db
        .select()
        .from(messages)
        .where(like(messages.content, searchTerm))
        .limit(limit)
        .offset(offset);

      if (roomId) {
        messageQuery = messageQuery.where(
          and(like(messages.content, searchTerm), eq(messages.roomId, roomId))
        );
      }

      const messageResults = await messageQuery;

      // Get room info for messages
      for (const msg of messageResults) {
        const room = await db.query.rooms.findFirst({
          where: eq(rooms.id, msg.roomId),
        });

        if (room && room.userId === session.user.id) {
          results.push({
            type: 'message',
            id: msg.id,
            roomId: msg.roomId,
            roomName: room.name,
            threadId: msg.threadId,
            content: msg.content,
            highlight: msg.content.replace(
              new RegExp(query, 'gi'),
              (match) => `<mark>${match}</mark>`
            ),
            createdAt: msg.createdAt.toISOString(),
          });
        }
      }
    }

    // Search Pins
    if (type === 'all' || type === 'pins') {
      const pinResults = await db
        .select()
        .from(pins)
        .where(like(pins.title, searchTerm))
        .limit(limit)
        .offset(offset);

      for (const pin of pinResults) {
        const room = await db.query.rooms.findFirst({
          where: eq(rooms.id, pin.roomId),
        });

        if (room && room.userId === session.user.id) {
          results.push({
            type: 'pin',
            id: pin.id,
            roomId: pin.roomId,
            roomName: room.name,
            content: pin.title,
            highlight: pin.title.replace(
              new RegExp(query, 'gi'),
              (match) => `<mark>${match}</mark>`
            ),
            createdAt: pin.createdAt.toISOString(),
          });
        }
      }
    }

    // Search Tasks
    if (type === 'all' || type === 'tasks') {
      const taskResults = await db
        .select()
        .from(tasks)
        .where(
          or(
            like(tasks.title, searchTerm),
            like(tasks.description || sql`''`, searchTerm)
          )
        )
        .limit(limit)
        .offset(offset);

      for (const task of taskResults) {
        const room = await db.query.rooms.findFirst({
          where: eq(rooms.id, task.roomId),
        });

        if (room && room.userId === session.user.id) {
          results.push({
            type: 'task',
            id: task.id,
            roomId: task.roomId,
            roomName: room.name,
            content: task.title,
            highlight: task.title.replace(
              new RegExp(query, 'gi'),
              (match) => `<mark>${match}</mark>`
            ),
            createdAt: task.createdAt.toISOString(),
          });
        }
      }
    }

    return NextResponse.json({
      results: results.slice(0, limit),
      total: results.length,
      query,
    });
  } catch (error: any) {
    console.error('Error searching:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

