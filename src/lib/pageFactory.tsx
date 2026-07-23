import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategoryUrlForTool } from '@/lib/categoryPages'
import { getToolBySlug, type ToolMeta } from '@/lib/tools'

const SITE_URL = 'https://freeltools.com'
const OG_IMAGE = `${SITE_URL}/opengraph-image`

export function buildToolMetadata(tool: ToolMeta): Metadata {
  const url = `${SITE_URL}/tools/${tool.slug}`
  const pageTitle = tool.seoTitle ?? `Free ${tool.title} (2026)`
  return {
    title: pageTitle,
    description: tool.description,
    keywords: tool.keywords,
    authors: [{ name: 'FreelancerToolkit' }],
    alternates: {
      canonical: url,
    },
    openGraph: {
      title: pageTitle,
      description: tool.description,
      url,
      type: 'website',
      siteName: 'FreelancerToolkit',
      images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: tool.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: tool.description,
      images: [OG_IMAGE],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true },
    },
  }
}

// How-to steps for tools that have a clear step-by-step usage pattern
const HOW_TO_STEPS: Record<string, { name: string; text: string }[]> = {
  'freelancer-rate-calculator': [
    { name: 'Enter your income goal', text: 'Type in the annual take-home income you want to earn as a freelancer.' },
    { name: 'Set your billable hours', text: 'Enter how many hours per week you realistically expect to bill to clients (most freelancers bill 15–25 hours of a 40-hour week).' },
    { name: 'Add your tax rate', text: 'Enter your estimated tax rate (self-employed freelancers in the US typically pay 25–30%).' },
    { name: 'Add monthly expenses', text: 'Enter your monthly business expenses — software, equipment, insurance, etc.' },
    { name: 'Read your minimum rate', text: 'The calculator shows your minimum hourly rate, daily rate, and monthly revenue target.' },
  ],
  'invoice-generator': [
    { name: 'Enter client details', text: 'Add your name/business name and your client\'s name and address.' },
    { name: 'Add line items', text: 'List the services or products with descriptions, quantities, and unit prices.' },
    { name: 'Set tax rate', text: 'Enter the applicable tax rate (or 0 if tax-exempt).' },
    { name: 'Export as PDF', text: 'Click "Download PDF" to save a professional invoice you can email to your client.' },
  ],
  'proposal-generator': [
    { name: 'Describe the project', text: 'Enter the project type, client name, and a brief description of the work.' },
    { name: 'Add your deliverables', text: 'List what you\'ll deliver — pages, features, campaigns, or content pieces.' },
    { name: 'Set timeline and rate', text: 'Enter the project timeline and your proposed fee.' },
    { name: 'Generate the proposal', text: 'Click Generate — AI writes a professional proposal in seconds.' },
    { name: 'Copy and send', text: 'Review the output, make any edits, then copy it into an email or document.' },
  ],
  'project-cost-calculator': [
    { name: 'Estimate project hours', text: 'Enter your best estimate of how many hours the project will take.' },
    { name: 'Enter your hourly rate', text: 'Add your hourly rate (use the Rate Calculator if you\'re not sure).' },
    { name: 'Add a scope buffer', text: 'Set a scope buffer of 15–25% to cover unexpected work and complexity.' },
    { name: 'Set revision rounds', text: 'Add the number of revision rounds included in the quote.' },
    { name: 'Read your quote', text: 'The calculator shows your base cost, total with buffer, and a recommended client price.' },
  ],
  'project-price-calculator': [
    { name: 'Estimate project hours', text: 'Enter the realistic number of hours needed to complete the project.' },
    { name: 'Add your hourly rate', text: 'Use your target freelance rate or a blended agency rate.' },
    { name: 'Include revisions', text: 'Add the number of revision rounds and expected revision hours.' },
    { name: 'Add a scope buffer', text: 'Use a 15-25% buffer to protect against unclear requirements and extra work.' },
    { name: 'Send the project price', text: 'Use the recommended total as the starting point for your client quote.' },
  ],
  'freelance-services-pricing-calculator': [
    { name: 'Choose the service scope', text: 'List the tasks or deliverables included in the service.' },
    { name: 'Estimate delivery hours', text: 'Enter production, communication, revision, and QA time.' },
    { name: 'Set your rate', text: 'Use your hourly rate or the blended rate for your team.' },
    { name: 'Add risk buffer', text: 'Add a scope buffer for client changes, missing assets, and unexpected complexity.' },
    { name: 'Review the service price', text: 'Use the total as a package price or proposal quote.' },
  ],
  'freelance-pricing-calculator': [
    { name: 'Estimate the work', text: 'Enter the hours required for delivery, revisions, and project management.' },
    { name: 'Add your freelance rate', text: 'Use the hourly rate you need to earn after taxes and expenses.' },
    { name: 'Add a buffer', text: 'Include scope protection so the project stays profitable if work expands.' },
    { name: 'Review the recommended price', text: 'Use the calculated price as the quote you send to the client.' },
  ],
  'freelancer-tax-calculator': [
    { name: 'Enter your gross annual income', text: 'Type in your total freelance income before taxes and expenses for the year.' },
    { name: 'Add your business expenses', text: 'Enter deductible business expenses — software, equipment, home office, professional development, etc.' },
    { name: 'Select your filing status', text: 'Choose single, married filing jointly, or head of household to get the correct federal tax brackets.' },
    { name: 'Review your tax breakdown', text: 'See your estimated self-employment tax, federal income tax, and total tax burden in one view.' },
    { name: 'Check your quarterly payments', text: 'The calculator shows how much to pay each quarter and when payments are due to avoid IRS penalties.' },
  ],
  'freelancer-savings-calculator': [
    { name: 'Enter your average monthly income', text: 'Input your typical monthly freelance earnings — use an average if income varies month to month.' },
    { name: 'Set your income variability', text: 'Choose low, medium, or high variability so the calculator can recommend the right emergency fund size for your situation.' },
    { name: 'Add your monthly expenses', text: 'Enter your total monthly living and business expenses to calculate how many months of runway you need.' },
    { name: 'See your emergency fund target', text: 'The calculator shows your recommended emergency fund size and how long it will take to build at your current savings rate.' },
    { name: 'Review retirement contribution limits', text: 'See your maximum SEP IRA and Solo 401(k) contribution for the current year based on your income.' },
  ],
  'freelance-contract-generator': [
    { name: 'Enter your name and client details', text: 'Add your full name or business name, and your client\'s name and company.' },
    { name: 'Describe the project scope', text: 'Enter what you\'ll deliver — be specific. This becomes the deliverables section of your contract.' },
    { name: 'Set payment terms', text: 'Choose your payment structure (flat fee, milestones, or hourly), total amount, and deposit percentage.' },
    { name: 'Configure revision and kill fee policy', text: 'Set how many revision rounds are included and your cancellation fee if the client ends the project early.' },
    { name: 'Generate and copy your contract', text: 'Click Generate to produce a professional contract. Copy it into a document and send to your client for signature.' },
  ],
  'client-onboarding-checklist': [
    { name: 'Select your service type', text: 'Choose your freelance category — web design, marketing, photography, consulting, etc. — to get a relevant checklist.' },
    { name: 'Choose project type', text: 'Indicate whether this is a one-off project, ongoing retainer, or long-term engagement to customize the checklist phases.' },
    { name: 'Review your checklist', text: 'The generator produces a phased checklist: pre-kickoff, contract and deposit, access gathering, kickoff call, and project setup.' },
    { name: 'Check off items as you go', text: 'Use the interactive checklist to track your onboarding progress. Each item can be checked off as you complete it.' },
    { name: 'Copy or print the checklist', text: 'Export the checklist as plain text, copy to Notion, or print it for reference during your client kickoff call.' },
  ],
  'project-deadline-calculator': [
    { name: 'Enter estimated project hours', text: 'Input your total estimated hours for the project — use your best estimate based on scope.' },
    { name: 'Set your daily availability', text: 'Enter how many hours per day you\'ll work on this specific project (accounting for other clients and admin time).' },
    { name: 'Add revision rounds and feedback windows', text: 'Set the number of revision rounds included and how many days you expect the client to take to review each one.' },
    { name: 'Add buffer days', text: 'Add a 10–20% buffer to absorb unexpected complexity or delays. This protects your deadline commitment.' },
    { name: 'Get your completion date', text: 'The calculator shows your projected finish date and total calendar days — ready to include in your proposal or contract.' },
  ],
  'pdf-to-jpg-converter': [
    { name: 'Upload your PDF', text: 'Click "Choose PDF" or drag and drop your PDF file onto the upload area.' },
    { name: 'Wait for conversion', text: 'Each page is rendered to a canvas in your browser. Larger PDFs take a few seconds per page.' },
    { name: 'Preview your pages', text: 'Thumbnail previews of every page appear once processing is complete.' },
    { name: 'Download images', text: 'Click individual page thumbnails to download them, or use Download All to get every page as a ZIP.' },
  ],
  'image-compressor': [
    { name: 'Upload your image', text: 'Click "Choose Image" or drag and drop a JPG, PNG, or WebP file.' },
    { name: 'Set quality and size', text: 'Adjust the quality slider (80% is a good default) and optionally set a maximum width to resize.' },
    { name: 'Preview the result', text: 'A side-by-side comparison shows the original and compressed versions with file sizes.' },
    { name: 'Download compressed image', text: 'Click Download to save the compressed file to your device.' },
  ],
  'word-count-tool': [
    { name: 'Paste your text', text: 'Paste or type any text into the input area.' },
    { name: 'Review instant stats', text: 'Word count, character count, sentence count, and paragraph count update in real time as you type.' },
    { name: 'Check readability', text: 'The Flesch Reading Ease score tells you how easy your content is to read — useful for client-facing copy.' },
    { name: 'Check reading time', text: 'See how long it takes an average reader to finish your content — useful for estimating blog post or script length.' },
  ],
  'pomodoro-timer': [
    { name: 'Set your work interval', text: 'The default is 25 minutes. Adjust to 50 minutes for longer focus sessions.' },
    { name: 'Click Start', text: 'The timer counts down. Stay focused on one task until the timer rings.' },
    { name: 'Take your break', text: 'When the work session ends, the timer automatically switches to a 5-minute break.' },
    { name: 'Track your sessions', text: 'Each completed pomodoro is logged. After 4 sessions, take a longer 15-minute break.' },
  ],
  'fiverr-fee-calculator': [
    { name: 'Enter your Fiverr gig price', text: 'Type the listed gig price, custom offer amount, or milestone value before buyer service fees.' },
    { name: 'Add any tip amount', text: 'If the buyer is tipping, enter the tip separately so the calculator can estimate the seller fee on the full order.' },
    { name: 'Review seller net earnings', text: 'The calculator shows the estimated Fiverr seller fee and the amount you keep before taxes, withdrawal fees, and currency conversion.' },
    { name: 'Check buyer checkout total', text: 'Review the estimated buyer service fee, small-order fee, and buyer total so you understand the price the client sees.' },
    { name: 'Use reverse pricing', text: 'Enter a target take-home amount to calculate the Fiverr gig price needed to net that amount after seller fees.' },
    { name: 'Adjust fee assumptions if needed', text: 'Change the seller fee percentage, buyer service fee, small-order threshold, or small-order fee if Fiverr shows a different number in your account.' },
  ],
  'fiverr-seller-fee-calculator': [
    { name: 'Enter the Fiverr order value', text: 'Type the gig price, custom offer amount, or milestone value.' },
    { name: 'Add tips if relevant', text: 'Enter any tip amount so the seller fee can be estimated on the full order.' },
    { name: 'Check seller net', text: 'Review the estimated Fiverr seller fee and take-home amount before taxes.' },
    { name: 'Reverse price from target net', text: 'Enter the amount you want to keep to find the gross Fiverr price needed.' },
  ],
  'fiverr-buyer-fee-calculator': [
    { name: 'Enter the gig price', text: 'Type the listed Fiverr gig or custom offer amount.' },
    { name: 'Set buyer fee assumptions', text: 'Adjust the buyer service fee, small-order threshold, and small-order fee if needed.' },
    { name: 'Review checkout total', text: 'See the estimated buyer fee and total amount the buyer may see at checkout.' },
    { name: 'Compare seller net', text: 'Check the seller-side fee and net earnings for the same order.' },
  ],
  'fiverr-commission-calculator': [
    { name: 'Enter the order amount', text: 'Type any Fiverr gig, custom offer, or milestone value.' },
    { name: 'Set the commission percentage', text: 'Use the default seller fee or enter the rate Fiverr shows for your account.' },
    { name: 'Review commission and net', text: 'See the estimated Fiverr commission and seller take-home amount.' },
    { name: 'Use reverse pricing', text: 'Calculate the gross price needed to keep a target amount after commission.' },
  ],
  'late-payment-fee-calculator': [
    { name: 'Enter the original invoice amount', text: 'Type the invoice total that the client has not yet paid.' },
    { name: 'Enter days overdue', text: 'Count the number of days since the invoice due date and enter it here.' },
    { name: 'Set your annual late fee rate', text: 'Enter the rate specified in your contract (1.5%/month = 18%/year is the most common standard).' },
    { name: 'Get the total amount owed', text: 'The calculator shows the late fee amount and new total the client owes.' },
    { name: 'Copy the notice template', text: 'Use the pre-written late payment notice template to send a professional follow-up email.' },
  ],
  'late-charge-calculator': [
    { name: 'Enter the amount due', text: 'Type the unpaid invoice or balance amount.' },
    { name: 'Add days late', text: 'Enter how many days have passed since the due date.' },
    { name: 'Set your late charge rate', text: 'Use the rate stated in your contract or invoice terms.' },
    { name: 'Review the charge', text: 'See the late charge and total amount owed.' },
    { name: 'Send the reminder', text: 'Use the result in a calm, specific follow-up message.' },
  ],
  'invoice-late-fee-calculator': [
    { name: 'Enter invoice amount', text: 'Type the invoice total that remains unpaid.' },
    { name: 'Enter overdue days', text: 'Count the days since the invoice due date.' },
    { name: 'Add the fee rate', text: 'Enter the annual or monthly late fee rate from your invoice terms.' },
    { name: 'Calculate balance due', text: 'Review the late fee amount and updated total balance.' },
    { name: 'Copy the payment notice', text: 'Use the built-in notice template to follow up professionally.' },
  ],
  'gap-insurance-refund-calculator': [
    { name: 'Enter the original GAP premium', text: 'Type the amount paid for GAP coverage when the loan or lease started.' },
    { name: 'Enter the original term', text: 'Add the original contract length in months.' },
    { name: 'Add months used', text: 'Enter how many months passed before payoff, refinance, trade-in, or cancellation.' },
    { name: 'Add cancellation fees', text: 'Enter any admin fee or non-refundable charge shown in the contract.' },
    { name: 'Review the estimated refund', text: 'Use the prorated estimate as a planning number before asking the administrator for a written quote.' },
  ],
  'home-replacement-cost-calculator': [
    { name: 'Enter finished square footage', text: 'Use the living-area square footage of the home, not the lot size.' },
    { name: 'Add local rebuild cost per square foot', text: 'Use a local contractor, insurer, builder, or appraiser estimate when available.' },
    { name: 'Adjust for home quality', text: 'Increase the quality multiplier for custom materials, premium finishes, or complex construction.' },
    { name: 'Add structures and code costs', text: 'Include detached structures, debris removal, permits, and code-upgrade assumptions.' },
    { name: 'Review replacement cost', text: 'Use the estimate as a planning target for a dwelling coverage conversation.' },
  ],
  'dwelling-coverage-calculator': [
    { name: 'Enter estimated replacement cost', text: 'Use a rebuild estimate from the replacement cost calculator, insurer, appraiser, or contractor.' },
    { name: 'Enter Coverage A', text: 'Type the current dwelling limit from the homeowners insurance declarations page.' },
    { name: 'Add extended replacement coverage', text: 'Enter the endorsement percentage, such as 10%, 25%, or 50%, or 0 if none applies.' },
    { name: 'Compare the gap', text: 'Review the estimated gap before and after the extension.' },
    { name: 'Ask for an updated quote', text: 'If a gap appears, ask the insurer for an updated replacement cost estimate and coverage options.' },
  ],
  'actual-cash-value-calculator': [
    { name: 'Enter replacement cost', text: 'Type the cost to replace the item with a similar new item today.' },
    { name: 'Enter age and useful life', text: 'Add the item age and expected useful life so depreciation can be estimated.' },
    { name: 'Adjust for condition', text: 'Use a positive or negative condition adjustment when the item is better or worse than average.' },
    { name: 'Add deductible', text: 'Enter the deductible that applies to the claim.' },
    { name: 'Review ACV payout', text: 'Compare replacement cost, depreciation, ACV before deductible, and estimated payout.' },
  ],
  'coinsurance-penalty-calculator': [
    { name: 'Enter property value', text: 'Use the current replacement value for the insured property.' },
    { name: 'Set coinsurance requirement', text: 'Enter the policy requirement, such as 80%, 90%, or 100%.' },
    { name: 'Enter insurance carried', text: 'Type the limit of insurance currently carried on the property.' },
    { name: 'Add loss and deductible', text: 'Enter the covered loss amount and the deductible that applies.' },
    { name: 'Review payout and penalty', text: 'The calculator estimates required insurance, compliance ratio, penalty, and claim payout.' },
  ],
  'world-cup-match-time-converter': [
    { name: 'Enter match date', text: 'Choose the date of the World Cup match or keep the final preset.' },
    { name: 'Enter kickoff time', text: 'Type the official kickoff time from the fixture listing or broadcaster.' },
    { name: 'Select source time zone', text: 'Choose the time zone where the official kickoff time is published.' },
    { name: 'Read country times', text: 'Review converted kickoff times for US, UK, Europe, UAE, Pakistan, India, Bangladesh, and Australia.' },
    { name: 'Add to calendar', text: 'Use the Google Calendar link to save the match time in your own calendar.' },
  ],
  'on-page-seo-checker': [
    { name: 'Enter the page URL and target keyword', text: 'Add the page URL and the main query the page should satisfy.' },
    { name: 'Paste page fields or rendered HTML', text: 'Add title, meta description, H1, canonical, body copy, image count, and link counts.' },
    { name: 'Review the checker warnings', text: 'Use the score to find missing or weak on-page SEO basics before publishing.' },
    { name: 'Fix and rerun', text: 'Improve the title, description, headings, content depth, links, and image alt coverage, then run the check again.' },
  ],
  'on-page-seo-audit-tool': [
    { name: 'Enter the page URL and target keyword', text: 'Add the page URL and the main keyword you want the page to target.' },
    { name: 'Paste HTML or enter fields manually', text: 'Paste rendered HTML to extract page elements, or fill in title, description, H1, canonical, content, images, and links manually.' },
    { name: 'Review the score', text: 'Check which on-page SEO basics passed and which need work before publishing.' },
    { name: 'Fix weak sections', text: 'Improve metadata, keyword placement, content depth, internal links, external citations, and image alt text.' },
  ],
  'seo-title-checker': [
    { name: 'Paste the title tag', text: 'Enter the title you plan to publish for the page.' },
    { name: 'Check length and clarity', text: 'Review whether the title fits a useful working range and states the page purpose clearly.' },
    { name: 'Preview the search result', text: 'Use the snippet preview to see how the title may read beside the URL and description.' },
    { name: 'Rewrite around intent', text: 'Adjust the wording until the primary keyword and reason to click are both visible.' },
  ],
  'meta-description-checker': [
    { name: 'Paste the meta description', text: 'Enter the description you plan to publish for the page.' },
    { name: 'Check length and click support', text: 'Review whether it is concise, readable, and clear enough for a search result.' },
    { name: 'Preview the snippet', text: 'Compare how the description reads below the title in the preview.' },
    { name: 'Rewrite for the searcher job', text: 'Add the page promise, audience, or next action without stuffing keywords.' },
  ],
  'serp-snippet-preview-tool': [
    { name: 'Enter the page title', text: 'Paste the title tag you plan to use for the page.' },
    { name: 'Add the meta description and URL', text: 'Enter the description and canonical page URL to preview the search result.' },
    { name: 'Check desktop and mobile previews', text: 'Switch preview width to spot awkward wrapping or unclear wording.' },
    { name: 'Revise for clarity', text: 'Adjust the title and description until the snippet explains the page and gives a reason to click.' },
  ],
  'meta-tag-generator': [
    { name: 'Enter page metadata', text: 'Add the SEO title, meta description, canonical URL, Open Graph image, and robots directive.' },
    { name: 'Generate head tags', text: 'The tool creates search, canonical, robots, Open Graph, and Twitter card tags.' },
    { name: 'Copy the output', text: 'Copy the tags into your page template or use them as a reference for your framework metadata API.' },
  ],
  'schema-markup-generator': [
    { name: 'Choose a schema type', text: 'Select FAQPage, Article, HowTo, LocalBusiness, or SoftwareApplication.' },
    { name: 'Enter visible page details', text: 'Fill in the name, description, URL, image, questions, or other fields that match the visible page.' },
    { name: 'Copy JSON-LD', text: 'Copy the generated application/ld+json script and add it to the page.' },
    { name: 'Validate before publishing', text: 'Confirm the markup is truthful, visible on the page, and valid in a structured data testing tool.' },
  ],
  'robots-txt-generator': [
    { name: 'Add sitemap and crawl rules', text: 'Enter your sitemap URL and one disallow path per line.' },
    { name: 'Choose AI crawler rules', text: 'Optionally add common AI crawler disallow rules based on your content policy.' },
    { name: 'Test a path', text: 'Use the simple path tester to see whether a URL path matches a disallow rule.' },
    { name: 'Copy robots.txt', text: 'Copy the output and publish it at the root of the site.' },
  ],
  'xml-sitemap-generator': [
    { name: 'Paste canonical URLs', text: 'Add one indexable URL per line and remove redirects, duplicates, and noindex pages.' },
    { name: 'Choose sitemap fields', text: 'Select change frequency, priority, and whether to include lastmod.' },
    { name: 'Copy sitemap XML', text: 'Copy the generated XML and save it as sitemap.xml or merge it into your sitemap workflow.' },
  ],
  'hreflang-tag-generator': [
    { name: 'Enter language URL pairs', text: 'Add one language code and URL per line, such as en-us followed by the page URL.' },
    { name: 'Add x-default', text: 'Enter the fallback URL for users who do not match a specific language or region.' },
    { name: 'Copy alternate tags', text: 'Copy the hreflang link tags and add them consistently across every alternate page.' },
  ],
  'keyword-density-checker': [
    { name: 'Enter the target keyword', text: 'Add the keyword or phrase you want to check in the content.' },
    { name: 'Paste the page copy', text: 'Paste your article, landing page, or tool page content into the text box.' },
    { name: 'Review density and top terms', text: 'Check word count, reading time, keyword uses, density, and repeated terms.' },
    { name: 'Improve naturally', text: 'Use the result to catch missing usage or stuffing, then revise for readability and intent.' },
  ],
  'utm-builder': [
    { name: 'Enter the destination URL', text: 'Paste the landing page URL you want campaign visitors to reach.' },
    { name: 'Add required UTM fields', text: 'Enter source, medium, and campaign values using a consistent naming convention.' },
    { name: 'Add optional details', text: 'Use utm_term and utm_content only when they will make reporting clearer.' },
    { name: 'Copy the campaign URL', text: 'Copy the generated URL and use it in ads, newsletters, partner links, or social campaigns.' },
  ],
  'broken-link-checker': [
    { name: 'Paste link data', text: 'Add page HTML, a URL list, or crawler rows that include URL status codes.' },
    { name: 'Review detected links', text: 'Check how many internal, external, and total links the tool found.' },
    { name: 'Find broken signals', text: 'Look for 404, 5xx, empty anchor, or placeholder link warnings.' },
    { name: 'Fix or replace links', text: 'Update internal links, redirect old URLs, or replace external sources before publishing.' },
  ],
  'redirect-chain-checker': [
    { name: 'Paste redirect hops', text: 'Add one URL hop per line with the status code shown by your crawler or header tool.' },
    { name: 'Check hop count', text: 'Review whether the chain is short or has more redirects than necessary.' },
    { name: 'Confirm the final status', text: 'Make sure the final URL usually returns a clean 200 status.' },
    { name: 'Watch for loops', text: 'Use the loop warning to catch repeated URLs before a migration or redirect rule goes live.' },
  ],
  'keyword-cannibalization-checker': [
    { name: 'Paste keyword mapping rows', text: 'Add keyword, URL, and title rows separated by pipes.' },
    { name: 'Review keyword groups', text: 'Check which keywords are attached to more than one URL.' },
    { name: 'Inspect conflicts', text: 'Look at the pages competing for the same primary query or intent.' },
    { name: 'Choose the canonical target', text: 'Merge, redirect, or reposition pages so each important intent has one clear primary URL.' },
  ],
  'url-slug-generator': [
    { name: 'Paste a title or phrase', text: 'Enter the blog headline, tool name, product name, or landing page topic.' },
    { name: 'Choose slug settings', text: 'Select separator, case, and maximum length based on your URL style.' },
    { name: 'Review length and core terms', text: 'Check whether the slug is readable and includes useful descriptive words.' },
    { name: 'Copy the slug', text: 'Use the slug when creating the page, or add a redirect if changing an existing URL.' },
  ],
  'faq-schema-generator': [
    { name: 'Enter the page URL', text: 'Add the URL where the visible FAQ section will appear.' },
    { name: 'Paste visible FAQs', text: 'Add each question and answer with a blank line between FAQ blocks.' },
    { name: 'Review the FAQ count', text: 'Confirm the schema only includes questions and answers users can see on the page.' },
    { name: 'Copy JSON-LD', text: 'Copy the FAQPage script and validate it before publishing.' },
  ],
  'canonical-tag-checker': [
    { name: 'Enter the current URL', text: 'Paste the duplicate, parameter, or current page URL you want to check.' },
    { name: 'Add the canonical URL', text: 'Enter the preferred URL that should represent the content in search.' },
    { name: 'Review robots state and duplicates', text: 'Check whether the page is indexable and whether duplicate examples point toward the canonical target.' },
    { name: 'Copy the canonical tag', text: 'Use the generated rel canonical tag when the preferred URL is correct.' },
  ],
  'keyword-clustering-tool': [
    { name: 'Paste a keyword list', text: 'Add one keyword per line from Ahrefs, Search Console, or your own research.' },
    { name: 'Review generated clusters', text: 'Check how the tool groups related keywords by dominant topic terms.' },
    { name: 'Adjust by search intent', text: 'Manually confirm which queries belong on one page and which need separate pages.' },
    { name: 'Copy the cluster map', text: 'Use the output to plan category pages, blog posts, support pages, or tool pages.' },
  ],
  'open-graph-preview-tool': [
    { name: 'Enter OG metadata', text: 'Add the Open Graph title, description, page URL, and image URL.' },
    { name: 'Inspect the card preview', text: 'Check whether the social card is clear, readable, and visually credible.' },
    { name: 'Review title and description length', text: 'Keep the card text short enough to scan on social platforms.' },
    { name: 'Copy social tags', text: 'Copy the Open Graph and Twitter card tags into your page metadata workflow.' },
  ],
  'content-brief-generator': [
    { name: 'Enter the target keyword', text: 'Add the main keyword or phrase the page should satisfy.' },
    { name: 'Define audience and page type', text: 'Choose whether the asset is a blog post, tool page, category page, or landing page.' },
    { name: 'Add competitor gaps', text: 'Paste notes about what ranking pages miss, hide, or fail to help users do.' },
    { name: 'Copy the brief', text: 'Use the generated outline, FAQ ideas, internal links, and CTA plan to guide the content.' },
  ],
  'rate-increase-calculator': [
    { name: 'Enter your current hourly rate', text: 'Type your current freelance hourly rate.' },
    { name: 'Set your planned increase percentage', text: 'Enter how much you want to raise your rate (10–25% is typical for annual increases).' },
    { name: 'Add your billable hours', text: 'Enter your average billable hours per week and billable weeks per year.' },
    { name: 'See the revenue impact', text: 'The calculator shows your new rate, extra monthly revenue, and additional annual income.' },
    { name: 'Compare increase scenarios', text: 'The table shows how different increase percentages (10%, 15%, 20%, 25%, 30%) affect your earnings.' },
    { name: 'Send the client notice', text: 'Use the built-in email template to notify existing clients of your rate increase professionally.' },
  ],
  'working-days-calculator': [
    { name: 'Choose your mode', text: 'Select "Days Between Two Dates" to count business days in a range, or "Add Working Days" to calculate a deadline.' },
    { name: 'Enter your start date', text: 'Pick the start date (e.g., today or the date you receive a project brief).' },
    { name: 'Enter end date or days to add', text: 'Either enter the end date of the range, or the number of business days you want to add.' },
    { name: 'Toggle holiday exclusion', text: 'Check or uncheck the US public holidays option depending on your situation.' },
    { name: 'Read your result', text: 'See the exact number of working days (for ranges) or the exact deadline date (for day addition).' },
  ],
  'time-zone-converter': [
    { name: 'Select your time zone', text: 'Choose your local time zone from the dropdown.' },
    { name: 'Select client time zone', text: 'Choose the time zone where your client or team member is located.' },
    { name: 'Enter a time', text: 'Pick a time in your zone to see what it is in the client\'s zone.' },
    { name: 'Find overlap hours', text: 'The overlap panel highlights hours that fall within business hours (9am–6pm) for both parties.' },
  ],
  'upwork-fee-calculator': [
    { name: 'Enter the project amount', text: 'Type in the total amount you\'ll charge the client on Upwork.' },
    { name: 'Enter the service fee shown by Upwork', text: 'Use the freelancer service fee percentage shown when you submit a proposal or receive an offer. Upwork says this can vary by contract from 0% to 15%.' },
    { name: 'Read the fee breakdown', text: 'The calculator shows the estimated Upwork fee, your net earnings, and the gross quote needed to hit a target take-home amount.' },
  ],
}

