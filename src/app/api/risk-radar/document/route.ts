import { NextResponse } from 'next/server';
import { getMemberSession } from '@/lib/auth';
import { findMemberById, getRiskRadarCase, saveRiskRadarDocument } from '@/lib/db';
import { generateRiskDocument } from '@/lib/openai';

export async function POST(request: Request) {
  // Members only
  const session = getMemberSession();
  if (!session) {
    return NextResponse.json({ error: 'Member login required.' }, { status: 401 });
  }
  const member = await findMemberById(session.memberId);
  if (!member || member.status !== 'active') {
    return NextResponse.json({ error: 'Member access required.' }, { status: 401 });
  }

  try {
    const { caseId, documentType } = await request.json();
    if (!caseId || !documentType) {
      return NextResponse.json({ error: 'Case ID and document type are required.' }, { status: 400 });
    }

    const validTypes = ['Written Warning', 'Termination Letter', 'PIP', 'Documentation Memo'];
    if (!validTypes.includes(documentType)) {
      return NextResponse.json({ error: 'Invalid document type.' }, { status: 400 });
    }

    const riskCase = await getRiskRadarCase(caseId);
    if (!riskCase || riskCase.member_id !== member.id) {
      return NextResponse.json({ error: 'Case not found.' }, { status: 404 });
    }

    const document = await generateRiskDocument({
      documentType,
      state: riskCase.state,
      situation: riskCase.situation,
      companySize: riskCase.company_size,
    });

    await saveRiskRadarDocument({ caseId, documentType, documentBody: document });

    return NextResponse.json({ document, documentType });
  } catch (error) {
    console.error('Document generation error:', error);
    return NextResponse.json({ error: 'Document generation failed.' }, { status: 500 });
  }
}
