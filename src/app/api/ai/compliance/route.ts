import { NextResponse } from 'next/server';
import { checkCompliance } from '@/lib/openai';
import { saveAIUsage } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { state, employeeCount, industry } = await request.json();
    if (!state || !employeeCount || !industry) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }
    const checklist = await checkCompliance(state, employeeCount, industry);
    await saveAIUsage({ tool: 'compliance-checker', input: `${state}, ${employeeCount}, ${industry}`, output: checklist, state, employeeCount, industry }).catch(console.error);
    return NextResponse.json({ checklist });
  } catch (error) {
    console.error('Compliance checker error:', error);
    return NextResponse.json({ error: 'Failed to generate checklist' }, { status: 500 });
  }
}
