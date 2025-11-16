import { db } from '@/lib/db';
import { messages } from '@/db/schema';
import { eq, and, desc, asc } from 'drizzle-orm';

export async function getMessagesByThread(threadId: string, limit: number = 50) {
  return await db.query.messages.findMany({
    where: eq(messages.threadId, threadId),
    orderBy: [asc(messages.createdAt)],
    limit,
  });
}

export async function getMessagesByRoom(roomId: string, limit: number = 50) {
  return await db.query.messages.findMany({
    where: eq(messages.roomId, roomId),
    orderBy: [desc(messages.createdAt)],
    limit,
  });
}

export async function createMessage(data: {
  roomId: string;
  threadId: string;
  role: 'user' | 'mazlo' | 'system';
  content: string;
  provider?: string;
  traceId?: string;
}) {
  const [newMessage] = await db
    .insert(messages)
    .values(data)
    .returning();

  return newMessage;
}

