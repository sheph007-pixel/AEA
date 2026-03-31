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

// -- Risk Radar --

export interface RiskAnalysis {
  risk_level: string;
  summary: string;
  concerns: string[];
  next_steps: string[];
  avoid: string[];
  documentation_checklist: string[];
  suggested_document_type: string | null;
  suggested_document_title: string | null;
  disclaimer: string;
}

const RISK_RADAR_SYSTEM = `${SYSTEM_BASE}

You are the AEA Risk Radar. An employer is describing an employment situation they need to assess before taking action. Analyze the legal and practical risk.

You MUST respond with valid JSON matching this exact structure:
{
  "risk_level": "Low" or "Medium" or "High",
  "summary": "2-3 sentence plain-language risk summary",
  "concerns": ["specific legal/practical concern 1", "concern 2"],
  "next_steps": ["recommended action 1", "action 2"],
  "avoid": ["thing to avoid 1", "thing to avoid 2"],
  "documentation_checklist": ["document/record needed 1", "item 2"],
  "suggested_document_type": "Written Warning" or "Termination Letter" or "PIP" or "Documentation Memo" or null,
  "suggested_document_title": "Title of suggested document" or null,
  "disclaimer": "AEA Risk Radar provides general HR and workplace guidance for employers. It is not legal advice and does not create an attorney-client relationship. Consult qualified legal counsel before taking employment action."
}

Risk level guide:
- Low: Standard situation, well-documented, clear policy basis
- Medium: Some risk factors present, needs careful handling
- High: Significant legal exposure, protected class or leave issues, poor documentation

Consider:
- State-specific employment laws for the given state
- Company size thresholds (FMLA 50+, ADA 15+, Title VII 15+, ADEA 20+)
- Protected class implications
- Documentation adequacy
- Timing concerns (proximity to protected activity)
- At-will vs implied contract issues

Be conservative. When in doubt, rate risk higher rather than lower.`;

export async function analyzeRisk(input: {
  state: string;
  companySize: string;
  issueType: string;
  situation: string;
  facts?: string;
}): Promise<RiskAnalysis> {
  const userMessage = `State: ${input.state}
Company size: ${input.companySize} employees
Issue type: ${input.issueType}
Situation: ${input.situation}
${input.facts ? `Additional facts: ${input.facts}` : ''}`;

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: RISK_RADAR_SYSTEM },
      { role: 'user', content: userMessage },
    ],
    max_tokens: 1500,
    temperature: 0.2,
    response_format: { type: 'json_object' },
  });

  const raw = response.choices[0]?.message?.content || '{}';
  try {
    const parsed = JSON.parse(raw);
    return {
      risk_level: parsed.risk_level || 'Medium',
      summary: parsed.summary || 'Unable to fully assess this situation.',
      concerns: Array.isArray(parsed.concerns) ? parsed.concerns : [],
      next_steps: Array.isArray(parsed.next_steps) ? parsed.next_steps : [],
      avoid: Array.isArray(parsed.avoid) ? parsed.avoid : [],
      documentation_checklist: Array.isArray(parsed.documentation_checklist) ? parsed.documentation_checklist : [],
      suggested_document_type: parsed.suggested_document_type || null,
      suggested_document_title: parsed.suggested_document_title || null,
      disclaimer: parsed.disclaimer || 'AEA Risk Radar provides general HR guidance. Consult legal counsel for specific situations.',
    };
  } catch {
    return {
      risk_level: 'Medium',
      summary: 'We were unable to fully parse the analysis. Please try again.',
      concerns: ['Analysis could not be completed'],
      next_steps: ['Consult with an HR professional or employment attorney'],
      avoid: ['Taking action without proper guidance'],
      documentation_checklist: ['Document all relevant facts'],
      suggested_document_type: null,
      suggested_document_title: null,
      disclaimer: 'AEA Risk Radar provides general HR guidance. Consult legal counsel for specific situations.',
    };
  }
}

export async function generateRiskDocument(input: {
  documentType: string;
  state: string;
  situation: string;
  companySize: string;
}): Promise<string> {
  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `${SYSTEM_BASE}

You are the AEA Risk Radar Document Generator. Generate a professional ${input.documentType} based on the employment situation provided. The document should:
1. Be appropriate for ${input.state} employment law
2. Include at-will language where applicable
3. Reference specific issues from the situation
4. Include placeholders: [DATE], [EMPLOYEE NAME], [MANAGER NAME], [COMPANY NAME]
5. Be ready for an employer to customize and use
6. End with: "This document was generated using AEA Risk Radar as a template. It should be reviewed by qualified counsel before use."

Format professionally with clear headings.`,
      },
      {
        role: 'user',
        content: `Generate a ${input.documentType} for this situation:\n\nState: ${input.state}\nCompany size: ${input.companySize}\nSituation: ${input.situation}`,
      },
    ],
    max_tokens: 2000,
    temperature: 0.3,
  });
  return response.choices[0]?.message?.content || 'Unable to generate document.';
}
