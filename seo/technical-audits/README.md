# Technical SEO Audits

Use this folder for crawl, schema, sitemap, redirect, performance, and indexability notes.

Minimum checks before deploying technical SEO changes:

- `npm run seo:qa`
- `npm run build`
- Sitemap includes new URLs.
- Canonicals point to `https://freeltools.com`.
- Tool and blog pages return 200.
- FAQ schema matches visible FAQ content.
- OG image tags exist.
- Mobile first screen has a clear action.
- Existing slugs are preserved.

Record the affected URLs, fix, validation command, deployment URL, and rollback note.
