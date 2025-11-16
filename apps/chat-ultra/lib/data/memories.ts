// Placeholder implementation for memories
// TODO: Add memories table to Drizzle schema or use Supabase directly

export interface Memory {
  _id: string;
  ownerUserId: string;
  scope: 'room' | 'thread' | 'global' | 'system';
  roomId?: string;
  threadId?: string;
  kind: 'fact' | 'preference' | 'plan' | 'identity' | 'project';
  source: 'user_pin' | 'user_edit' | 'auto_extracted' | 'imported';
  content: string;
  importance: number;
  recencyScore: number;
  usedCount: number;
  status: 'active' | 'archived' | 'deleted';
  createdAt: number;
  updatedAt: number;
  lastUsedAt?: number;
}

export async function getMemoriesForUser(userId: string): Promise<Memory[]> {
  // TODO: Implement with Supabase or add to Drizzle schema
  return [];
}

export async function getMemoriesForRoomAndThread(
  userId: string,
  roomId: string,
  threadId?: string
): Promise<Memory[]> {
  // TODO: Implement with Supabase or add to Drizzle schema
  return [];
}

export async function getSuggestedMemories(
  userId: string,
  roomId: string,
  threadId?: string
): Promise<Memory[]> {
  // TODO: Implement with Supabase or add to Drizzle schema
  return [];
}

export async function createMemory(data: Partial<Memory>): Promise<Memory> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Memory creation not yet implemented');
}

export async function updateMemory(memoryId: string, data: Partial<Memory>): Promise<Memory> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Memory update not yet implemented');
}

export async function deleteMemory(memoryId: string): Promise<void> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Memory deletion not yet implemented');
}

export async function getSummariesForRoomAndThread(
  userId: string,
  roomId: string,
  threadId?: string
): Promise<any[]> {
  // TODO: Implement with Supabase or add to Drizzle schema
  return [];
}

export async function summarizeThread(threadId: string): Promise<void> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Thread summarization not yet implemented');
}

export async function summarizeRoom(roomId: string): Promise<void> {
  // TODO: Implement with Supabase or add to Drizzle schema
  throw new Error('Room summarization not yet implemented');
}

