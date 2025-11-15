import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { rooms } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { z } from 'zod';

const createRoomSchema = z.object({
  name: z.string().min(1).max(255),
  primary_language: z.string().length(5).optional(),
  secondary_languages: z.array(z.string()).optional(),
  world_theme: z.string().optional(),
});

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userRooms = await db
      .select()
      .from(rooms)
      .where(eq(rooms.userId, session.user.id))
      .orderBy(desc(rooms.updatedAt));

    return NextResponse.json({ rooms: userRooms });
  } catch (error: any) {
    console.error('Error fetching rooms:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const data = createRoomSchema.parse(body);

    // Ensure user exists in our database
    const { getOrCreateUser } = await import('@/lib/db/users');
    await getOrCreateUser(session.user.id, session.user.email!);

    const newRoom = await db
      .insert(rooms)
      .values({
        userId: session.user.id,
        name: data.name,
        primaryLanguage: data.primary_language || 'en-US',
        secondaryLanguages: data.secondary_languages || [],
        worldTheme: data.world_theme || 'glyphd-dark',
      })
      .returning();

    return NextResponse.json({ room: newRoom[0] }, { status: 201 });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error creating room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

