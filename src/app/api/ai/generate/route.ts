import { NextResponse } from 'next/server';
import { generateDocument } from '@/lib/openai';
import { saveAIUsage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { docType, state, companyName, details } = await request.json();
    if (!docType || !state) {
      return NextResponse.json({ error: 'Document type and state are required' }, { status: 400 });
    }
    const document = await generateDocument(docType, state, companyName || 'Your Company', details || '');
    await saveAIUsage({ tool: 'document-generator', input: `${docType} - ${state} - ${companyName}`, output: document, state }).catch(console.error);
    return NextResponse.json({ document });
  } catch (error) {
    console.error('Generator error:', error);
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 });
  }
}
