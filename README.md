# American Employers Alliance (AEA) Website

Professional website for the American Employers Alliance, a national nonprofit employer association founded in 2013.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Content**: Markdown files with gray-matter frontmatter
- **Deployment**: Railway (Docker)
- **Language**: TypeScript

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── about/
│   ├── membership/
│   ├── why-join/
│   ├── resources/          # Resource center with [slug] dynamic routes
│   ├── hr-compliance/
│   ├── employer-tools/
│   ├── programs-savings/
│   ├── benefits-programs/
│   ├── insights/           # Insights/updates with [slug] dynamic routes
│   ├── contact/
│   ├── faq/
│   ├── privacy-policy/
│   └── terms-of-use/
├── components/             # Shared React components
├── content/
│   ├── resources/          # Markdown resource articles
│   └── insights/           # Markdown insight/update articles
└── lib/
    └── content.ts          # Content loading and parsing utilities
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## Adding Content

### New Resource Article

Create a new `.md` file in `src/content/resources/`:

```markdown
---
title: "Your Resource Title"
description: "Brief description for listings and SEO."
category: "HR"          # HR, Compliance, Hiring, or Operations
date: "2024-12-01"
tags: ["tag1", "tag2"]
---

## Your content here

Write your resource content in standard Markdown.
```

### New Insight/Update

Create a new `.md` file in `src/content/insights/`:

```markdown
---
title: "Your Insight Title"
description: "Brief description."
category: "Compliance"
date: "2024-12-01"
tags: ["tag1", "tag2"]
---

## Your content here
```

Content is automatically picked up at build time. No code changes needed.

## Deployment on Railway

### Option 1: Docker (Recommended)

1. Connect your GitHub repository to Railway
2. Railway will detect the `Dockerfile` and build automatically
3. Set up a custom domain if desired

### Option 2: Nixpacks

Railway's Nixpacks will also auto-detect the Next.js app:

1. Connect your GitHub repository
2. Railway builds and deploys automatically

### Environment Variables

No environment variables are required for basic deployment. The site is fully static at build time.

## Content Categories

Resources are organized into four categories:
- **HR** — Employee management, handbooks, performance, discipline
- **Compliance** — Employment law, FMLA, OSHA, ADA, wage & hour
- **Hiring** — Recruitment, onboarding, job postings, background checks
- **Operations** — Payroll, safety, benefits, business continuity, remote work

## Customization

### Colors
Edit `tailwind.config.ts` to modify the color palette. The site uses:
- `navy` — Primary brand color (dark blues)
- `accent` — Secondary accent (greens)
- `warm` — Tertiary accent (golds)

### Typography
The site uses Inter from Google Fonts. Change the font in `src/app/layout.tsx`.

## License

All rights reserved. American Employers Alliance.
