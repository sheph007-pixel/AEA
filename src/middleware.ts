import { NextRequest, NextResponse } from 'next/server';

/**
 * Hard-block known crawlers, scrapers, and AI/LLM bots at the edge.
 *
 * Unlike robots.txt and the noindex/X-Robots-Tag signals (which are
 * advisory and rely on the bot choosing to obey), this middleware runs on
 * every request and returns 403 to any user-agent matching the patterns
 * below — so even a non-compliant scraper gets refused content.
 *
 * This is best-effort: a determined scraper can spoof its user-agent to
 * look like a normal browser. For airtight protection, pair this with an
 * edge WAF (e.g. Cloudflare "Block AI Bots" + bot-fight mode) in front of
 * the deployment and keep real content behind the member login.
 */

// Matched case-insensitively against the User-Agent header. Substrings are
// enough — e.g. "bot" would be too broad, so we use distinctive tokens.
const BLOCKED_UA_PATTERNS = [
  // Search engines
  'googlebot',
  'bingbot',
  'slurp',
  'duckduckbot',
  'baiduspider',
  'yandexbot',
  'yandex.com/bots',
  'sogou',
  'exabot',
  'ia_archiver',
  'archive.org_bot',
  'facebookexternalhit',
  'facebookcatalog',
  'facebookbot',
  // AI / LLM training & retrieval crawlers
  'gptbot',
  'oai-searchbot',
  'chatgpt-user',
  'claudebot',
  'claude-web',
  'anthropic-ai',
  'google-extended',
  'applebot',
  'ccbot',
  'perplexitybot',
  'perplexity-user',
  'amazonbot',
  'bytespider',
  'meta-externalagent',
  'meta-externalfetcher',
  'diffbot',
  'omgili',
  'omgilibot',
  'cohere-ai',
  'cohere-training-data-crawler',
  'youbot',
  'ai2bot',
  'timpibot',
  'imagesiftbot',
  'magpie-crawler',
  'dataforseobot',
  'semrushbot',
  'ahrefsbot',
  'mj12bot',
  'petalbot',
  'dotbot',
  'bytedance',
  // Generic scraping toolkits / libraries
  'scrapy',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'httpx',
  'go-http-client',
  'okhttp',
  'libwww-perl',
  'wget',
  'curl/',
  'node-fetch',
  'axios/',
  'headlesschrome',
  'phantomjs',
  'puppeteer',
  'playwright',
];

// Always let these through, even though they look automated — they keep the
// deployment healthy. Checked before the block list.
const ALLOWED_UA_PATTERNS = [
  'railwayhealthcheck', // Railway platform health probe -> healthcheckPath "/"
  'uptimerobot',
];

export function middleware(request: NextRequest) {
  const ua = (request.headers.get('user-agent') || '').toLowerCase();

  if (ALLOWED_UA_PATTERNS.some((pattern) => ua.includes(pattern))) {
    return NextResponse.next();
  }

  // Empty user-agent is a common scraper signature; refuse it too.
  const isBlocked =
    ua === '' || BLOCKED_UA_PATTERNS.some((pattern) => ua.includes(pattern));

  if (isBlocked) {
    return new NextResponse('Access denied.', {
      status: 403,
      headers: {
        'X-Robots-Tag': 'noindex, nofollow, noarchive, noai, noimageai',
        'Cache-Control': 'no-store',
      },
    });
  }

  return NextResponse.next();
}

// Run on everything except Next.js internals and the public icons, so the
// favicon still loads in browsers and assets aren't needlessly processed.
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.svg|icon.svg).*)'],
};
