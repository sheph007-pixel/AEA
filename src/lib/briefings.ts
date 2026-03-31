import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const briefingsDirectory = path.join(process.cwd(), 'src/content/briefings');

export interface BriefingItem {
  slug: string;
  title: string;
  description: string;
  type: string; // monthly-briefing | trends-report | compliance-alert | industry-snapshot | employer-questions
  date: string;
  month: string; // YYYY-MM
  author: string;
  tags: string[];
  contentHtml?: string;
}

export function getAllBriefings(): BriefingItem[] {
  if (!fs.existsSync(briefingsDirectory)) return [];
  return fs
    .readdirSync(briefingsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(briefingsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        type: data.type || 'monthly-briefing',
        date: data.date || '2025-01-01',
        month: data.month || data.date?.substring(0, 7) || '2025-01',
        author: data.author || 'AEA Editorial Team',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getBriefingBySlug(slug: string): Promise<BriefingItem | null> {
  const fullPath = path.join(briefingsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    type: data.type || 'monthly-briefing',
    date: data.date || '2025-01-01',
    month: data.month || data.date?.substring(0, 7) || '2025-01',
    author: data.author || 'AEA Editorial Team',
    tags: data.tags || [],
    contentHtml: processedContent.toString(),
  };
}

export function getLatestBriefings(count: number): BriefingItem[] {
  return getAllBriefings().slice(0, count);
}

export function getBriefingsByType(type: string): BriefingItem[] {
  return getAllBriefings().filter((b) => b.type === type);
}

export function getLatestMonthlyBriefing(): BriefingItem | null {
  return getAllBriefings().find((b) => b.type === 'monthly-briefing') || null;
}

export function getBriefingTypes(): string[] {
  return Array.from(new Set(getAllBriefings().map((b) => b.type))).sort();
}

const TYPE_LABELS: Record<string, string> = {
  'monthly-briefing': 'Monthly Briefing',
  'trends-report': 'Trends Report',
  'compliance-alert': 'Compliance Alert',
  'industry-snapshot': 'Industry Snapshot',
  'employer-questions': 'What Employers Are Asking',
};

export function getTypeLabel(type: string): string {
  return TYPE_LABELS[type] || type;
}
