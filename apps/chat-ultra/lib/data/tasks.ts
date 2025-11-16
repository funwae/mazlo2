import { db } from '@/lib/db';
import { tasks } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getTasksByRoom(roomId: string) {
  return await db.query.tasks.findMany({
    where: eq(tasks.roomId, roomId),
  });
}

export async function createTask(data: {
  roomId: string;
  messageId?: string;
  title: string;
  description?: string;
  status?: 'todo' | 'doing' | 'done';
  dueDate?: Date;
  priority?: number;
}) {
  const [newTask] = await db
    .insert(tasks)
    .values({
      ...data,
      status: data.status || 'todo',
      priority: data.priority || 0,
    })
    .returning();

  return newTask;
}

export async function updateTaskStatus(taskId: string, status: 'todo' | 'doing' | 'done') {
  const [updated] = await db
    .update(tasks)
    .set({ status, updatedAt: new Date() })
    .where(eq(tasks.id, taskId))
    .returning();

  return updated;
}

export async function deleteTask(taskId: string) {
  await db.delete(tasks).where(eq(tasks.id, taskId));
}

