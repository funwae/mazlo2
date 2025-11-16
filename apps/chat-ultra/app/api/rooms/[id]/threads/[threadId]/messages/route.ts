import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { messages, rooms } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';
import { handleUserMessage } from '@/lib/orchestrator/mazlo';
import { z } from 'zod';

const sendMessageSchema = z.object({
  content: z.string().min(1),
  mode: z.enum(['chat', 'translate', 'code', 'critique']).default('chat'),
  provider: z.string().optional(),
  model: z.string().optional(),
});

export async function GET(
  request: Request,
  { params }: { params: { id: string; threadId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const messageList = await db
      .select()
      .from(messages)
      .where(eq(messages.threadId, params.threadId))
      .orderBy(messages.createdAt);

    return NextResponse.json({ messages: messageList });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(
  request: Request,
  { params }: { params: { id: string; threadId: string } }
) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify room ownership
    const room = await db.query.rooms.findFirst({
      where: and(eq(rooms.id, params.id), eq(rooms.userId, session.user.id)),
    });

    if (!room) {
      return NextResponse.json({ error: 'Room not found' }, { status: 404 });
    }

    const body = await request.json();
    const data = sendMessageSchema.parse(body);

    // Create a readable stream for SSE
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          if (!user) {
            throw new Error('Unauthorized');
          }

          for await (const chunk of handleUserMessage({
            roomId: params.id,
            threadId: params.threadId,
            userMessage: data.content,
            userId: user.id,
            mode: 'room',
            provider: data.provider,
            model: data.model,
          })) {
            const message = `data: ${JSON.stringify(chunk)}\n\n`;
            controller.enqueue(encoder.encode(message));
          }
          controller.close();
        } catch (error: any) {
          const errorMessage = `data: ${JSON.stringify({ type: 'error', error: error.message })}\n\n`;
          controller.enqueue(encoder.encode(errorMessage));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error sending message:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

