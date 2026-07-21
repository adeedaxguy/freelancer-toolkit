# FreelTools Strict Ahrefs + GSC Blog Expansion Run

Date: 2026-07-22
Project: FreelTools
Domain: https://freeltools.com
Deployment: https://freelancetools-othu3r5xv-adnanaimanager-3376s-projects.vercel.app
Production alias: https://freeltools.com
Vercel deployment ID: dpl_CBahMFk4CVKkaTAiKXurJrrd9U74

## Status

Completed 23 published SEO blog tasks after the required Ahrefs/RankyTools, GSC, Google SERP, and Ahrefs Toolbar research gate.

Strict-gate note: Ahrefs/RankyTools report pages were opened in Chrome. Several views still showed the inactive-workspace banner, and Ahrefs Toolbar SERPs also showed the warning. Treat the run as Ahrefs-used-with-limitation, not as a clean row-level Ahrefs export.

## Research Evidence

### Google Search Console

Chrome GSC Performance showed:

- 16 clicks
- 5.09k impressions
- 0.3% CTR
- Average position 61

Visible query gaps:

- on page seo checker: 0 clicks / 172 impressions
- project price calculator: 0 clicks / 140 impressions
- on page seo audit: 0 clicks / 138 impressions
- seo on page checker: 0 clicks / 113 impressions
- onpage seo audit: 0 clicks / 108 impressions
- on-page seo checker: 0 clicks / 89 impressions
- fiverr fees: 0 clicks / 64 impressions
- fiverr fee calculator: 1 click / 18 impressions
- freelancer toolkit: 1 click / 10 impressions
- fiverr calculator fee: 1 click / 1 impression

GSC Pages / indexing showed 173 indexed URLs and 127 not indexed URLs, including 122 Discovered - currently not indexed URLs. Today's post batch adds sitemap-visible support pages for clusters already earning impressions.

### Ahrefs / RankyTools

Ahrefs views opened: overview, organic keywords, top pages, organic competitors, backlinks, referring domains, anchors, broken backlinks, and content gap. Row-level extraction remains limited by the inactive-workspace banner on several views.

### Google SERP + Toolbar Review

Live SERP review covered:

- fiverr fee calculator
- project price calculator
- on page seo checker
- resize jpg 50 kb

SERP patterns included Upwork, Freelance Ready, SimpliConvert, Memtime, Wincher, Seobility, DebugBear, Simple Image Resizer, Zamzar, 11zon, and Pi7. Related searches drove the published topics.

## 23 Completed Tasks

1. https://freeltools.com/blog/fiverr-fee-calculator-for-sellers
2. https://freeltools.com/blog/fiverr-fees-for-buyers-explained
3. https://freeltools.com/blog/fiverr-withdrawal-fee-guide
4. https://freeltools.com/blog/does-fiverr-take-a-cut-of-tips
5. https://freeltools.com/blog/how-to-avoid-fiverr-service-fee-safely
6. https://freeltools.com/blog/fiverr-service-fee-promo-code-reality-check
7. https://freeltools.com/blog/fiverr-20-percent-calculator
8. https://freeltools.com/blog/upwork-fee-calculator-vs-fiverr-fee-calculator
9. https://freeltools.com/blog/project-price-calculator-excel-alternative
10. https://freeltools.com/blog/simple-project-price-calculator-guide
11. https://freeltools.com/blog/free-project-price-calculator-online
12. https://freeltools.com/blog/online-project-cost-calculator-for-service-businesses
13. https://freeltools.com/blog/project-estimation-calculator-guide
14. https://freeltools.com/blog/fixed-price-project-calculator-guide
15. https://freeltools.com/blog/web-design-project-price-calculator
16. https://freeltools.com/blog/agency-project-price-calculator
17. https://freeltools.com/blog/on-page-seo-checker-free-guide
18. https://freeltools.com/blog/on-page-seo-checker-online-workflow
19. https://freeltools.com/blog/google-seo-checker-for-small-sites
20. https://freeltools.com/blog/on-page-seo-audit-checklist
21. https://freeltools.com/blog/seo-on-page-checker-vs-audit-tool
22. https://freeltools.com/blog/resize-jpg-50-kb-online-free
23. https://freeltools.com/blog/photo-20-kb-to-50-kb-jpg-guide

## Implementation

- Added 23 published MDX posts under `src/content/blog`.
- Each post includes SEO frontmatter, answer-first copy, decision table, workflow steps, internal links to the relevant FreelTools tool, and FAQ sections for FAQPage JSON-LD extraction.
- Sitemap includes the new published posts automatically through `getAllPosts()`.

## QA

- `npm run build`: passed locally.
- Local production QA: all 23 new URLs returned 200 with canonical URL, BlogPosting JSON-LD, FAQPage JSON-LD, and relevant tool CTA present.
- Local sitemap QA: representative new URLs present.
- Vercel production build: passed.
- Live production QA: representative URLs returned 200 with canonical/schema; sitemap includes the new pages.

## Backlink / Authority

No outreach, link purchase, or disavow was performed. Existing rejected spam backlink rows remain rejected. Per policy, disavow remains escalation-only if GSC/manual-action evidence or verified followed-link risk appears.

## Next Action

Inspect/request indexing for the highest-impression GSC targets after deployment, and rerun Ahrefs row-level backlink/content-gap exports when the account no longer shows the inactive-workspace warning.
