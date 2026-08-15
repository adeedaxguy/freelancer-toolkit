# Fresh GSC Tool Value Update — 2026-08-16

## Fresh Search Console Snapshot

- Source: Google Search Console Performance report for `sc-domain:freeltools.com`
- Range visible: 3 months
- Last update shown in GSC: about 6 hours before review
- Total clicks: 20
- Total impressions: 6.62k
- Average CTR: 0.3%
- Average position: 59.6

## Top Query Opportunities

| Query | Clicks | Impressions | SEO action |
|---|---:|---:|---|
| fiverr fee calculator | 1 | 23 | Already upgraded fee math and reverse pricing in previous deploy |
| freelancer toolkit | 1 | 12 | Monitor homepage/brand SERP presentation |
| fiverr calculator fee | 1 | 1 | Covered by Fiverr calculator |
| on page seo checker | 0 | 180 | Upgrade on-page checker tool output |
| project price calculator | 0 | 162 | Already upgraded project cost/quote worksheet |
| on page seo audit | 0 | 143 | Upgrade on-page checker/audit output |
| keyword density checker | 0 | 135 | Upgrade keyword density checker into topical coverage checker |
| seo on page checker | 0 | 118 | Upgrade on-page checker output |
| onpage seo audit | 0 | 111 | Upgrade on-page checker/audit output |
| keyword density checker tools | 0 | 107 | Upgrade keyword density checker output |

## Top Page Opportunities

| Page | Clicks | Impressions | Status |
|---|---:|---:|---|
| `/tools/resize-photo-to-413x531` | 6 | 118 | Covered by shared image Output QA upgrade |
| `/tools/fiverr-fee-calculator` | 3 | 832 | Already upgraded with current fee assumptions and reverse pricing |
| `/` | 2 | 119 | Monitor homepage brand clarity |
| `/tools/jpg-resize-to-50kb` | 2 | 72 | Covered by shared image Output QA upgrade |
| `/tools/passport-photo-4x6-print-maker` | 2 | 5 | Covered by shared passport/photo readiness checks |
| `/tools/passport-size-photo-resizer` | 1 | 106 | Covered by shared image Output QA upgrade |
| `/tools/35x45mm-photo-maker` | 1 | 83 | Covered by shared passport/photo readiness checks |
| `/tools/project-deadline-calculator` | 1 | 29 | Already upgraded with milestone/deadline output |
| `/tools/make-photo-300-dpi` | 1 | 5 | Covered by shared image Output QA upgrade |

## Indexing Snapshot

- Indexed pages: 316
- Not indexed: 269
- Discovered currently not indexed: 232
- Crawled currently not indexed: 4
- Alternative page with proper canonical: 27
- Not found: 3
- Page with redirect: 3

## Shipped Tool-Value Updates

- `SeoToolsCalculator.tsx`
  - On-page SEO checker now produces a prioritized refresh queue, first-screen/action checks, schema and Open Graph checks, and a copyable page-refresh brief.
  - Keyword density checker now checks related-term coverage, question coverage, overused terms, missing related entities, and generates a rewrite brief.

## Next Watchlist

- Recheck GSC after indexing and recrawl for:
  - `on page seo checker`
  - `on page seo audit`
  - `keyword density checker`
  - `project price calculator`
  - image/photo tool pages with clicks but low positions
