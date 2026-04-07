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

  return NextResponse.json([...briefings, ...news, ...resources]);
}
