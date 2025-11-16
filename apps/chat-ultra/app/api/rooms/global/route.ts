import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getGlobalRoomForUser } from '@/lib/data/rooms';
import { getThreadsByRoom } from '@/lib/data/threads';

export async function GET() {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const globalRoom = await getGlobalRoomForUser(user.id);
    const threads = await getThreadsByRoom(globalRoom.id);

    return NextResponse.json({ room: globalRoom, threads });
  } catch (error: any) {
    console.error('Error fetching global room:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

