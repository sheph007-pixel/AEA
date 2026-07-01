/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't advertise the framework — less fingerprinting for scrapers.
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // "Do not index / do not train" on every path and asset type —
          // not just HTML — so crawlers that never read the markup still
          // see it. This is the header form of the noindex meta tags.
          {
            key: 'X-Robots-Tag',
            value:
              'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai',
          },
          // Stop the site being embedded/scraped through an iframe.
          { key: 'X-Frame-Options', value: 'DENY' },
          // Don't leak the URL to other sites when a member clicks out.
          { key: 'Referrer-Policy', value: 'no-referrer' },
          // Block MIME-type sniffing.
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Lock down powerful browser features by default.
          {
            key: 'Permissions-Policy',
            value:
              'camera=(), microphone=(), geolocation=(), browsing-topics=(), interest-cohort=()',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
