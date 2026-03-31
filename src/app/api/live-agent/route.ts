import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { checkRateLimit } from '@/lib/auth';

function getClient() {
  return new OpenAI({ apiKey: process.env.ChatGPT || 'missing' });
}

const SYSTEM_PROMPT = `You are a friendly, professional team member at the American Employers Alliance (AEA), a national employer association that helps businesses with 2-500 employees.

Your role is to warmly greet visitors, answer basic questions about AEA, and connect them with the right person on the team. You are NOT an HR advisor or legal expert. You are a real person having a conversation.

RULES:
- Be warm, conversational, and helpful. Use short messages like a real person chatting.
- Keep responses to 1-3 sentences max. Sound human, not like a bot.
- If someone asks about membership, pricing, or specific programs, say something like "I'd love to get you connected with someone on the team who can walk you through that. Can I grab your name and email?"
- If someone asks a specific HR, legal, or compliance question, say "That's a great question - I want to make sure you get the right answer on that. Let me connect you with one of our team members. Can I get your contact info?"
- NEVER answer specific HR, legal, compliance, or employment law questions directly.
- NEVER give legal advice or specific regulatory guidance.
- Your goal is ALWAYS to collect their name and email so a real team member can follow up.
- After 2-3 exchanges, naturally steer toward collecting their contact info.
- Use first names if they share them.
- If they ask what AEA does, keep it brief: "We help employers stay compliant, reduce costs, and access tools and resources - things like our AI-powered Risk Radar, compliance guides, and group programs."
- If they ask about Risk Radar or AI tools, say "You can try Risk Radar right on our site - it's really helpful for assessing HR situations. Want me to point you there?"

When you want the system to show the contact form, include exactly this marker at the end of your message: [COLLECT_CONTACT]

Sound like a real person, not a chatbot. Use casual-professional tone. No bullet points. No formal greetings like "Thank you for reaching out to AEA."`;

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`agent:${ip}`, 20, 60 * 1000)) {
    return NextResponse.json({ reply: "Give me just a moment - we're getting a lot of messages right now. Try again in a minute!", collectContact: false });
  }

  try {
    const { message, history } = await request.json();
    if (!message?.trim()) {
      return NextResponse.json({ reply: "Sorry, I didn't catch that. What can I help you with?", collectContact: false });
    }

    const response = await getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...(history ? [{ role: 'user' as const, content: `Previous conversation:\n${history}` }] : []),
        { role: 'user', content: message },
      ],
      max_tokens: 200,
      temperature: 0.7,
    });

    let reply = response.choices[0]?.message?.content || "Sorry, I'm having trouble right now. Can you try that again?";
    const collectContact = reply.includes('[COLLECT_CONTACT]');
    reply = reply.replace('[COLLECT_CONTACT]', '').trim();

    return NextResponse.json({ reply, collectContact });
  } catch (error) {
    console.error('Live agent error:', error);
    return NextResponse.json({
      reply: "I'm sorry, I'm having a connection issue. You can also reach us through the Contact page. Would you like me to direct you there?",
      collectContact: false,
    });
  }
}
