import { NextResponse } from 'next/server';
import { reviewPolicy } from '@/lib/openai';
import { saveAIUsage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { document, documentType } = await request.json();
    if (!document?.trim()) {
      return NextResponse.json({ error: 'Document text is required' }, { status: 400 });
    }
    const review = await reviewPolicy(document, documentType || 'policy document');
    await saveAIUsage({ tool: 'policy-reviewer', input: document.substring(0, 500), output: review }).catch(console.error);
    return NextResponse.json({ review });
  } catch (error) {
    console.error('Review error:', error);
    return NextResponse.json({ error: 'Failed to review document' }, { status: 500 });
  }
}
