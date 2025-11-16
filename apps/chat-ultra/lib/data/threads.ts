import { db } from '@/lib/db';
import { threads } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getThreadsByRoom(roomId: string) {
  return await db.query.threads.findMany({
    where: eq(threads.roomId, roomId),
    orderBy: [desc(threads.updatedAt)],
  });
}

export async function getThreadById(threadId: string) {
  return await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });
}

export async function createThread(roomId: string, title: string) {
  const [newThread] = await db
    .insert(threads)
    .values({
      roomId,
      title,
    })
    .returning();

  return newThread;
}

