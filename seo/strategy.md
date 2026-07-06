# FreelTools SEO Operating Strategy

Last updated: 2026-07-07

## Project

- Domain: https://freeltools.com
- Product: Free browser-based tools for freelancers, agencies, consultants, applicants, and document workflows.
- Primary conversion: use a free tool.
- Secondary conversions: request a tool, subscribe, read supporting blog content, share/use a category hub.
- Deployment: GitHub main branch to Vercel production.
- Sitemap: https://freeltools.com/sitemap.xml

## Positioning

FreelTools should win searches where users need a paid or annoying tool but can complete the task free in the browser. The strongest clusters are:

- Pricing and profitability calculators for freelancers.
- Marketplace fee calculators for Fiverr, Upwork, and freelance platforms.
- Passport, visa, biometric, and application photo tools.
- Image resize/compress/convert utilities for portal limits.
- PDF and document generators for freelancers.
- Client acquisition generators: proposals, SOWs, contracts, questionnaires, and onboarding.

## Ahrefs-First Workflow

Use Ahrefs as the primary research source when exports or RankyTools access are available.

1. Export the files listed in `seo/exports/README.md`.
2. Save them in `seo/exports/` using the exact filenames.
3. Run `npm run seo:opportunities`.
4. Review `seo/opportunities.md`.
5. Pick the highest business-value item that maps to an existing tool or a clear tool-to-blog funnel.
6. Make the content, technical, or internal-link update.
7. Run `npm run seo:qa` and `npm run build`.
8. Commit, push, verify live URL, and record the change in `seo/reports/`.

## Opportunity Scoring Bias

Prioritize:

- Keywords in positions 4-20 where a title/meta/FAQ/first-screen update can move the page.
- High-impression, zero-click terms from Google Search Console.
- Low-KD Ahrefs terms with clear tool intent.
- Competitor keywords where the winning page is thin, outdated, slow, or hides downloads behind a paywall.
- Existing tool pages before creating new pages.
- Support posts that naturally send users to a tool.
- Backlink opportunities that point to free tools, calculators, or useful guides.

Deprioritize:

- Broad informational terms with no tool action.
- Duplicates that cannibalize an existing slug.
- Doorway pages, fake location pages, or pages that only swap a country/tool name without unique usefulness.
- Paid, spammy, or irrelevant backlink opportunities.

## Competitor Watchlist

Use Ahrefs to verify and expand this list before major roadmap decisions:

- iskills.com for freelancer fee calculator content.
- calculator-style sites ranking for project cost, pricing, and rate calculators.
- image resizing and passport photo tools ranking for size-specific and country-specific photo queries.
- PDF converter sites ranking for no-watermark PDF and image conversion terms.
- freelance blog/tool sites ranking for proposal, invoice, contract, and scope templates.

## Autonomy Rules

Allowed without extra approval:

- Metadata, FAQ, answer-block, internal-link, schema, and content-depth improvements.
- New support posts and tool-funnel posts that do not make sensitive claims.
- Technical SEO fixes that pass build and preserve existing slugs.
- Updating SEO docs, reports, and opportunity trackers.

Ask before:

- Paid links, sponsored posts, paid tools, subscriptions, or outreach that commits money.
- New legal, tax, immigration, or official-document claims that are not backed by primary sources.
- Sending outreach emails from a real inbox.
- Any change that breaks or renames an existing slug.

## Measurement

Watch changes over 2-6 weeks in:

- GSC clicks, impressions, CTR, and average position by page/query.
- Ahrefs organic keyword count, top pages, and ranking movement.
- Tool page engagement and request-tool submissions.
- Sitemap/indexing health.
- Backlink wins, lost links, and broken backlink reclamation.
