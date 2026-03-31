import { NextResponse } from 'next/server';
import { saveSubmission, sendNotification } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, message } = body;

    // Save to database
    const row = await saveSubmission({
      formType: 'chat',
      firstName: name,
      email,
      message,
    });

    // Send notification email
    await sendNotification(
      `AEA Chat Widget: ${name} - ${email}`,
      `<h2>New Chat Widget Contact</h2>
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${name}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Message</td><td style="padding:8px;border-bottom:1px solid #eee;white-space:pre-wrap;">${message || '-'}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Saved</td><td style="padding:8px;border-bottom:1px solid #eee;">ID #${row.id} at ${row.created_at}</td></tr>
       </table>`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Chat form error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
