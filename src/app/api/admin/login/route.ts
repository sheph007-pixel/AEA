import { NextResponse } from 'next/server';
import { verifyAdminSecret, setAdminSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { secret } = await request.json();
    if (!secret || !verifyAdminSecret(secret)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }
    setAdminSession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Login failed.' }, { status: 500 });
  }
}
