import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/auth';
import { findMemberById } from '@/lib/db';

export async function GET() {
  const session = getMemberSession();
  if (!session) {
    return NextResponse.json({ authenticated: false });
  }
  // Verify member still active in DB
  const member = await findMemberById(session.memberId);
  if (!member || member.status !== 'active') {
    return NextResponse.json({ authenticated: false });
  }
  return NextResponse.json({
    authenticated: true,
    member: { id: member.id, name: member.name, company: member.company },
  });
}
