import { NextResponse } from 'next/server';
import { getMemberSession, getDemoCount, incrementDemoCount, checkRateLimit } from '@/lib/auth';
import { findMemberById, saveRiskRadarCase, saveAIUsage } from '@/lib/db';
import { analyzeRisk } from '@/lib/openai';

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  if (!checkRateLimit(`rr:${ip}`, 10, 60 * 1000)) {
    return NextResponse.json({ error: 'Rate limit exceeded. Please wait a moment.' }, { status: 429 });
  }

  try {
    const { state, companySize, issueType, situation, facts } = await request.json();
    if (!state || !companySize || !issueType || !situation?.trim()) {
      return NextResponse.json({ error: 'All required fields must be provided.' }, { status: 400 });
    }
    if (situation.length > 5000) {
      return NextResponse.json({ error: 'Situation description is too long.' }, { status: 400 });
    }

    // Check member session
    const session = getMemberSession();
    let memberId: number | null = null;
    let isMember = false;

    if (session) {
      const member = await findMemberById(session.memberId);
      if (member && member.status === 'active') {
        memberId = member.id;
        isMember = true;
      }
    }

    // Demo rate limit for non-members
    if (!isMember) {
      const demo = getDemoCount();
      if (demo.count >= 2) {
        return NextResponse.json({
          error: 'demo_limit',
          message: 'You have reached the daily demo limit. Become an AEA member for unlimited access.',
        }, { status: 403 });
      }
      incrementDemoCount();
    }

    // Run analysis
    const analysis = await analyzeRisk({ state, companySize, issueType, situation, facts });

    // Save to DB
    const caseRow = await saveRiskRadarCase({
      memberId: memberId || undefined,
      state, companySize, issueType, situation, facts,
      riskAnalysis: analysis,
      isDemo: !isMember,
    });

    // Log usage
    await saveAIUsage({
      tool: 'risk-radar',
      input: `${issueType}: ${situation.substring(0, 200)}`,
      output: analysis.risk_level,
      state,
      employeeCount: companySize,
    }).catch(console.error);

    // For demo users, truncate the response
    if (!isMember) {
      return NextResponse.json({
        caseId: caseRow.id,
        isMember: false,
        analysis: {
          ...analysis,
          concerns: analysis.concerns.slice(0, 2),
          next_steps: analysis.next_steps.slice(0, 2),
          avoid: analysis.avoid.slice(0, 1),
          documentation_checklist: [],
          suggested_document_type: null,
          suggested_document_title: null,
        },
      });
    }

    return NextResponse.json({ caseId: caseRow.id, isMember: true, analysis });
  } catch (error) {
    console.error('Risk Radar analyze error:', error);
    return NextResponse.json({ error: 'Analysis failed. Please try again.' }, { status: 500 });
  }
}
