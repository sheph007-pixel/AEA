import { NextResponse } from 'next/server';
import { getAdminSession, hashCode, generateCode } from '@/lib/auth';
import { listMemberCodes, createMemberCode } from '@/lib/db';

export async function GET() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const members = await listMemberCodes();
  return NextResponse.json({ members });
}

export async function POST(request: Request) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { name, company, email, expiresAt } = await request.json();
    if (!name?.trim()) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }
    const plainCode = generateCode();
    const codeHash = hashCode(plainCode);
    const member = await createMemberCode({ codeHash, name, company, email, expiresAt });
    return NextResponse.json({ code: plainCode, member });
  } catch (error) {
    console.error('Create member error:', error);
    return NextResponse.json({ error: 'Failed to create member code' }, { status: 500 });
  }
}
