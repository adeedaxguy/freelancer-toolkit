---
name: morning-blog-post
description: 8am daily — write and publish an SEO guide post to freeltools.com blog
---

Write and publish a morning SEO blog post for **freeltools.com**.

**Goal:** Long-form guide (1500–2000 words) targeting a keyword that freelancers search for. The post should rank on Google and drive traffic to the tools on the site.

**Keyword strategy — pick from this rotation:**
- "how to set freelance rates"
- "freelance invoice template"
- "how to write a freelance proposal"
- "scope of work template freelance"
- "upwork fees calculator"
- "freelance project cost estimate"
- "client onboarding checklist freelance"
- "retainer agreement freelance"
- "late payment email freelance"
- "freelance rate calculator hourly"

**Step 1 — Check existing posts**

List files in: /Users/adeedaxguy/Downloads/tools website 2/Tools website 2/src/content/blog/
Pick a keyword NOT already covered by an existing .mdx file.

**Step 2 — Write the post**

- Title format: "How to [do X]: [benefit] in [timeframe]" or "The [Year] Guide to [topic]"
- Frontmatter: title, description, date (today's date), tags, published: true
- Intro (~150 words): hook with the problem freelancers face
- 4–6 H2 sections, each 200–350 words
- At least 2 internal links to tools on freeltools.com (e.g. https://freeltools.com/tools/freelancer-rate-calculator)
- Conclusion with CTA to try the relevant tool
- Natural keyword usage — not stuffed

**Step 3 — Save the file**

File format: MDX
Save to: /Users/adeedaxguy/Downloads/tools website 2/Tools website 2/src/content/blog/[slug].mdx

**Step 4 — Publish to GitHub via Zapier (NO git, NO terminal)**

Read the saved file content using the Read tool, then call execute_zapier_write_action:

- action: "create_file"
- params:
  - repo: "adeedaxguy/freelancer-toolkit"
  - path: "src/content/blog/[slug].mdx"  ← replace [slug] with actual filename (no leading slash)
  - message: "blog: [slug]"
  - content: [full text content of the MDX file]
  - branch: "main"

A SUCCESS status in the execution result means the post is live. Log the file_url as confirmation.

**Important notes:**
- Do NOT use git, terminal, or any shell commands for publishing
- The Zapier GitHub connection is already authenticated — no setup needed
- If the file already exists on GitHub, also pass its SHA as the "sha" param (get it via get_file_contents action first)
- The content param takes plain text — Zapier handles encoding automatically
