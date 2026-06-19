import type { MetadataRoute } from 'next';

/**
 * Block every crawler, search engine, and AI/LLM training bot.
 *
 * `*` already covers every compliant user-agent, but the major AI/scraper
 * bots are listed explicitly so the intent is unmistakable and so that
 * operators auditing the file can see them by name. None are given any
 * Allow rule — the entire site is off-limits.
 *
 * NOTE: robots.txt is advisory. Well-behaved crawlers (Google, Bing,
 * OpenAI, Anthropic, etc.) obey it; malicious scrapers can ignore it.
 * It is paired with `noindex` meta tags and an `X-Robots-Tag` header
 * (see layout.tsx and next.config.js) for the strongest opt-out signal.
 */
const blockedBots = [
  '*',
  // Search engines
  'Googlebot',
  'Googlebot-Image',
  'Googlebot-News',
  'Bingbot',
  'Slurp', // Yahoo
  'DuckDuckBot',
  'Baiduspider',
  'YandexBot',
  'Sogou',
  'Exabot',
  'facebookexternalhit',
  'facebookcatalog',
  'ia_archiver', // Alexa / Internet Archive
  'archive.org_bot',
  // AI / LLM training & retrieval crawlers
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'anthropic-ai',
  'Google-Extended',
  'Applebot',
  'Applebot-Extended',
  'CCBot', // Common Crawl
  'PerplexityBot',
  'Perplexity-User',
  'Amazonbot',
  'Bytespider', // ByteDance / TikTok
  'Meta-ExternalAgent',
  'meta-externalagent',
  'FacebookBot',
  'Diffbot',
  'Omgilibot',
  'Omgili',
  'cohere-ai',
  'cohere-training-data-crawler',
  'YouBot',
  'AI2Bot',
  'Timpibot',
  'ImagesiftBot',
  'Scrapy',
  'magpie-crawler',
  'DataForSeoBot',
  'SemrushBot',
  'AhrefsBot',
  'MJ12bot',
  'PetalBot',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: blockedBots.map((userAgent) => ({
      userAgent,
      disallow: '/',
    })),
    // Intentionally no sitemap — we do not want anything discovered.
  };
}
