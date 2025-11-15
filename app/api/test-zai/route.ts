import { NextResponse } from 'next/server';
import { ZaiProvider } from '@/lib/provider/zai';

export async function GET() {
  try {
    const apiKey = process.env.ZAI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: 'ZAI_API_KEY not found in environment' },
        { status: 500 }
      );
    }

    const provider = new ZaiProvider(apiKey);
    
    const result = await provider.chatCompletion({
      messages: [
        { role: 'system', content: 'You are a helpful AI assistant.' },
        { role: 'user', content: 'Say "OK" if you can hear me.' },
      ],
      model: 'glm-4-plus',
      maxTokens: 5,
    });

    return NextResponse.json({
      success: true,
      message: 'z.ai API is working!',
      response: result.content,
      model: 'glm-4-plus',
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.stack,
      },
      { status: 500 }
    );
  }
}

