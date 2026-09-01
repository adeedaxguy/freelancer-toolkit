import Link from 'next/link'
import type { ToolMeta } from '@/lib/tools'
import { getKeywordFunnelForTool } from '@/lib/keywordFunnel'
import { getCategoryUrlForTool } from '@/lib/categoryPages'

interface ToolSeoContentProps {
  tool: ToolMeta
  variantLabel?: string
}

function sentenceList(items: string[]): string {
  if (items.length <= 1) return items[0] ?? ''
  if (items.length === 2) return `${items[0]} and ${items[1]}`
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`
}

function getActionVerb(tool: ToolMeta): string {
  const title = tool.title.toLowerCase()
  if (title.includes('calculator')) return 'calculate'
  if (title.includes('converter')) return 'convert'
  if (title.includes('resizer') || title.includes('resize')) return 'resize'
  if (title.includes('photo')) return 'create'
  if (title.includes('generator')) return 'generate'
  if (title.includes('timer')) return 'run'
  return 'use'
}

type ToolResearchIntent = {
  searcherJob: string
  competitorGap: string
  useNow: string
}

const TOOL_RESEARCH_INTENT: Record<string, ToolResearchIntent> = {
  'fiverr-fee-calculator': {
    searcherJob: 'Understand seller fees, buyer checkout totals, tips, and reverse pricing before setting a Fiverr gig or custom offer.',
    competitorGap: 'Fee pages often explain the percentage but hide the working calculator below the fold; this page needs the calculator, assumptions, and reverse-price workflow together.',
    useNow: 'Enter the gig price first, then check seller net and buyer total before changing the public offer amount.',
  },
  'fiverr-seller-fee-calculator': {
    searcherJob: 'Estimate what the seller keeps from a Fiverr order after platform fees.',
    competitorGap: 'Generic Fiverr guides stop at the headline fee; this page should show net earnings and the target-net reverse calculation.',
    useNow: 'Use the seller-side estimate before accepting a custom order or milestone value.',
  },
  'fiverr-buyer-fee-calculator': {
    searcherJob: 'Preview the buyer checkout total so a freelancer can understand what the client sees.',
    competitorGap: 'Most calculators focus only on seller commission; this page covers buyer friction and price perception.',
    useNow: 'Compare gig price, service fee, and small-order assumptions before quoting low-ticket work.',
  },
  'fiverr-commission-calculator': {
    searcherJob: 'Calculate the Fiverr commission and the price needed to keep a target amount.',
    competitorGap: 'Commission pages usually answer one fee; this page should connect commission, net earnings, and reverse pricing.',
    useNow: 'Set the target take-home first when the order amount is flexible.',
  },
  'upwork-fee-calculator': {
    searcherJob: 'Compare platform fee impact before pricing an Upwork project or hourly engagement.',
    competitorGap: 'Marketplace fee content is often platform-specific; this page should help users compare fee math against Fiverr and direct-client alternatives.',
    useNow: 'Calculate take-home before deciding whether the work belongs on-platform or direct.',
  },
  'freelancer-commission-calculator': {
    searcherJob: 'Compare freelancer platform commissions before accepting work through a marketplace.',
    competitorGap: 'Competitors tend to isolate one marketplace; this page should make fee comparison part of the quoting workflow.',
    useNow: 'Run the commission estimate, then compare related platform calculators before sending the quote.',
  },
  'project-price-calculator': {
    searcherJob: 'Turn delivery effort, revisions, and risk buffer into a client-facing project price.',
    competitorGap: 'Generic project estimators rank broadly; this page is stronger when it stays focused on freelance and agency fixed-price quoting.',
    useNow: 'Calculate the price, then move into the proposal or scope-of-work tool before sending it.',
  },
  'project-cost-calculator': {
    searcherJob: 'Estimate the internal cost of a freelance project before turning it into a quote.',
    competitorGap: 'Broad business calculators rarely include revision and scope risk; this page should keep freelance margin protection visible.',
    useNow: 'Start with hours and rate, then add revision time and buffer before choosing the client price.',
  },
  'project-deadline-calculator': {
    searcherJob: 'Translate hours, review windows, and buffer days into a deadline a client can understand.',
    competitorGap: 'Deadline calculators often ignore client feedback delays; this page should include review and buffer logic.',
    useNow: 'Use the deadline after pricing so proposal dates and delivery scope match.',
  },
  'freelance-services-pricing-calculator': {
    searcherJob: 'Price a service package without undercounting delivery, communication, QA, and revisions.',
    competitorGap: 'Pricing advice pages are often theoretical; this page should keep the working calculator and package logic side by side.',
    useNow: 'Use it when the service is repeatable but the scope still needs protection.',
  },
  'freelancer-rate-calculator': {
    searcherJob: 'Find a minimum hourly, day, or monthly rate from income goal, taxes, expenses, and billable hours.',
    competitorGap: 'Rate articles often copy market averages; this page should win by working backward from the user’s real numbers.',
    useNow: 'Calculate the rate before pricing a project, retainer, or marketplace gig.',
  },
  'on-page-seo-checker': {
    searcherJob: 'Check whether a page has the title, meta description, H1, keyword placement, canonical, content depth, and links needed before publishing.',
    competitorGap: 'On-page SEO checker results often hide the checklist behind signups or broad crawlers; this page should give the page-level checker immediately.',
    useNow: 'Paste the page details, fix the highest-risk warnings, then preview the snippet before requesting indexing.',
  },
  'on-page-seo-audit-tool': {
    searcherJob: 'Check whether a page covers title, description, headings, links, content depth, canonical clarity, image alt text, and crawl basics before publishing or refreshing.',
    competitorGap: 'On-page SEO audit SERPs are crowded with generic scanners and signup walls; this page should keep the audit action, GSC refresh workflow, and next tools visible without hiding the checklist.',
    useNow: 'Paste the page details, fix title/meta/H1/canonical/internal-link gaps, then rerun before requesting indexing or refreshing a low-CTR page.',
  },
  'seo-title-ctr-optimizer': {
    searcherJob: 'Rewrite low-CTR search snippets from GSC query evidence without drifting into clickbait.',
    competitorGap: 'Most title tools are length counters; this page should connect title wording, meta description, query intent, and SERP promise.',
    useNow: 'Paste the current title and meta description, compare the preview, then rewrite around the searcher job before requesting indexing.',
  },
  'gsc-indexing-issue-triage-tool': {
    searcherJob: 'Classify Search Console indexing issues as fix, monitor, or expected before touching redirects, canonicals, robots, or sitemaps.',
    competitorGap: 'Indexing guides are often long and generic; this page should put the issue decision path and live-page checks first.',
    useNow: 'Paste the affected URL notes, check robots/canonical/redirect signals, then decide whether to fix, monitor, or validate in GSC.',
  },
  'sitemap-canonical-auditor': {
    searcherJob: 'Turn sitemap XML or a URL export into one consistent list of preferred canonical URLs before submission.',
    competitorGap: 'Broad sitemap validators mix status checks with crawl reports; this page should stay focused on protocol, host, duplicate, fragment, parameter, and canonical consistency.',
    useNow: 'Set the preferred origin, paste the sitemap, then review mixed hosts before copying the canonical-ready fix list.',
  },
  'hreflang-reciprocity-checker': {
    searcherJob: 'Verify that supplied localized page sets use valid locales, self-links, return links, x-default guidance, and compatible canonicals.',
    competitorGap: 'Tag generators cannot prove return links across pages; this checker should name the exact supplied source and target where the cluster breaks.',
    useNow: 'Paste one block per localized page, fix self-reference and locale issues, then resolve missing reciprocal links and canonical conflicts.',
  },
  'dataforseo-cost-guard-planner': {
    searcherJob: 'Plan a DataForSEO keyword or SERP pull without accidentally spending beyond a tiny daily research budget.',
    competitorGap: 'Most keyword research pages assume a full paid SEO suite; this page should help small teams use one seed, cached reports, and a written cost guard before making API calls.',
    useNow: 'Start from cached DataForSEO reports, set one seed and a hard limit, then save the research note before creating new tools, posts, or indexing requests.',
  },
  'gsc-validation-priority-planner': {
    searcherJob: 'Decide which Search Console indexing issue should be fixed and validated first after a live SEO deployment.',
    competitorGap: 'Generic GSC guides list every exclusion reason; this page should prioritize redirects, canonicals, noindex, robots, sitemap presence, and internal links before validation.',
    useNow: 'Paste the affected URL notes, confirm the live fix is real, then request validation only when the page is indexable and linked from a useful internal path.',
  },
  'heading-hierarchy-checker': {
    searcherJob: 'Check whether a page uses one clear H1, logical H2-H3 order, and a scannable heading outline before publishing.',
    competitorGap: 'Most ranking pages bundle heading feedback inside a full audit. This page wins when it stays focused on heading structure and shows the outline immediately.',
    useNow: 'Paste the HTML, fix skipped levels or repeated H1s, then move to title, internal-link, or alt-text checks only if the page still needs them.',
  },
  'image-alt-text-checker': {
    searcherJob: 'Check whether page images have useful alt text, intentional decorative handling, and no obvious duplicate descriptions before publishing.',
    competitorGap: 'Image checks usually hide inside broader SEO crawlers. This page is stronger when it gives the image list and alt-text issues without a crawl or signup.',
    useNow: 'Paste the HTML, fix missing or weak alt text, then rerun the on-page audit before pushing the page live.',
  },
  'seo-title-checker': {
    searcherJob: 'Check whether a title tag is clear, query-matched, and likely to fit a Google result before a page goes live.',
    competitorGap: 'Title checkers are often only character counters; this page should tie title length to search intent and click clarity.',
    useNow: 'Paste the title, compare the preview, and rewrite until the core page promise is visible.',
  },
  'meta-description-checker': {
    searcherJob: 'Check whether a meta description gives searchers a reason to click and stays within a useful working length.',
    competitorGap: 'Many meta tools focus on length only; this page should connect description length, search intent, and CTA clarity.',
    useNow: 'Paste the description, check the preview, and rewrite it around the searcher job.',
  },
  'keyword-density-checker': {
    searcherJob: 'Check whether a page repeats target terms naturally or drifts into keyword stuffing.',
    competitorGap: 'Density tools often over-focus on percentages; this page should pair counts with content-quality guidance.',
    useNow: 'Use it after drafting, then adjust headings and repeated phrases before publishing.',
  },
  'serp-snippet-preview-tool': {
    searcherJob: 'Preview how a title and description may appear before a page goes live.',
    competitorGap: 'Snippet preview tools can be generic; this page should connect previewing to CTR and query fit.',
    useNow: 'Rewrite the title or meta description until the primary task is obvious.',
  },
  'resize-photo-to-413x531': {
    searcherJob: 'Resize a photo to 413x531 pixels for forms that require exact dimensions.',
    competitorGap: 'Image resizer pages often send users through generic upload flows; this page should keep the exact dimension visible and immediate.',
    useNow: 'Upload the image, crop if needed, and download the exact-size result before submitting the form.',
  },
  'passport-size-photo-resizer': {
    searcherJob: 'Resize a passport-style photo while preserving a clean head-and-shoulders crop.',
    competitorGap: 'Passport photo tools often mix country rules; this page should make the resize workflow clear and link to exact country formats.',
    useNow: 'Use it when the form accepts a passport-style photo but gives a file or dimension limit.',
  },
  'passport-photo-4x6-print-maker': {
    searcherJob: 'Place passport photos on a 4x6 print sheet for local printing.',
    competitorGap: 'Print-sheet pages can be confusing about copy count and margins; this page should show the sheet purpose before download.',
    useNow: 'Create the sheet only after the individual photo crop is correct.',
  },
  'make-photo-300-dpi': {
    searcherJob: 'Prepare a photo with 300 DPI metadata for applications or print workflows.',
    competitorGap: 'DPI pages often confuse pixel size with print metadata; this page should explain the distinction beside the tool.',
    useNow: 'Use DPI adjustment after the image dimensions are already correct.',
  },
  'jpg-resize-to-50kb': {
    searcherJob: 'Reduce a JPG to around 50KB while keeping it acceptable for upload forms.',
    competitorGap: 'File-size tools compete heavily; this page should keep exact-size compression, preview, and quality warnings together.',
    useNow: 'Compress gradually and check that the final image is still readable before uploading.',
  },
  'resize-image-to-20kb': {
    searcherJob: 'Resize or compress an image to a strict 20KB file-size limit.',
    competitorGap: 'Historical SEO evidence shows this file-size page can earn organic visibility; the page should keep the exact limit and quality tradeoff front and center.',
    useNow: 'Start with dimensions first, then reduce quality only as much as needed to meet 20KB.',
  },
  'resize-image-to-50kb': {
    searcherJob: 'Get an image under 50KB for job, visa, school, or government upload forms.',
    competitorGap: 'Exact-KB competitors often bury the upload step; this page should make the limit and download path immediate.',
    useNow: 'Use the preview to avoid over-compressing text, faces, or signatures.',
  },
  'resize-photo-under-50kb': {
    searcherJob: 'Compress a photo below 50KB without losing the format needed by the application.',
    competitorGap: 'Photo-size SERPs are full of generic compressors; this page should speak to form submission and photo acceptance.',
    useNow: 'Check both file size and visual clarity before submitting the image.',
  },
}

type ToolGscInsight = {
  evidenceLabel: string
  priority: string
  links: Array<{ href: string; label: string }>
}

const TOOL_GSC_INSIGHT: Record<string, ToolGscInsight> = {
  'resize-photo-to-413x531': {
    evidenceLabel: 'Popular exact-size workflow',
    priority: 'Keep the exact 413x531 upload job visible, then route people into the 35x45mm, 20KB, and print-sheet workflows instead of sending them back to Google.',
    links: [
      { href: '/tools/35x45mm-photo-maker', label: 'Make a 35x45mm photo' },
      { href: '/tools/resize-image-to-20kb', label: 'Compress to 20KB' },
      { href: '/tools/passport-photo-4x6-print-maker', label: 'Create a 4x6 print sheet' },
      { href: '/blog/passport-photo-35x45mm-guide', label: 'Read the 35x45mm guide' },
    ],
  },
  'resize-image-to-20kb': {
    evidenceLabel: 'Strict upload workflow',
    priority: 'Searchers with strict upload limits need the file under 20KB quickly. Keep the exact-KB action visible, then connect them to signature, photo, and larger-size presets when the first export is too compressed.',
    links: [
      { href: '/tools/resize-photo-under-20kb', label: 'Photo under 20KB' },
      { href: '/tools/resize-signature-to-20kb', label: 'Signature under 20KB' },
      { href: '/tools/resize-image-to-50kb', label: 'Try 50KB instead' },
      { href: '/blog/resize-photo-under-20kb-50kb-100kb-guide', label: 'Read the KB guide' },
    ],
  },
  'passport-photo-4x6-print-maker': {
    evidenceLabel: 'Print-sheet workflow',
    priority: 'Make the print-sheet workflow obvious and keep exact photo-size routes one click away for users who started with a resized passport image.',
    links: [
      { href: '/tools/resize-photo-to-413x531', label: 'Resize to 413x531 first' },
      { href: '/tools/us-passport-photo-maker', label: 'Use the U.S. passport preset' },
      { href: '/blog/passport-photo-4x6-print-maker-guide', label: 'Read the print-sheet guide' },
    ],
  },
  'fiverr-fee-calculator': {
    evidenceLabel: 'Popular fee workflow',
    priority: 'Answer the fee query quickly, then move users into seller net, buyer total, reverse pricing, and pricing follow-through without adding friction.',
    links: [
      { href: '/blog/fiverr-fee-calculator-guide', label: 'Fiverr fee guide' },
      { href: '/tools/fiverr-buyer-fee-calculator', label: 'Buyer fee calculator' },
      { href: '/tools/fiverr-seller-fee-calculator', label: 'Seller net calculator' },
      { href: '/tools/upwork-fee-calculator', label: 'Compare Upwork fees' },
    ],
  },
  'project-price-calculator': {
    evidenceLabel: 'Client quote workflow',
    priority: 'Project price queries were one of the earliest impression clusters. Keep the quote calculator exact, then send users into proposal, scope, and service-pricing tools so the visit turns into a finished client workflow.',
    links: [
      { href: '/tools/project-cost-calculator', label: 'Estimate project cost' },
      { href: '/tools/freelance-services-pricing-calculator', label: 'Price a service package' },
      { href: '/tools/proposal-generator', label: 'Write the proposal' },
      { href: '/blog/project-price-calculator-freelancers', label: 'Read the pricing guide' },
    ],
  },
  'freelance-services-pricing-calculator': {
    evidenceLabel: 'Service pricing workflow',
    priority: 'Service-pricing impressions should land on a package-pricing workflow, not a generic rate page. Keep package scope, revisions, and margin close to the tool, then route users into quote and profit checks.',
    links: [
      { href: '/tools/project-price-calculator', label: 'Quote the project' },
      { href: '/tools/profit-calculator', label: 'Check profit margin' },
      { href: '/tools/proposal-generator', label: 'Turn price into proposal' },
      { href: '/blog/freelance-services-pricing-calculator', label: 'Read service pricing guide' },
    ],
  },
  'app-icon-generator': {
    evidenceLabel: 'Launch asset workflow',
    priority: 'App icon users usually want a clean 1024x1024 export first. Keep the upload and export workflow immediate, then route them to favicon and image-size tools for adjacent launch assets.',
    links: [
      { href: '/tools/favicon-generator', label: 'Create favicon' },
      { href: '/tools/image-compressor', label: 'Compress the icon' },
      { href: '/tools/make-photo-300-dpi', label: 'Set 300 DPI' },
    ],
  },
  'on-page-seo-audit-tool': {
    evidenceLabel: 'Page refresh workflow',
    priority: 'This URL is the current GSC drop-recovery target. Keep the audit tool above the fold, add Search Console refresh language, and route users into metadata, internal-link, schema, and content-gap tools.',
    links: [
      { href: '/tools/seo-title-ctr-optimizer', label: 'Optimize low-CTR title' },
      { href: '/tools/gsc-indexing-issue-triage-tool', label: 'Triage GSC indexing issues' },
      { href: '/tools/seo-title-checker', label: 'Rewrite title tag' },
      { href: '/tools/meta-description-checker', label: 'Improve meta description' },
      { href: '/tools/heading-hierarchy-checker', label: 'Check heading structure' },
      { href: '/tools/image-alt-text-checker', label: 'Check image alt text' },
      { href: '/tools/internal-link-anchor-text-checker', label: 'Check internal anchors' },
      { href: '/tools/gsc-insights-refresh-planner', label: 'Plan a GSC refresh' },
    ],
  },
  'seo-title-ctr-optimizer': {
    evidenceLabel: 'Low-CTR refresh workflow',
    priority: 'DataForSEO showed strong on-page checker demand, and GSC workflows often need title/meta refreshes before new content. Keep query, title, meta, and measured follow-up in one path.',
    links: [
      { href: '/tools/serp-snippet-preview-tool', label: 'Preview the snippet' },
      { href: '/tools/meta-description-checker', label: 'Check meta description' },
      { href: '/tools/on-page-seo-audit-tool', label: 'Run the page audit' },
      { href: '/blog/seo-title-ctr-optimizer-gsc-refresh-guide', label: 'Read the CTR refresh guide' },
    ],
  },
  'gsc-indexing-issue-triage-tool': {
    evidenceLabel: 'Index coverage workflow',
    priority: 'Search Console indexing alerts should become fix, monitor, or expected decisions before validation. Keep redirects, canonicals, robots, sitemap, and live URL QA connected.',
    links: [
      { href: '/tools/robots-meta-tag-checker', label: 'Check robots tags' },
      { href: '/tools/canonical-tag-checker', label: 'Check canonical URL' },
      { href: '/tools/redirect-chain-checker', label: 'Check redirect chain' },
      { href: '/blog/gsc-indexing-issues-fix-workflow', label: 'Read the indexing workflow' },
    ],
  },
  'heading-hierarchy-checker': {
    evidenceLabel: 'On-page structure workflow',
    priority: 'GSC demand in the on-page cluster shows users are already looking for practical pre-publish QA. This page should handle heading structure fast, then route users into the broader on-page audit stack.',
    links: [
      { href: '/tools/on-page-seo-checker', label: 'Run the full on-page check' },
      { href: '/tools/internal-link-anchor-text-checker', label: 'Review internal anchors' },
      { href: '/tools/seo-title-checker', label: 'Tighten the title tag' },
    ],
  },
  'image-alt-text-checker': {
    evidenceLabel: 'Image QA workflow',
    priority: 'On-page ranking pages repeatedly call out image checks, but most tools hide the image list inside a broader crawler. Keep this page focused, then connect it to the rest of the SEO QA path.',
    links: [
      { href: '/tools/on-page-seo-checker', label: 'Run the full on-page check' },
      { href: '/tools/heading-hierarchy-checker', label: 'Review headings too' },
      { href: '/tools/meta-description-checker', label: 'Finish snippet QA' },
    ],
  },
}

function getToolResearchIntent(tool: ToolMeta): ToolResearchIntent {
  return TOOL_RESEARCH_INTENT[tool.slug] ?? {
    searcherJob: `Complete the ${tool.keywords[0] ?? tool.title.toLowerCase()} task without leaving the page.`,
    competitorGap: 'Competing pages often split the explanation from the working tool; this page keeps the action and guidance together.',
    useNow: 'Use the tool first, then follow related tools only when the workflow needs another step.',
  }
}

export default function ToolSeoContent({ tool, variantLabel }: ToolSeoContentProps) {
  const funnel = getKeywordFunnelForTool(tool)
  const conversionKeywords = funnel.keywords.filter((idea) => idea.stage === 'conversion').slice(0, 4)
  const problemKeywords = funnel.keywords.filter((idea) => idea.stage === 'problem-aware').slice(0, 3)
  const comparisonKeywords = funnel.keywords.filter((idea) => idea.stage === 'comparison').slice(0, 3)
  const actionVerb = getActionVerb(tool)
  const primaryKeyword = tool.keywords[0] ?? tool.title.toLowerCase()
  const supportingKeywords = sentenceList(tool.keywords.slice(1, 4))
  const categoryUrl = getCategoryUrlForTool(tool)
  const categoryLabel = tool.category.toLowerCase().endsWith('tools') ? tool.category.toLowerCase() : `${tool.category.toLowerCase()} tools`
  const researchIntent = getToolResearchIntent(tool)
  const gscInsight = TOOL_GSC_INSIGHT[tool.slug]

  return (
    <section className="mt-12 rounded-2xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6">
      <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Tool guide</p>
          <h2 className="mt-2 text-xl font-bold text-gray-900">
            {variantLabel ? `${tool.title} ${variantLabel}: free online workflow` : `${tool.title}: free online workflow`}
          </h2>
          <div className="mt-4 space-y-4 text-sm leading-7 text-gray-600">
            <p>
              The {tool.title} is built for people searching for <strong className="font-semibold text-gray-900">{primaryKeyword}</strong>
              {supportingKeywords ? `, ${supportingKeywords},` : ''} and a fast way to {actionVerb} the result without a paid download step.
              It keeps the calculator, generator, or file workflow on the same page as the explanation, so the searcher can read the guidance and use the tool immediately.
            </p>
            <p>
              Use it when you need a practical answer, export, document, or formatted file quickly. The page is designed as a focused landing page for {tool.category.toLowerCase()} searches:
              clear instructions first, the working tool above, FAQs below, and internal links to related tools when the next step belongs somewhere else.
            </p>
            <p>
              For broader workflows, browse the <Link href={categoryUrl} className="font-medium text-brand-600 hover:underline">{tool.category}</Link> category.
              That page groups the related tools together so users can move from research to action without returning to search results.
            </p>
          </div>
        </div>

        <aside className="rounded-xl border border-gray-100 bg-gray-50 p-4">
          <h3 className="text-sm font-semibold text-gray-900">Search intents covered</h3>
          <div className="mt-4 space-y-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Ready to use</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {conversionKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">How-to research</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {problemKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Free alternative</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {comparisonKeywords.map((idea) => (
                  <span key={idea.keyword} className="rounded-full bg-white px-2.5 py-1 text-xs text-gray-600 shadow-sm">{idea.keyword}</span>
                ))}
              </div>
            </div>
          </div>
        </aside>
      </div>

      <div data-tool-research-intent className="mt-7 rounded-2xl border border-brand-100 bg-brand-50 p-5 sm:p-6">
        <p className="text-xs font-semibold uppercase tracking-wider text-brand-700">Search intent to satisfy</p>
        <h3 className="mt-2 text-lg font-bold text-gray-900">Why this tool page should rank</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            ['Searcher job', researchIntent.searcherJob],
            ['Competitor gap', researchIntent.competitorGap],
            ['Use it now', researchIntent.useNow],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-brand-100 bg-white p-4">
              <h4 className="text-sm font-semibold text-gray-900">{title}</h4>
              <p className="mt-2 text-sm leading-6 text-gray-600">{body}</p>
            </div>
          ))}
        </div>
      </div>

      {gscInsight && (
        <div data-gsc-insight-panel className="mt-7 rounded-2xl border border-amber-100 bg-amber-50 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">{gscInsight.evidenceLabel}</p>
          <h3 className="mt-2 text-lg font-bold text-gray-900">What this page should do next</h3>
          <p className="mt-3 text-sm leading-6 text-gray-700">{gscInsight.priority}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {gscInsight.links.map((link) => (
              <Link key={link.href} href={link.href} className="rounded-full border border-amber-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm hover:border-brand-200 hover:text-brand-700">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 grid gap-4 sm:grid-cols-3">
        {[
          {
            title: 'What it helps with',
            body: tool.description,
          },
          {
            title: 'Why it can rank',
            body: `The page targets specific ${tool.category.toLowerCase()} intent instead of sending every query to the homepage.`,
          },
          {
            title: 'Best next step',
            body: `Use the tool, then compare related ${categoryLabel} from the category page if your workflow needs another step.`,
          },
        ].map((item) => (
          <div key={item.title} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
            <h3 className="text-sm font-semibold text-gray-900">{item.title}</h3>
            <p className="mt-2 text-sm leading-6 text-gray-600">{item.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
