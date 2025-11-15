import { db } from '@/lib/db';
import { rooms, threads, messages, pins, tasks } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';

export async function buildContext({
  roomId,
  threadId,
  maxMessages = 20,
}: {
  roomId: string;
  threadId: string;
  maxMessages?: number;
}) {
  // Load Room
  const room = await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
  });

  if (!room) {
    throw new Error('Room not found');
  }

  // Load Thread
  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });

  if (!thread) {
    throw new Error('Thread not found');
  }

  // Load recent messages
  const recentMessages = await db
    .select()
    .from(messages)
    .where(eq(messages.threadId, threadId))
    .orderBy(desc(messages.createdAt))
    .limit(maxMessages);

  // Load active pins
  const activePins = await db
    .select()
    .from(pins)
    .where(eq(pins.roomId, roomId))
    .limit(10);

  // Load relevant tasks
  const relevantTasks = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.roomId, roomId), eq(tasks.status, 'todo')))
    .limit(5);

  return {
    room,
    thread,
    recentMessages: recentMessages.reverse(), // Reverse to chronological order
    activePins,
    relevantTasks,
  };
}