export function buildToolJsonLd(tool: ToolMeta) {
  const toolUrl = `${SITE_URL}/tools/${tool.slug}`
  const howToSteps = HOW_TO_STEPS[tool.slug]

  const schemas: object[] = [
    {
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: tool.title,
      url: toolUrl,
      description: tool.description,
      applicationCategory: 'BusinessApplication',
      applicationSubCategory: 'WebApplication',
      operatingSystem: 'Web',
      browserRequirements: 'Requires JavaScript',
      featureList: tool.keywords,
      isAccessibleForFree: true,
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
        availability: 'https://schema.org/InStock',
      },
      creator: {
        '@type': 'Organization',
        name: 'FreelancerToolkit',
        url: SITE_URL,
      },
    },
  ]

  if (howToSteps) {
    schemas.push({
      '@context': 'https://schema.org',
      '@type': 'HowTo',
      name: `How to use the ${tool.title}`,
      description: tool.description,
      url: toolUrl,
      tool: [{ '@type': 'HowToTool', name: tool.title }],
      step: howToSteps.map((s, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    })
  }

  return schemas
}

export function buildFaqJsonLd(tool: ToolMeta) {
  if (!tool.faqs || tool.faqs.length === 0) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: tool.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function buildBreadcrumbJsonLd(tool: ToolMeta) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: tool.category,
        item: `${SITE_URL}${getCategoryUrlForTool(tool)}`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: tool.title,
        item: `${SITE_URL}/tools/${tool.slug}`,
      },
    ],
  }
}

export function generateStaticParamsForTool(slug: string) {
  const tool = getToolBySlug(slug)
  return (tool?.programmaticVariants ?? []).map((v) => ({ variant: v.slug }))
}

export function getVariantOrNotFound(slug: string, variantSlug: string) {
  const tool = getToolBySlug(slug)
  const variant = tool?.programmaticVariants?.find((v) => v.slug === variantSlug)
  if (!tool || !variant) notFound()
  return { tool, variant }
}
