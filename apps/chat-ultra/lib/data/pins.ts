import { db } from '@/lib/db';
import { pins } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getPinsByRoom(roomId: string) {
  return await db.query.pins.findMany({
    where: eq(pins.roomId, roomId),
  });
}

export async function createPin(data: {
  roomId: string;
  messageId: string;
  title: string;
  tag: 'decision' | 'insight' | 'spec' | 'link';
}) {
  const [newPin] = await db
    .insert(pins)
    .values(data)
    .returning();

  return newPin;
}

export async function deletePin(pinId: string) {
  await db.delete(pins).where(eq(pins.id, pinId));
}

