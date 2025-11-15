import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { pins, rooms } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get pin and verify room ownership
    const pin = await db.query.pins.findFirst({
      where: eq(pins.id, params.id),
      with: {
        room: true,
      },
    });

    if (!pin || pin.room.userId !== session.user.id) {
      return NextResponse.json({ error: 'Pin not found' }, { status: 404 });
    }

    await db.delete(pins).where(eq(pins.id, params.id));

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error deleting pin:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

