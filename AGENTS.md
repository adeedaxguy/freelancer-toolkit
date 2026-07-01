# FreelTools.com — Project Context Prompt

Paste this at the start of any new Codex chat or Codex session before asking it to work on this project.

---

## Project Overview

You are working on **freeltools.com** — a Next.js 14 website offering free tools for freelancers and agencies (rate calculators, invoice generator, proposal generator, etc.). It is deployed on **Vercel** (project: `freelancetools`, org: `team_Ezy8R0xRC7D9rpBexkDuXPsv`).

**Owner:** Adnan (adnan@technodigg.com)  
**Repo location:** The working directory IS the project root.

---

## Tech Stack

- **Framework:** Next.js 14 (App Router), TypeScript, React 18
- **Styling:** Tailwind CSS
- **Content:** MDX blog posts via `next-mdx-remote`, gray-matter
- **Email:** Resend (for transactional), ConvertKit/Drip (for subscribers)
- **PDF export:** jspdf + html2canvas
- **Deployment:** Vercel (auto-deploys on push to main)
- **Dev server:** `npm run dev` (runs on port 3001)

---

## Project Structure

```
src/
  app/
    page.tsx                  # Homepage (lists all tools)
    layout.tsx                # Root layout
    blog/[slug]/page.tsx      # Blog post pages
    tools/[tool-slug]/        # Each tool has its own route
      page.tsx                # Main tool page
      [variant]/page.tsx      # Programmatic SEO variant pages
    admin/                    # Password-protected admin dashboard
      blog/                   # Blog CRUD
      subscribers/            # ConvertKit subscriber view
      traffic/                # Pageview analytics
      seo/                    # SEO management
    api/                      # API routes
      generate/route.ts       # Codex AI generation endpoint
      subscribe/route.ts      # Email capture
      pageview/route.ts       # Analytics tracking
      admin/                  # Admin-only API routes
  components/
    calculators/              # One component per tool (the actual UI)
    ToolPageShell.tsx         # Shared wrapper for all tool pages
    Header.tsx / Footer.tsx
    EmailCapture.tsx          # Email opt-in component
  lib/
    tools.ts                  # SINGLE SOURCE OF TRUTH for all tool metadata
    blog.ts                   # Blog utilities
    pageFactory.tsx           # Factory for programmatic variant pages
  content/
    blog/                     # MDX blog posts
```

---

## The Most Important File: `src/lib/tools.ts`

All tool definitions live here. Each tool has:
- `slug` — URL path (e.g., `freelancer-rate-calculator`)
- `title`, `headline`, `description`
- `icon`, `category`, `keywords`, `faqs`
- `programmaticVariants` — generates SEO variant pages like `/tools/freelancer-rate-calculator/for-web-developers`

**To add a new tool:** add it to `TOOL_CATEGORIES` in `tools.ts`, create `src/app/tools/[slug]/page.tsx`, create `src/app/tools/[slug]/[variant]/page.tsx`, and create `src/components/calculators/YourCalculator.tsx`.

---

## Current Tools

Do not hardcode the tool count. This site has grown beyond the original 17 tools, including advanced image, passport/visa photo, PDF, document, and text utilities generated from `src/lib/advancedTools.ts`. Use `ALL_TOOLS.length`, `TOOL_CATEGORIES`, and the actual files in `src/app/tools/` when reporting counts, building navigation, writing content, or creating sitemaps.

**Pricing & Profitability:** Freelancer Rate Calculator, Project Cost Calculator, Agency Pricing Calculator, Retainer Calculator, Profit Calculator

**Marketplace Tools:** Upwork Fee Calculator, Freelancer Commission Calculator, Hourly vs Fixed Calculator

**Client Acquisition:** Proposal Generator, Scope of Work Generator, Client Questionnaire Generator, Discovery Call Script Generator

**Business Operations:** Invoice Generator, Meeting Cost Calculator, Commission Calculator, Revenue Goal Calculator, Break-Even Calculator

---

## Environment Variables (`.env.local`)

```
ADMIN_PASSWORD=          # Password for /admin dashboard
CONVERTKIT_API_KEY=      # ConvertKit email list
CONVERTKIT_API_SECRET=   # ConvertKit secret
```

There is also an `.env.local.example` file. Never commit `.env.local`.

---

## Deployment Workflow

1. Make changes locally
2. Test: `npm run build` (must pass with zero errors)
3. Deploy: `git add -A && git commit -m "description" && git push origin main`
4. Vercel auto-deploys on push — check vercel.com dashboard for build status

**Important:** Always run `npm run build` before committing. TypeScript errors will break the Vercel build.

---

## Admin Dashboard

Located at `/admin` — protected by `ADMIN_PASSWORD` cookie (set in middleware.ts).

Features: blog post management, subscriber list, traffic analytics, SEO management, social posting (Buffer integration for Twitter/Reddit).

---

## Conventions & Patterns

- **Tool page pattern:** `ToolPageShell` wraps every tool. Pass the tool slug; it auto-fetches metadata from `tools.ts`, renders FAQs, related tools, and email capture.
- **Programmatic SEO:** Variant pages are generated via `pageFactory.tsx`. Each variant adjusts the title/description for the keyword but renders the same calculator.
- **AI generation tools** (Proposal Generator, SOW, Discovery Call, Client Questionnaire) call `/api/generate` which streams from Codex.
- **Blog posts** are MDX files in `src/content/blog/`. Frontmatter fields: `title`, `description`, `date`, `slug`.
- **SEO blog workflow:** Whenever Adnan asks to "write a blog", "publish a blog post", "SEO content", or similar, act as an SEO agency for FreelTools. Research keyword intent and competitors, map the post to a tool/funnel, write search-focused but people-first content, add internal links to relevant tools/category hubs/blog clusters, include FAQs/tables/CTAs where useful, use current official sources for volatile facts, run `npm run seo:qa` and `npm run build`, then commit, push, verify live URLs, and confirm sitemap inclusion. Follow `docs/SEO_BLOG_PLAYBOOK.md`.
- **Styling:** Tailwind only. No CSS modules. Stick to the existing color palette (indigo/violet primary, slate grays).
- **No accounts/auth for users.** Everything is free and anonymous. Admin is the only authenticated area.

---

## Key Commands

```bash
npm run dev      # Start dev server (port 3001)
npm run seo:qa   # SEO QA for blogs/internal links before publish
npm run build    # Production build (run before every deploy)
npm run lint     # ESLint check
git push origin main  # Triggers Vercel auto-deploy
```

---

## What NOT to do

- Don't add new npm packages without a clear reason — keep the bundle lean
- Don't create separate CSS files — use Tailwind classes
- Don't break existing tool routes or slugs (they have SEO equity)
- Don't commit `.env.local`
- Don't use `any` TypeScript types unless truly unavoidable
- Don't add auth/login flows for regular users — the site is intentionally open

## Imported Claude Cowork project instructions
