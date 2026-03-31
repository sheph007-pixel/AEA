import { NextResponse } from 'next/server';
import { clearMemberSession } from '@/lib/auth';

export async function POST() {
  clearMemberSession();
  return NextResponse.json({ success: true });
}
