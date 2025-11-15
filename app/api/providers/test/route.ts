import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { getProvider } from '@/lib/provider';
import { z } from 'zod';

const testProviderSchema = z.object({
  provider: z.enum(['openai', 'zai']),
  apiKey: z.string().min(1),
});

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
    const data = testProviderSchema.parse(body);

    // Get provider instance
    const provider = getProvider(data.provider, data.apiKey);

    // Test with a simple completion
    try {
      const model = data.provider === 'openai' 
        ? 'gpt-3.5-turbo' 
        : 'glm-4-plus'; // Use correct z.ai model name
      
      await provider.chatCompletion({
        messages: [
          { role: 'system', content: 'You are a test assistant.' },
          { role: 'user', content: 'Say "test" if you can read this.' },
        ],
        model,
        maxTokens: 10,
      });

      return NextResponse.json({ success: true, message: 'Connection successful' });
    } catch (error: any) {
      return NextResponse.json(
        { error: `Connection failed: ${error.message || 'Unknown error'}` },
        { status: 400 }
      );
    }
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid input', details: error.errors }, { status: 400 });
    }
    console.error('Error testing provider:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

