import { NextResponse } from 'next/server';
import { getAllContent } from '@/lib/content';
import { getAllBriefings, getTypeLabel } from '@/lib/briefings';
import { getAllNews } from '@/lib/news';

export async function GET() {
  const resources = getAllContent().map((item) => ({
    title: item.title,
    description: item.description,
    category: item.category,
    slug: item.slug,
    href: `/resources/${item.slug}`,
    source: 'Resources',
  }));

  const briefings = getAllBriefings().map((item) => ({
    title: item.title,
    description: item.description,
    category: getTypeLabel(item.type),
    slug: item.slug,
    href: `/briefings/${item.slug}`,
    source: 'Briefings',
  }));

  const news = getAllNews().map((item) => ({
    title: item.title,
    description: item.description,
    category: item.category,
    slug: item.slug,
    href: `/news/${item.slug}`,
    source: 'News',
  }));

  // Dedupe by href to prevent the same content appearing multiple times
  const all = [...briefings, ...news, ...resources];
  const seen = new Set<string>();
  const deduped = all.filter((item) => {
    if (seen.has(item.href)) return false;
    seen.add(item.href);
    return true;
  });

  return NextResponse.json(deduped);
}
