import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/auth';
import { findMemberById, getRiskRadarCasesByMember } from '@/lib/db';

export async function GET() {
  const session = getMemberSession();
  if (!session) {
    return NextResponse.json({ error: 'Member login required.' }, { status: 401 });
  }
  const member = await findMemberById(session.memberId);
  if (!member || member.status !== 'active') {
    return NextResponse.json({ error: 'Member access required.' }, { status: 401 });
  }

  try {
    const cases = await getRiskRadarCasesByMember(member.id);
    return NextResponse.json({ cases });
  } catch (error) {
    console.error('Cases fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch cases.' }, { status: 500 });
  }
}
