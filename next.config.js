/** @type {import('next').NextConfig} */
const nextConfig = {
  // Send an X-Robots-Tag header on every response so the "do not index /
  // do not train" signal applies to all paths and asset types — not just
  // HTML pages — and is picked up by crawlers that never read the markup.
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Robots-Tag',
            value:
              'noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate, noai, noimageai',
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
