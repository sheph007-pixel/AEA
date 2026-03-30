import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const resourcesDirectory = path.join(process.cwd(), 'src/content/resources');
const insightsDirectory = path.join(process.cwd(), 'src/content/insights');

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  contentHtml?: string;
}

function getContentItems(directory: string): ContentItem[] {
  if (!fs.existsSync(directory)) return [];
  const fileNames = fs.readdirSync(directory);
  const items = fileNames
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        category: data.category || 'General',
        date: data.date || '2024-01-01',
        tags: data.tags || [],
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
  return items;
}

async function getContentItem(
  directory: string,
  slug: string
): Promise<ContentItem | null> {
  const fullPath = path.join(directory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const processedContent = await remark().use(html).process(content);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'General',
    date: data.date || '2024-01-01',
    tags: data.tags || [],
    contentHtml: processedContent.toString(),
  };
}

export function getAllResources(): ContentItem[] {
  return getContentItems(resourcesDirectory);
}

export function getResourceBySlug(slug: string): Promise<ContentItem | null> {
  return getContentItem(resourcesDirectory, slug);
}

export function getAllInsights(): ContentItem[] {
  return getContentItems(insightsDirectory);
}

export function getInsightBySlug(slug: string): Promise<ContentItem | null> {
  return getContentItem(insightsDirectory, slug);
}

export function getResourcesByCategory(category: string): ContentItem[] {
  return getAllResources().filter(
    (r) => r.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(items: ContentItem[]): string[] {
  return Array.from(new Set(items.map((i) => i.category))).sort();
}
