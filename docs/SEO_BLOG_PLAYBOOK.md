# FreelTools SEO Blog Playbook

Use this whenever Adnan asks to write, update, or publish a blog post for FreelTools. The default mode is SEO agency plus SaaS growth strategist: the post should rank, strengthen topical authority, and move readers toward the right free tool.

## Default Workflow

1. Identify the primary keyword, secondary keywords, and conversion tool.
2. Check Google Search Console context if supplied, and infer opportunity from impressions, CTR, and position.
3. Research live SERP intent and competitors. For volatile facts like marketplace fees, taxes, visa/photo rules, and platform policies, verify with current official sources.
4. Choose the content role: pillar page, cluster article, comparison page, how-to guide, tool guide, or location-specific page.
5. Build the funnel path: search intent -> answer -> proof/examples -> tool CTA -> related tools/posts.
6. Write metadata first: `title`, optional `seoTitle`, `description`, optional `seoDescription`, `date`, `publishDate`, `status: published`, `tags`, and `author`.
7. Write the article in MDX with a clear H1, useful intro, scannable H2/H3s, tables/checklists where helpful, and a FAQ section when the topic has question intent.
8. Add internal links to relevant tool pages, category hubs, and supporting blog posts. Link to the primary tool early and again near the CTA.
9. Add external authority links only when they improve trust or source volatile claims.
10. Run `npm run seo:qa`, fix any errors, then run `npm run build`.
11. Commit only the intended files, push `origin main`, wait for Vercel, verify the live URL returns 200, and confirm it appears in `https://freeltools.com/sitemap.xml`.

## Content Requirements

- First screen should answer the query and give an obvious next action.
- Every blog post should have a conversion target, usually one primary tool and 2-4 supporting tools.
- Use tables for fee comparisons, requirements, dimensions, pricing models, or step summaries.
- Use FAQs for question-heavy topics. Blog FAQ schema is generated automatically from `## FAQ` followed by `### Question` headings.
- Avoid generic filler. Add formulas, examples, current caveats, screenshots/alt-text suggestions, or source-backed details.
- Use current official sources for high-change areas: Fiverr/Upwork/Freelancer fees, tax rules, government ID/photo rules, Google SEO guidance, and platform requirements.
- Do not create duplicate posts that compete for the same primary keyword without a clear canonical/internal-link hierarchy.

## Frontmatter Pattern

```mdx
---
title: "Readable H1 for People"
seoTitle: "Short SERP Title Under 60 Characters"
description: "Compelling on-page description."
seoDescription: "Search snippet under about 155 characters."
date: "2026-07-01"
publishDate: "2026-07-01"
status: published
tags: ["primary keyword", "tool category", "freelance tools"]
author: "FreelancerToolkit"
---
```

## Internal Linking Rules

- Link the primary tool in the first 150-250 words.
- Link related tools where the reader naturally needs the next action.
- Link one pillar page and one to three cluster articles where relevant.
- If publishing a new cluster article, update the relevant pillar or older high-authority post when useful.
- Never break or rename existing tool slugs.

## SEO QA

Run:

```bash
npm run seo:qa
npm run build
```

`seo:qa` checks blog frontmatter, duplicate titles/descriptions, broken internal links, and SEO warnings. Build must pass before pushing.

