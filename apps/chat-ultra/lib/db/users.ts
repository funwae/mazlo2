import { db } from './index';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function getOrCreateUser(supabaseUserId: string, email: string) {
  const existingUser = await db.query.users.findFirst({
    where: eq(users.id, supabaseUserId),
  });

  if (existingUser) {
    return existingUser;
  }

  // Create user record
  const [newUser] = await db
    .insert(users)
    .values({
      id: supabaseUserId,
      email,
    })
    .returning();

  return newUser;
}

