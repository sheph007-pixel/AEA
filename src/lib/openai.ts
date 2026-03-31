import OpenAI from 'openai';

function getClient() {
  return new OpenAI({
    apiKey: process.env.ChatGPT || 'missing',
  });
}

const SYSTEM_BASE = `You are an AI assistant for the American Employers Alliance (AEA), a national employer association that helps businesses with 2-500 employees. You provide practical, accurate guidance on HR management, employment law compliance, workplace safety, benefits, and employer operations.

Important rules:
- Give practical, actionable advice
- Reference specific laws and regulations by name (FMLA, ADA, FLSA, OSHA, Title VII, etc.) when relevant
- Always note that employment law varies by state and recommend consulting legal counsel for specific situations
- Never invent statistics, case studies, or legal citations
- Be direct and professional in tone
- If you don't know something, say so`;

export async function askAdvisor(question: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_BASE}\n\nYou are the AEA HR & Compliance Advisor. Answer employer questions about HR, compliance, hiring, terminations, benefits, workplace policies, and employment law. Keep answers concise but thorough (2-4 paragraphs). End with a practical next step the employer can take.`,
      },
      { role: 'user', content: question },
    ],
    max_tokens: 800,
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content || 'Unable to generate a response.';
}

export async function checkCompliance(state: string, employeeCount: string, industry: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_BASE}\n\nYou are the AEA Compliance Checker. Generate a personalized compliance checklist for the employer based on their state, employee count, and industry. Format the output as a structured checklist with categories (Federal Requirements, State Requirements, Industry-Specific). Use checkboxes (- [ ]) format. Include specific law names and brief descriptions of what each requires.`,
      },
      {
        role: 'user',
        content: `Generate a compliance checklist for my business:\n- State: ${state}\n- Number of employees: ${employeeCount}\n- Industry: ${industry}`,
      },
    ],
    max_tokens: 1500,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content || 'Unable to generate checklist.';
}

export async function reviewPolicy(document: string, documentType: string): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_BASE}\n\nYou are the AEA Policy & Document Reviewer. Review the submitted document for:\n1. Legal compliance risks\n2. Missing required language\n3. ADA/FMLA/Title VII concerns\n4. Clarity and enforceability issues\n5. State-specific considerations\n\nFormat your review with clear sections: Summary, Issues Found, Recommendations. Be specific about what needs to change and why.`,
      },
      {
        role: 'user',
        content: `Please review this ${documentType}:\n\n${document}`,
      },
    ],
    max_tokens: 1200,
    temperature: 0.2,
  });
  return response.choices[0]?.message?.content || 'Unable to generate review.';
}

export async function generateDocument(
  docType: string,
  state: string,
  companyName: string,
  details: string
): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_BASE}\n\nYou are the AEA Document Generator. Generate professional, legally-informed employer documents. Include appropriate disclaimers, at-will language where applicable, and state-specific considerations. The document should be ready to customize and use. Format with clear headings and professional language.`,
      },
      {
        role: 'user',
        content: `Generate a ${docType} for:\n- Company: ${companyName}\n- State: ${state}\n- Details: ${details}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content || 'Unable to generate document.';
}
