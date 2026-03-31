import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const newsDirectory = path.join(process.cwd(), 'src/content/news');

export interface NewsItem {
  slug: string;
  title: string;
  description: string;
  category: string;
  date: string;
  author: string;
  contentHtml?: string;
}

export function getAllNews(): NewsItem[] {
  if (!fs.existsSync(newsDirectory)) return [];
  return fs
    .readdirSync(newsDirectory)
    .filter((f) => f.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(newsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data } = matter(fileContents);
      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        category: data.category || 'Industry News',
        date: data.date || '2025-01-01',
        author: data.author || 'AEA Editorial Team',
      };
    })
    .sort((a, b) => (a.date > b.date ? -1 : 1));
}

export function getLatestNews(count: number): NewsItem[] {
  return getAllNews().slice(0, count);
}

export async function getNewsBySlug(slug: string): Promise<NewsItem | null> {
  const fullPath = path.join(newsDirectory, `${slug}.md`);
  if (!fs.existsSync(fullPath)) return null;
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  const { remark } = await import('remark');
  const html = await import('remark-html');
  const processed = await remark().use(html.default).process(content);
  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    category: data.category || 'Industry News',
    date: data.date || '2025-01-01',
    author: data.author || 'AEA Editorial Team',
    contentHtml: processed.toString(),
  };
}
