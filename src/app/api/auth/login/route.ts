import { NextResponse } from 'next/server';
import { hashCode, setMemberSession, checkRateLimit } from '@/lib/auth';
import { findMemberByCodeHash, updateMemberLastUsed, sendNotification } from '@/lib/db';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`login:${ip}`, 5, 15 * 60 * 1000)) {
    return NextResponse.json({ error: 'Too many attempts. Try again in 15 minutes.' }, { status: 429 });
  }

  try {
    const { code } = await request.json();
    if (!code?.trim()) {
      return NextResponse.json({ error: 'Member code is required.' }, { status: 400 });
    }

    const codeHash = hashCode(code.trim().toUpperCase());
    const member = await findMemberByCodeHash(codeHash);

    if (!member) {
      return NextResponse.json({ error: 'Invalid member code.' }, { status: 401 });
    }
    if (member.status !== 'active') {
      return NextResponse.json({ error: 'This member code is no longer active.' }, { status: 401 });
    }
    if (member.expires_at && new Date(member.expires_at) < new Date()) {
      return NextResponse.json({ error: 'This member code has expired.' }, { status: 401 });
    }

    setMemberSession(member.id, member.name, member.company);
    await updateMemberLastUsed(member.id);
    await sendNotification(
      `AEA Member Login: ${member.name}`,
      `<p>Member <strong>${member.name}</strong> (${member.company || 'N/A'}) logged in.</p>`
    ).catch(() => {});

    return NextResponse.json({ success: true, member: { name: member.name, company: member.company } });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
