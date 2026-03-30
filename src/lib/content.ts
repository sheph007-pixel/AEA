import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const contentDirectories = [
  path.join(process.cwd(), 'src/content/resources'),
  path.join(process.cwd(), 'src/content/insights'),
];

export interface ContentItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  author: string;
  readTime: string;
  featured: boolean;
  contentHtml?: string;
}

function estimateReadTime(content: string): string {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 230));
  return `${minutes} min read`;
}

function loadFromDirectory(directory: string): ContentItem[] {
  if (!fs.existsSync(directory)) return [];
  return fs
    .readdirSync(directory)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(directory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        category: data.category || 'General',
        date: data.date || '2024-01-01',
        tags: data.tags || [],
        author: data.author || 'AEA Editorial Team',
        readTime: data.readTime || estimateReadTime(content),
        featured: data.featured || false,
      };
    });
}

let _allContent: ContentItem[] | null = null;

export function getAllContent(): ContentItem[] {
  if (_allContent) return _allContent;
  const items: ContentItem[] = [];
  for (const dir of contentDirectories) {
    items.push(...loadFromDirectory(dir));
  }
  // Dedupe by slug (in case same slug in both dirs)
  const seen = new Set<string>();
  const deduped: ContentItem[] = [];
  for (const item of items) {
    if (!seen.has(item.slug)) {
      seen.add(item.slug);
      deduped.push(item);
    }
  }
  _allContent = deduped.sort((a, b) => (a.date > b.date ? -1 : 1));
  return _allContent;
}

async function loadSingleItem(slug: string): Promise<ContentItem | null> {
  for (const dir of contentDirectories) {
    const fullPath = path.join(dir, `${slug}.md`);
    if (fs.existsSync(fullPath)) {
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
        author: data.author || 'AEA Editorial Team',
        readTime: data.readTime || estimateReadTime(content),
        featured: data.featured || false,
        contentHtml: processedContent.toString(),
      };
    }
  }
  return null;
}

// Unified accessors
export function getAllResources(): ContentItem[] {
  return getAllContent();
}

export function getResourceBySlug(slug: string): Promise<ContentItem | null> {
  return loadSingleItem(slug);
}

export function getAllInsights(): ContentItem[] {
  return getAllContent().filter(
    (c) =>
      c.category === 'Compliance' ||
      c.category === 'Operations' ||
      c.tags.some((t) => t.includes('update') || t.includes('law'))
  ).slice(0, 20);
}

export function getInsightBySlug(slug: string): Promise<ContentItem | null> {
  return loadSingleItem(slug);
}

export function getResourcesByCategory(category: string): ContentItem[] {
  return getAllContent().filter(
    (r) => r.category.toLowerCase() === category.toLowerCase()
  );
}

export function getCategories(items: ContentItem[]): string[] {
  return Array.from(new Set(items.map((i) => i.category))).sort();
}

export function getFeaturedContent(): ContentItem[] {
  return getAllContent().filter((c) => c.featured);
}

export function getRecentContent(n: number): ContentItem[] {
  return getAllContent().slice(0, n);
}

export function getContentByCategory(): Record<string, ContentItem[]> {
  const content = getAllContent();
  const grouped: Record<string, ContentItem[]> = {};
  for (const item of content) {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  }
  return grouped;
}
