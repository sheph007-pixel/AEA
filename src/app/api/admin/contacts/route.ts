import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { listContacts } from '@/lib/db';

export async function GET() {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const contacts = await listContacts();
  return NextResponse.json({ contacts });
}
