import { NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/auth';
import { updateMemberStatus } from '@/lib/db';

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  if (!getAdminSession()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { status } = await request.json();
    if (!['active', 'inactive', 'revoked'].includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
    }
    await updateMemberStatus(parseInt(params.id), status);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update member error:', error);
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 });
  }
}
