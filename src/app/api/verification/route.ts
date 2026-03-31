import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'src/content/verification.json');
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ status: 'unknown', lastChecked: null });
    }
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ status: 'unknown', lastChecked: null });
  }
}
