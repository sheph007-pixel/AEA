import { NextResponse } from 'next/server';
import { saveSubmission, sendNotification } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, email, company, employees, interest, message } = body;

    // Save to database
    const row = await saveSubmission({
      formType: 'contact',
      firstName,
      lastName,
      email,
      company,
      employees,
      interest,
      message,
    });

    // Send notification email
    await sendNotification(
      `AEA Contact: ${firstName} ${lastName} - ${interest || 'General'}`,
      `<h2>New Contact Form Submission</h2>
       <table style="border-collapse:collapse;width:100%;max-width:600px;">
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Name</td><td style="padding:8px;border-bottom:1px solid #eee;">${firstName} ${lastName}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Email</td><td style="padding:8px;border-bottom:1px solid #eee;">${email}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Organization</td><td style="padding:8px;border-bottom:1px solid #eee;">${company || '-'}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Employees</td><td style="padding:8px;border-bottom:1px solid #eee;">${employees || '-'}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Interest</td><td style="padding:8px;border-bottom:1px solid #eee;">${interest || '-'}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Message</td><td style="padding:8px;border-bottom:1px solid #eee;">${message || '-'}</td></tr>
         <tr><td style="padding:8px;font-weight:bold;border-bottom:1px solid #eee;">Saved</td><td style="padding:8px;border-bottom:1px solid #eee;">ID #${row.id} at ${row.created_at}</td></tr>
       </table>`
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json({ error: 'Failed to process submission' }, { status: 500 });
  }
}
