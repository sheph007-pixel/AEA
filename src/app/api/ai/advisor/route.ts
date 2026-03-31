import { NextResponse } from 'next/server';
import { askAdvisor } from '@/lib/openai';
import { saveAIUsage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { question } = await request.json();
    if (!question?.trim()) {
      return NextResponse.json({ error: 'Question is required' }, { status: 400 });
    }
    const answer = await askAdvisor(question);
    await saveAIUsage({ tool: 'advisor', input: question, output: answer }).catch(console.error);
    return NextResponse.json({ answer });
  } catch (error) {
    console.error('Advisor error:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
