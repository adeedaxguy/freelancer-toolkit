# SEO Export Drop Zone

Save Ahrefs, Google Search Console, and related exports here, then run:

```bash
npm run seo:opportunities
```

Raw exports are ignored by Git. This README stays tracked so the folder exists.

## Ahrefs Exports

Use these filenames exactly when possible:

| File | Ahrefs location | Useful columns |
| --- | --- | --- |
| `ahrefs-organic-keywords.csv` | Site Explorer > Organic keywords | keyword, position, previous position, volume, KD, traffic, URL, SERP features, country |
| `ahrefs-top-pages.csv` | Site Explorer > Top pages | URL, traffic, keywords, top keyword, volume, backlinks, referring domains |
| `ahrefs-content-gap.csv` | Content Gap | keyword, volume, KD, competitors ranking, URL if shown |
| `ahrefs-competing-pages.csv` | Competing pages or domains | URL/domain, overlap, common keywords, traffic |
| `ahrefs-backlinks.csv` | Backlinks | referring page, DR, anchor, target URL, first seen, status |
| `ahrefs-broken-backlinks.csv` | Broken backlinks | referring page, DR, anchor, broken target URL |
| `ahrefs-site-audit.csv` | Site Audit issues | severity, issue, affected URL, recommendation |

## Google Search Console Exports

| File | GSC location | Useful columns |
| --- | --- | --- |
| `gsc-queries-3m.csv` | Performance > Search results > Queries, last 3 months | query, clicks, impressions, CTR, position |
| `gsc-pages-3m.csv` | Performance > Search results > Pages, last 3 months | page, clicks, impressions, CTR, position |

## RankyTools / Ahrefs Notes

If using RankyTools Ahrefs, use focused exports only. Do not mass scrape. Record the country/database and filters in the related report when a decision depends on them.

## After Exporting

1. Run `npm run seo:opportunities`.
2. Open `seo/opportunities.md`.
3. Pick the highest-scoring item with a clear tool or blog funnel.
4. After publishing, note the change in `seo/reports/`.
