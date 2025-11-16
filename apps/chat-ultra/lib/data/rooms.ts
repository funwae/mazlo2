import { db } from '@/lib/db';
import { rooms, threads } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

export async function getRoomsForUser(userId: string) {
  return await db.query.rooms.findMany({
    where: eq(rooms.userId, userId),
    orderBy: [desc(rooms.updatedAt)],
    with: {
      threads: {
        orderBy: [desc(threads.updatedAt)],
        limit: 1,
      },
    },
  });
}

export async function getRoomById(roomId: string) {
  return await db.query.rooms.findFirst({
    where: eq(rooms.id, roomId),
    with: {
      threads: {
        orderBy: [desc(threads.updatedAt)],
      },
      tasks: true,
      pins: true,
    },
  });
}

export async function getGlobalRoomForUser(userId: string) {
  // Find or create a global room for the user
  // For now, we'll just get the first room or create one
  const existingRooms = await getRoomsForUser(userId);

  // Look for a room with name "Global" or similar
  let globalRoom = existingRooms.find(r => r.name.toLowerCase().includes('global'));

  if (!globalRoom) {
    // Create a global room
    const [newRoom] = await db
      .insert(rooms)
      .values({
        userId,
        name: 'Global',
        status: 'active',
      })
      .returning();
    globalRoom = newRoom;
  }

  return globalRoom;
}

export async function createRoom(userId: string, name: string, status: 'active' | 'paused' | 'archived' = 'active') {
  const [newRoom] = await db
    .insert(rooms)
    .values({
      userId,
      name,
      status,
    })
    .returning();

  return newRoom;
}

