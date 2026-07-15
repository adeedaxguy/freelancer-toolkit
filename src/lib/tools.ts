import { ADVANCED_TOOL_CATEGORIES, type AdvancedToolConfig } from './advancedTools'

export interface ToolMeta {
  slug: string
  title: string
  headline: string
  description: string
  icon: string
  category: string
  keywords: string[]
  faqs: { q: string; a: string }[]
  answerBox?: { short: string; bullets?: string[] }
  programmaticVariants?: { slug: string; label: string; values?: Record<string, number | string> }[]
  seoTitle?: string
  bodySections?: { heading: string; body: string }[]
  advancedTool?: AdvancedToolConfig
}

export interface ToolCategory {
  name: string
  slug: string
  description: string
  tools: ToolMeta[]
}

export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: 'Pricing & Profitability',
    slug: 'pricing',
    description: 'Calculate your rates, quote projects, and stay profitable.',
    tools: [
      {
        slug: 'freelancer-rate-calculator',
        title: 'Freelancer Rate Calculator',
        headline: 'Calculate Your Freelance Hourly Rate',
        description: 'Free freelancer rate calculator. Enter your income goal, working hours, tax rate, and expenses to get your minimum hourly, daily, and monthly rate.',
        icon: '💰',
        category: 'Pricing & Profitability',
        keywords: ['freelancer rate calculator', 'freelance hourly rate calculator', 'how much should I charge as a freelancer'],
        faqs: [
          { q: 'How do I calculate my freelance hourly rate?', a: 'Divide your required gross annual income (take-home goal + taxes + expenses) by the number of billable hours per year. For example, $100,000 gross ÷ 1,440 hours = ~$69/hr.' },
          { q: 'What is a good freelance hourly rate?', a: 'Rates vary by skill and market. Entry-level freelancers often charge $25–$50/hr, mid-level $50–$150/hr, and senior specialists $150–$500/hr.' },
          { q: 'Should I charge more than my full-time equivalent?', a: 'Yes. As a freelancer you pay self-employment taxes, your own benefits, and have unbillable admin time. A 1.5–2× multiplier over your employee rate is common.' },
          { q: 'How many billable hours should I plan for?', a: 'Most freelancers bill 15–25 hours out of a 40-hour week. The rest is sales, admin, and non-billable work. Plan conservatively to avoid undercharging.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-developers', label: 'for Web Developers' },
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'for-marketers', label: 'for Marketers' },
          { slug: 'for-copywriters', label: 'for Copywriters' },
          { slug: 'for-consultants', label: 'for Consultants' },
        ],
      },
      {
        slug: 'project-cost-calculator',
        title: 'Project Cost Calculator',
        headline: 'Calculate Your Freelance Project Quote',
        description: 'Free project cost calculator and project price calculator for freelancers and agencies. Estimate hours, add a scope buffer and revisions, and get the right quote to stay profitable.',
        seoTitle: 'Free Project Price Calculator for Freelancers | Quote Projects',
        icon: '📋',
        category: 'Pricing & Profitability',
        keywords: ['project cost calculator', 'project price calculator', 'freelance project pricing', 'how to quote a freelance project', 'freelance services pricing calculator', 'freelance price calculator', 'project quote calculator'],
        answerBox: {
          short: 'A freelance project cost calculator should start with delivery hours, then add revision time and a 15-25% scope buffer before you send a fixed quote. That keeps the client price tied to real effort instead of guesswork.',
          bullets: ['Best fit: fixed-scope freelance and agency quotes', 'Outperformance angle: reverse-pricing plus revision and scope-risk protection'],
        },
        faqs: [
          { q: 'How do I price a freelance project?', a: "Estimate hours × your hourly rate, then add a 15–25% scope buffer for unknowns, plus hours for revisions. This gives a quote that protects your margin." },
          { q: 'What is a scope buffer?', a: "A scope buffer (typically 15–25%) is padding added to your base estimate to cover unexpected work, client changes, or complexity you didn't anticipate." },
          { q: 'How many revision rounds should I include?', a: '2–3 revision rounds is standard for most creative or development projects. Define what counts as a revision in your contract to avoid scope creep.' },
          { q: 'Is this a project price calculator or a cost calculator?', a: 'Both. The calculator starts with your internal cost estimate, then turns it into a client-facing project price by adding buffers, revision time, and profit protection.' },
          { q: 'Can I use this as a freelance services pricing calculator?', a: 'Yes. Use it for web design, development, marketing, writing, consulting, and agency services where you need to convert estimated effort into a fixed project quote.' },
        ],
        bodySections: [
          {
            heading: 'Project price calculator for real quotes',
            body: 'Use this when a client asks for a fixed project price and you need a defensible number fast. It converts estimated hours, your rate, revision time, and scope buffer into a quote you can explain in a proposal.',
          },
          {
            heading: 'Freelance services pricing without guesswork',
            body: 'The safest price starts with your costs, then adds protection for unknowns. This calculator helps freelancers and agencies avoid undercharging by including the non-obvious work around communication, revisions, QA, and handoff.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-1000', label: 'for $1,000 Projects' },
          { slug: 'for-5000', label: 'for $5,000 Projects' },
          { slug: 'for-10000', label: 'for $10,000 Projects' },
        ],
      },
      {
        slug: 'project-price-calculator',
        title: 'Project Price Calculator',
        headline: 'Calculate the Right Price for a Freelance Project',
        description: 'Free project price calculator for freelancers and agencies. Estimate hours, rate, revision time, scope buffer, and fixed-price risk before sending a client quote.',
        seoTitle: 'Project Price Calculator for Freelancers | Free Quote Tool',
        icon: '🏷️',
        category: 'Pricing & Profitability',
        keywords: ['project price calculator', 'freelance project price calculator', 'project quote calculator', 'fixed price project calculator', 'client project pricing tool', 'project pricing calculator for freelancers', 'freelance quote calculator'],
        answerBox: {
          short: 'Use a project price calculator when you need the client-facing quote, not just the internal delivery cost. The safe workflow is hours + rate + revisions + scope buffer, then convert that into a price you can defend in a proposal.',
          bullets: ['Best fit: freelancer, agency, and consulting project quotes', 'Outperformance angle: freelancer-specific pricing instead of generic construction or software estimators'],
        },
        faqs: [
          { q: 'What is a project price calculator?', a: 'A project price calculator turns estimated work, hourly rate, revisions, and scope buffer into a client-facing fixed price. It helps you quote based on real effort instead of guessing.' },
          { q: 'Is project price different from project cost?', a: 'Yes. Project cost is what it takes you to deliver the work. Project price is what the client pays after adding margin, risk buffer, revisions, and value.' },
          { q: 'How much buffer should I add to a fixed-price project?', a: 'Most freelancers add a 15-25% scope buffer. Use a higher buffer if requirements are unclear, stakeholders are slow, or the project has technical risk.' },
          { q: 'Can I use this for agency pricing?', a: 'Yes. It works for freelancers and agencies when you know the estimated hours, blended rate, revision time, and scope buffer.' },
          { q: 'Can I use this for web design or SEO projects?', a: 'Yes. Use it for web design, SEO, development, writing, consulting, and other fixed-scope services where you need to turn effort and risk into a quote.' },
          { q: 'What should I do after calculating the project price?', a: 'Turn the price into a proposal, then document the scope. FreelTools pairs this calculator with the Proposal Generator and Scope of Work Generator so the quote is easier to explain.' },
        ],
        bodySections: [
          {
            heading: 'Project price calculator for client quotes',
            body: 'Use this exact-match calculator when a client asks "how much will this project cost?" Start with your delivery estimate, then add revision time and a scope buffer so the final price protects your margin.',
          },
          {
            heading: 'Built for fixed-price freelance work',
            body: 'Fixed-price work can be profitable only when the quote includes non-obvious time. This calculator makes room for project management, QA, revisions, and the uncertainty that usually appears after kickoff.',
          },
          {
            heading: 'From calculator to proposal',
            body: 'After you calculate the price, use the Proposal Generator to explain the value and the Scope of Work Generator to define what is included. That workflow keeps the client-facing number connected to deliverables, timeline, revisions, and payment terms.',
          },
          {
            heading: 'Useful across service types',
            body: 'The same pricing logic works for web design, development, SEO, writing, consulting, design, and agency services. Adjust the hours, revision allowance, and buffer based on how clear the scope is.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-web-design-projects', label: 'for Web Design Projects' },
          { slug: 'for-seo-projects', label: 'for SEO Projects' },
          { slug: 'for-consulting-projects', label: 'for Consulting Projects' },
          { slug: 'for-fixed-price-projects', label: 'for Fixed-Price Projects' },
          { slug: 'for-agency-projects', label: 'for Agency Projects' },
        ],
      },
      {
        slug: 'freelance-services-pricing-calculator',
        title: 'Freelance Services Pricing Calculator',
        headline: 'Price Freelance Services Without Guesswork',
        description: 'Free freelance services pricing calculator. Price web design, SEO, writing, consulting, and agency services with hours, rate, revisions, and profit protection built in.',
        seoTitle: 'Freelance Services Pricing Calculator | Free Tool',
        icon: '🧾',
        category: 'Pricing & Profitability',
        keywords: ['freelance services pricing calculator', 'freelance service pricing tool', 'price freelance services', 'service business pricing calculator', 'freelance pricing calculator'],
        answerBox: {
          short: 'A freelance services pricing calculator helps you price packaged services by including production time, revisions, project management, and a scope buffer. It is more useful than a plain hourly worksheet when you sell service bundles or retainers.',
          bullets: ['Best fit: packaged SEO, design, writing, and consulting offers', 'Outperformance angle: ties service pricing to real delivery time and margin protection'],
        },
        faqs: [
          { q: 'How do I price freelance services?', a: 'Break the service into tasks, estimate hours, multiply by your rate, then add time for revisions, communication, QA, and scope risk. The calculator turns that into a quote.' },
          { q: 'What services can I price with this?', a: 'Use it for web design, development, SEO, copywriting, content, consulting, creative services, and agency packages.' },
          { q: 'Should I charge hourly or fixed price?', a: 'If the scope is clear, use the calculator to create a fixed price. If the scope is unclear or ongoing, hourly or retainer pricing may be safer.' },
          { q: 'How do I avoid underpricing services?', a: 'Include non-billable delivery time, revisions, project management, and a scope buffer. Underpricing usually happens when freelancers only count production hours.' },
        ],
        bodySections: [
          {
            heading: 'Freelance service pricing for real projects',
            body: 'This page is designed for searchers pricing services, not just one-off tasks. Add your estimated delivery hours, revision allowance, and buffer so the quote reflects the full work required.',
          },
          {
            heading: 'Useful for packaged services',
            body: 'If you sell service packages, run each package through the calculator before publishing prices. A package should cover delivery time, meetings, revisions, admin, and enough margin to stay worth selling.',
          },
        ],
      },
      {
        slug: 'freelance-pricing-calculator',
        title: 'Freelance Pricing Calculator',
        headline: 'Calculate a Profitable Freelance Price',
        description: 'Free freelance pricing calculator for project quotes and service packages. Estimate your effort, add a scope buffer, and find a price that protects your freelance income.',
        seoTitle: 'Freelance Pricing Calculator | Free Project Quote Tool',
        icon: '💵',
        category: 'Pricing & Profitability',
        keywords: ['freelance pricing calculator', 'freelance price calculator', 'freelance quote calculator', 'freelance project pricing calculator', 'freelance pricing template'],
        answerBox: {
          short: 'A freelance pricing calculator should show the price that protects your take-home income after revision time and scope risk, not only hours times rate. That makes it useful for fast quotes when you do not want to rebuild a spreadsheet.',
          bullets: ['Best fit: one-off quotes and simple service packages', 'Outperformance angle: faster browser workflow than generic spreadsheet templates'],
        },
        faqs: [
          { q: 'What should I enter in a freelance pricing calculator?', a: 'Enter your estimated hours, hourly rate, revision time, and scope buffer. The calculator will turn those inputs into a recommended project price.' },
          { q: 'Can this replace a pricing spreadsheet?', a: 'For many simple quotes, yes. It gives you a fast browser-based pricing workflow without downloading a spreadsheet or template.' },
          { q: 'Does this include taxes?', a: 'This calculator focuses on project price before taxes. Use a tax or profit calculator afterward to decide how much to reserve.' },
          { q: 'Is this for beginners or experienced freelancers?', a: 'Both. Beginners use it to stop guessing. Experienced freelancers use it to sanity-check fixed-price quotes before sending proposals.' },
        ],
        bodySections: [
          {
            heading: 'Freelance pricing calculator for fast quotes',
            body: 'Use this when you need a quote today and do not want to build a spreadsheet. The calculator gives you a structured way to move from estimated work to a price you can defend.',
          },
          {
            heading: 'Quote from effort plus risk',
            body: 'Good pricing is not only hours times rate. It also includes revision risk, communication, waiting time, and scope uncertainty. This tool keeps those costs visible before you send the number.',
          },
        ],
      },
      {
        slug: 'agency-pricing-calculator',
        title: 'Agency Pricing Calculator',
        headline: 'Price Agency Services for Profit',
        description: 'Free agency pricing calculator. Enter team costs, overhead, and desired margin to get the right client price and see your gross profit.',
        icon: '🏢',
        category: 'Pricing & Profitability',
        keywords: ['agency pricing calculator', 'agency profit calculator', 'how to price agency services'],
        faqs: [
          { q: 'What gross margin should an agency target?', a: 'Most healthy agencies target 40–60% gross margin (revenue minus direct labor). Below 30% is a warning sign; above 60% is exceptional.' },
          { q: 'What is included in agency overhead?', a: 'Overhead includes office rent, software subscriptions, sales and marketing costs, management time, and any admin expenses not directly tied to a client.' },
          { q: 'How should I price a new agency client?', a: "Start by calculating your fully-loaded monthly cost (team + overhead), then mark it up to your target margin. Adjust based on market rates and client value." },
        ],
        programmaticVariants: [
          { slug: 'for-small-agencies', label: 'for Small Agencies' },
          { slug: 'for-boutique-agencies', label: 'for Boutique Agencies' },
          { slug: 'for-digital-agencies', label: 'for Digital Agencies' },
        ],
      },
      {
        slug: 'retainer-calculator',
        title: 'Retainer Calculator',
        headline: 'Calculate Your Monthly Retainer Fee',
        description: 'Free retainer calculator for freelancers and agencies. Set your monthly hours, rate, and discount to find the right retainer price.',
        icon: '🔁',
        category: 'Pricing & Profitability',
        keywords: ['retainer calculator', 'monthly retainer pricing', 'freelance retainer fee calculator'],
        faqs: [
          { q: 'What is a freelance retainer?', a: "A retainer is a monthly agreement where a client pays a fixed fee in advance for a set number of hours or deliverables. It provides predictable income for you and priority access for them." },
          { q: 'How much discount should I give for a retainer?', a: "5–15% is typical. The discount rewards the client for commitment and predictability, but shouldn't significantly cut into your profitability." },
          { q: 'What should a retainer agreement include?', a: 'Monthly hours or deliverables, rollover policy, scope boundaries, payment terms (usually upfront), and a termination clause with notice period.' },
        ],
        programmaticVariants: [
          { slug: 'for-10-hours', label: 'for 10 Hours/Month' },
          { slug: 'for-20-hours', label: 'for 20 Hours/Month' },
          { slug: 'for-40-hours', label: 'for 40 Hours/Month' },
        ],
      },
      {
        slug: 'profit-calculator',
        title: 'Profit Calculator',
        headline: 'Calculate Your Freelance Profit & Margins',
        description: 'Free profit calculator for freelancers and small businesses. Enter revenue, costs, and tax rate to get gross profit, net profit, and margin percentages.',
        icon: '📊',
        category: 'Pricing & Profitability',
        keywords: ['freelance profit calculator', 'business profit calculator', 'profit margin calculator'],
        faqs: [
          { q: 'What is the difference between gross profit and net profit?', a: 'Gross profit is revenue minus direct costs (COGS). Net profit is what remains after subtracting all expenses and taxes from gross profit.' },
          { q: 'What is a good profit margin for a freelancer?', a: 'A net margin of 30–50% is considered healthy for freelancers. Agencies typically run 10–20% net margin due to higher overhead.' },
          { q: 'What counts as COGS for a freelancer?', a: 'Direct costs tied to delivery: subcontractors, stock assets, project-specific software, or any tool/service billed only when you have a client.' },
        ],
        programmaticVariants: [
          { slug: 'for-10000-revenue', label: 'for $10,000 Revenue' },
          { slug: 'for-50000-revenue', label: 'for $50,000 Revenue' },
          { slug: 'for-100000-revenue', label: 'for $100,000 Revenue' },
        ],
      },
      {
        slug: 'rate-increase-calculator',
        title: 'Freelance Rate Increase Calculator',
        headline: 'Calculate the Impact of Raising Your Freelance Rates',
        description: 'Free freelance rate increase calculator. See how much extra revenue a 10%, 20%, or 30% rate increase generates annually. Includes a client notice email template.',
        icon: '📈',
        category: 'Pricing & Profitability',
        keywords: ['freelance rate increase calculator', 'raise freelance rates', 'how much should I increase my freelance rate', 'freelancer rate increase', 'when to raise freelance prices'],
        faqs: [
          { q: 'How often should freelancers raise their rates?', a: 'Most experienced freelancers raise rates annually to keep up with inflation (3–5%) and skill growth. A 10–20% annual increase is common. If you\'re fully booked and turning down work, that\'s a clear sign to raise rates significantly.' },
          { q: 'How much should I raise my freelance rate?', a: 'Entry-level freelancers often raise 10–15% annually. Mid-career freelancers targeting a new market or niche can jump 25–50% at once. If your rate hasn\'t changed in 2+ years, a one-time 20–30% increase is reasonable to catch up.' },
          { q: 'How do I tell clients I\'m raising my rates?', a: 'Give at least 30 days notice, frame it positively (value you\'ve delivered, market rates), keep it brief, and honor existing project rates through completion. Most good clients will accept a reasonable increase if you communicate it professionally.' },
          { q: 'Will I lose clients by raising my rates?', a: 'You may lose some price-sensitive clients — but that\'s often a feature, not a bug. Higher rates attract higher-quality clients who value your work. Calculate the break-even: if a 20% rate increase costs you one small client, you\'ll make up for it with fewer hours on remaining clients.' },
          { q: 'What is the best time of year to raise freelance rates?', a: 'January 1st is the most natural time — clients expect it and it aligns with budget cycles. Alternatively, raise rates at the start of a new project or engagement, or immediately after a major win or delivered result.' },
        ],
        programmaticVariants: [
          { slug: 'by-10-percent', label: 'by 10%' },
          { slug: 'by-20-percent', label: 'by 20%' },
          { slug: 'by-25-percent', label: 'by 25%' },
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'for-developers', label: 'for Developers' },
        ],
      },
    ],
  },
  {
    name: 'Marketplace Tools',
    slug: 'marketplace',
    description: 'Calculate fees and compare pricing across freelance marketplaces.',
    tools: [
      {
        slug: 'upwork-fee-calculator',
        title: 'Upwork Fee Calculator',
        headline: 'Upwork Fee Calculator for Real Take-Home Pay',
        description: 'Free Upwork fee calculator. Enter your project amount and the freelancer service fee shown by Upwork to estimate net earnings, reverse-calculate a bid, and protect your take-home pay.',
        seoTitle: 'Upwork Fee Calculator | Estimate Net Earnings Before You Bid',
        icon: '🔢',
        category: 'Marketplace Tools',
        keywords: ['upwork fee calculator', 'upwork fees calculator', 'upwork earnings calculator', 'upwork freelancer service fee', 'upwork take home calculator', 'how much does upwork charge freelancers', 'upwork bid calculator'],
        faqs: [
          { q: 'How much does Upwork charge freelancers?', a: 'Upwork says freelancer service fees can vary by contract from 0% to 15%. The exact fee is shown when you submit a proposal, receive an offer, and in contract details.' },
          { q: 'What fee should I enter in this calculator?', a: 'Enter the percentage Upwork shows for the specific job or contract. If you are only planning, 10% is a common example, but always confirm the actual rate before bidding.' },
          { q: 'How do I get paid more on Upwork?', a: 'Quote from your desired net earnings, not just the gross project amount. Raise your rate enough to cover the freelancer service fee, taxes, proposal time, and non-billable admin.' },
          { q: 'Can this help me price a fixed bid from my target net?', a: 'Yes. Start with the amount you want to keep, then reverse-calculate the gross quote needed after the displayed Upwork fee. That is the safest way to price platform work.' },
          { q: 'What is Upwork Connects?', a: "Connects are tokens used to bid on jobs. They don't reduce your earnings but are a cost to factor into your Upwork ROI calculation." },
        ],
        bodySections: [
          {
            heading: 'Estimate Upwork take-home pay before you bid',
            body: 'Searchers comparing Upwork fees usually want one number: what they will actually keep. Enter the project value and the freelancer service fee shown by Upwork to estimate your net earnings before you send the proposal.',
          },
          {
            heading: 'Reverse-calculate your quote',
            body: 'If you need to take home a specific amount, use the reverse calculator to find the gross quote. This prevents platform fees from quietly shrinking your target rate after the client accepts.',
          },
          {
            heading: 'Useful for hourly and fixed-price contracts',
            body: 'The fee logic is the same whether you are pricing a milestone, a one-off fixed bid, or an hourly contract. Use the displayed fee from Upwork, then adjust your quote so the contract still hits your real income target.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-500', label: 'for $500 Projects' },
          { slug: 'for-1000', label: 'for $1,000 Projects' },
          { slug: 'for-5000', label: 'for $5,000 Projects' },
          { slug: 'for-10000', label: 'for $10,000 Projects' },
        ],
      },
      {
        slug: 'freelancer-commission-calculator',
        title: 'Freelancer Fees Calculator',
        headline: 'Compare Marketplace Fees Across Freelance Platforms',
        description: 'Free freelancer fees calculator for Upwork, Fiverr, Freelancer.com, and PeoplePerHour. Compare platform deductions, buyer-visible pricing, and the take-home pay you keep on the same project value.',
        seoTitle: 'Freelancer Fees Calculator | Compare Upwork, Fiverr, Freelancer.com',
        icon: '🧮',
        category: 'Marketplace Tools',
        keywords: ['freelancer fees calculator', 'freelancer commission calculator', 'freelancer fee calculator', 'compare freelance platform fees', 'fiverr fee calculator', 'freelancer.com commission', 'peopleperhour fees', 'freelance platform fees'],
        faqs: [
          { q: 'How much does Fiverr take from sellers?', a: 'Fiverr charges a 20% commission on all seller earnings, regardless of order size.' },
          { q: 'What are Freelancer.com fees?', a: 'Freelancer.com charges 10% or $5 (whichever is greater) on fixed-price projects, and 10% on hourly projects.' },
          { q: 'Which freelance marketplace has the lowest fees?', a: 'It depends on the contract and platform rules. Freelancer.com is often 10% or $5 minimum, Fiverr is 20%, and Upwork says freelancer service fees can vary by contract from 0% to 15%.' },
          { q: 'How do I compare marketplaces?', a: 'Factor in fee percentage, typical project size, competition level, and how easy it is to find clients. Use this calculator to compare net earnings side-by-side.' },
          { q: 'Should I compare gross price or take-home pay?', a: 'Take-home pay matters more. Two platforms can bring the same headline project value but leave very different net earnings after fees, minimums, and buyer-facing charges.' },
        ],
        bodySections: [
          {
            heading: 'Freelancer fees calculator for marketplace work',
            body: 'Use this page when you need to compare platform deductions before accepting a job. A $1,000 project can produce very different take-home pay depending on whether it runs through Upwork, Fiverr, Freelancer.com, or PeoplePerHour.',
          },
          {
            heading: 'Compare gross revenue against net earnings',
            body: 'Gross project value is not the same as income. Marketplace fees, minimum fees, and platform-specific rules change your net. Run the numbers before you bid so your price still supports your target rate.',
          },
          {
            heading: 'Useful when deciding which platform to prioritize',
            body: 'Use the comparison workflow when the same service could be sold on more than one marketplace. Seeing the net side-by-side makes it easier to spot when a higher-fee platform needs a higher quoted price to stay worth the work.',
          },
        ],
        programmaticVariants: [
          { slug: 'upwork', label: 'for Upwork' },
          { slug: 'fiverr', label: 'for Fiverr' },
          { slug: 'freelancer-com', label: 'for Freelancer.com' },
          { slug: 'peopleperhour', label: 'for PeoplePerHour' },
        ],
      },
      {
        slug: 'fiverr-fee-calculator',
        title: 'Fiverr Fee Calculator',
        headline: 'Fiverr Fee Calculator for Seller Net, Buyer Total, and Gig Pricing',
        description: 'Free Fiverr fee calculator for sellers and buyers. Estimate seller fees, buyer service fees, small-order fees, take-home pay, buyer checkout total, and the gig price needed to hit your target net income.',
        seoTitle: 'Fiverr Fee Calculator | Seller Net, Buyer Total, Gig Price',
        icon: '🟢',
        category: 'Marketplace Tools',
        keywords: ['fiverr fee calculator', 'fiverr calculator', 'fiverr seller fee calculator', 'fiverr buyer fee calculator', 'how much does fiverr take', 'fiverr seller fees', 'fiverr buyer service fee', 'fiverr small order fee', 'fiverr profit calculator', 'fiverr 20 percent calculator', 'fiverr commission calculator', 'fiverr gig price calculator', 'fiverr take home calculator'],
        answerBox: {
          short: 'For planning, many freelancers model Fiverr seller fees at 20% of the order value, so a $100 order leaves about $80 before taxes and withdrawal costs. This calculator goes further by showing buyer fees, small-order fees, tips, and the gross price needed to hit a target net.',
          bullets: ['Best fit: sellers pricing gigs and buyers checking checkout totals', 'Outperformance angle: seller net, buyer total, and reverse pricing on one page'],
        },
        faqs: [
          { q: 'How much does Fiverr take from a $100 gig?', a: 'Using the common 20% seller-fee planning model, Fiverr takes about $20 from a $100 order and the seller keeps about $80 before taxes, withdrawal costs, or currency conversion.' },
          { q: 'How much does Fiverr take from sellers?', a: 'The standard Fiverr seller fee is commonly planned as 20% of the order value. If your gig is priced at $100, the calculator shows a $20 Fiverr fee and $80 seller net before taxes, withdrawal costs, or currency conversion.' },
          { q: 'Does Fiverr take 20% from tips too?', a: 'For planning, include tips in the same 20% seller-fee calculation unless Fiverr shows a different rule in your account. The calculator has a separate tip field so you can see the fee and net amount on the full order plus tip.' },
          { q: 'What fee does the buyer pay on Fiverr?', a: 'Buyers usually see a service fee added on top of the gig price. The calculator defaults to 5.5% plus a $2 small-order fee below $50 because that is the search intent many buyers and sellers are checking. You can adjust the buyer fee assumptions if Fiverr shows a different checkout fee.' },
          { q: 'What is the Fiverr small-order fee?', a: 'The small-order fee is an extra buyer-side charge applied below a threshold. This calculator defaults to $2 below $50 and makes both values editable so you can model the fee Fiverr shows at checkout.' },
          { q: 'How do I price my Fiverr gig to hit a target net income?', a: 'Divide your target net by 0.80 when using the standard 20% seller fee. For example, to take home $80, set the gig price at $100. The reverse calculator does this automatically for any target amount and fee percentage.' },
          { q: 'Why compare buyer total and seller net on the same page?', a: 'Fiverr pricing decisions affect both sides of the order. Sellers need to know what they keep, while buyers may react to the full checkout total once service fees and small-order fees appear.' },
          { q: 'How does Fiverr compare with Upwork fees?', a: 'Fiverr is simpler for planning because the seller fee is usually modeled as a fixed 20%. Upwork fees can vary by contract, so use the Upwork fee shown before accepting a job and compare the resulting take-home pay against Fiverr.' },
          { q: 'Are Fiverr withdrawal fees included?', a: 'No. The calculator focuses on Fiverr order fees: seller commission, buyer service fee, small-order fee, and tips. Withdrawal fees, bank fees, PayPal fees, local taxes, and currency conversion can still reduce the money that reaches your bank.' },
          { q: 'Do Fiverr Logo Maker or special program fees work differently?', a: 'Some Fiverr programs can have special rules or tiered rates. Use the editable fee fields for planning, but confirm the final earning percentage inside Fiverr before relying on the number for a specific program.' },
          { q: 'Can I avoid Fiverr fees by taking clients off-platform?', a: 'Fiverr\'s terms of service prohibit moving clients off the platform to avoid fees. Violations can result in account suspension. It\'s better to raise your prices to account for the 20% cut.' },
        ],
        bodySections: [
          {
            heading: 'How much does Fiverr take from a $100 order?',
            body: 'For quick planning, many sellers model Fiverr at a 20% seller fee. That means a $100 gig leaves about $80 before taxes and withdrawal costs. This page lets users test that math instantly on custom offers, milestones, tips, and larger package prices.',
          },
          {
            heading: 'Fiverr fee calculator for sellers',
            body: 'Enter any gig price, custom offer, milestone, or tip to see the estimated Fiverr seller fee and real take-home amount. This helps you avoid pricing a package at the amount you want to keep, then losing 20% after the order closes.',
          },
          {
            heading: 'Fiverr buyer fee and small-order fee',
            body: 'The calculator also estimates what a buyer sees at checkout by adding a buyer service fee and a small-order fee below the threshold you set. This is useful when you want to understand why a low-price gig can feel more expensive to the client.',
          },
          {
            heading: 'Price gigs from your desired net',
            body: 'Use the reverse calculator to start with the amount you want to keep, then set a Fiverr gig price that leaves room for the platform cut. A seller who wants to net $400 at a 20% fee needs to charge $500 before taxes and withdrawals.',
          },
          {
            heading: 'What this page does better than a fee article',
            body: 'Most Fiverr fee guides explain the seller commission in text. This page lets users calculate buyer totals, seller net earnings, tips, small-order fees, and target gig prices in one workflow, then compare common package prices without leaving the page.',
          },
          {
            heading: 'Built for the exact Fiverr fee questions searchers ask',
            body: 'This page covers the practical scenarios behind Fiverr fee searches: what happens on a $50 or $100 gig, how tips affect take-home pay, how buyer fees change the checkout total, and how to set a price from the amount you want to keep.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-50-gig', label: 'for $50 Gigs' },
          { slug: 'for-100-gig', label: 'for $100 Gigs' },
          { slug: 'for-500-gig', label: 'for $500 Gigs' },
          { slug: 'vs-upwork', label: 'vs Upwork' },
        ],
      },
      {
        slug: 'fiverr-seller-fee-calculator',
        title: 'Fiverr Seller Fee Calculator',
        headline: 'Calculate Fiverr Seller Fees and Net Earnings',
        description: 'Free Fiverr seller fee calculator. Enter any gig price, custom offer, or tip to estimate Fiverr seller fees, net earnings, and the price needed to hit your target take-home pay.',
        seoTitle: 'Fiverr Seller Fee Calculator | Free Net Earnings Tool',
        icon: '🟢',
        category: 'Marketplace Tools',
        keywords: ['fiverr seller fee calculator', 'fiverr fees for sellers', 'fiverr seller fees', 'how much fiverr charge from seller', 'fiverr seller commission calculator'],
        answerBox: {
          short: 'A Fiverr seller fee calculator is for one decision: how much of the order you actually keep. Start with the gig price or target take-home amount, then check the seller fee and reverse-price the offer before you publish it.',
          bullets: ['Best fit: take-home pricing for gigs, custom offers, and milestones', 'Outperformance angle: reverse-price from target net instead of only showing commission math'],
        },
        faqs: [
          { q: 'How much does Fiverr take from sellers?', a: 'Sellers commonly plan around a 20% Fiverr fee on order value. A $100 gig would net about $80 before taxes, withdrawal fees, and currency conversion.' },
          { q: 'Does this include tips?', a: 'Yes. Enter the tip amount separately and the calculator estimates seller fees and net earnings on the full order plus tip.' },
          { q: 'How do I price a Fiverr gig from target net?', a: 'Use the reverse pricing section. At a 20% fee, divide your target net by 0.80. To net $400, charge about $500 before taxes and withdrawals.' },
          { q: 'Are buyer fees included?', a: 'The calculator also shows an estimated buyer checkout total, but this page is optimized for seller take-home pay.' },
        ],
        bodySections: [
          {
            heading: 'Fiverr seller fee calculator for gig pricing',
            body: 'Use this page when you care about seller take-home pay. Enter a gig price, tip, or custom offer and see how much of the order remains after the seller fee.',
          },
          {
            heading: 'Reverse price from your target net',
            body: 'Most Fiverr pricing mistakes happen when sellers quote the amount they want to keep. This calculator starts from target net income and shows the gross gig price needed after fees.',
          },
          {
            heading: 'Useful when comparing simple gigs against custom offers',
            body: 'The same fee math applies to a low-ticket gig, a package upgrade, or a larger custom offer. Running all three through the calculator makes it easier to spot when a gig price looks attractive in search results but is too thin after Fiverr takes its cut.',
          },
        ],
      },
      {
        slug: 'fiverr-buyer-fee-calculator',
        title: 'Fiverr Buyer Fee Calculator',
        headline: 'Estimate Fiverr Buyer Fees and Checkout Total',
        description: 'Free Fiverr buyer fee calculator. Estimate buyer service fees, small-order fees, checkout total, and the seller net amount behind a Fiverr order.',
        seoTitle: 'Fiverr Buyer Fee Calculator | Estimate Checkout Total',
        icon: '🛒',
        category: 'Marketplace Tools',
        keywords: ['fiverr buyer fee calculator', 'fiverr buyer fees calculator', 'how much fiverr charge from buyer', 'what percentage does fiverr take from buyers', 'fiverr buyer service fee'],
        faqs: [
          { q: 'What is a Fiverr buyer fee?', a: 'A buyer fee is a service fee Fiverr may add at checkout on top of the gig price. The calculator lets you model the percentage fee and small-order fee assumptions.' },
          { q: 'Does this show the seller fee too?', a: 'Yes. It estimates both sides so buyers can understand checkout total and sellers can understand the net amount behind the order.' },
          { q: 'Why does a small Fiverr order feel expensive?', a: 'Small orders can include a buyer service fee plus a small-order fee. That fixed fee can make low-price gigs feel proportionally more expensive.' },
          { q: 'Should I rely on this for final checkout?', a: 'Use it for planning. Fiverr can show account-specific or country-specific checkout details, so confirm the final fee inside Fiverr.' },
        ],
        bodySections: [
          {
            heading: 'Fiverr buyer fee calculator for checkout planning',
            body: 'Searchers asking about Fiverr buyer fees want to know the total price, not only the listed gig price. This calculator models service fees and small-order fees in one place.',
          },
          {
            heading: 'Useful for sellers too',
            body: 'Sellers can use buyer fee estimates to understand the full price a client sees. That helps explain why low-ticket gigs can have more friction at checkout.',
          },
        ],
      },
      {
        slug: 'fiverr-commission-calculator',
        title: 'Fiverr Commission Calculator',
        headline: 'Calculate Fiverr Commission on Any Order',
        description: 'Free Fiverr commission calculator. See the estimated Fiverr percentage, seller fee, seller net, buyer fee, and reverse gig price for any order amount.',
        seoTitle: 'Fiverr Commission Calculator | 20 Percent Fee Tool',
        icon: '🧮',
        category: 'Marketplace Tools',
        keywords: ['fiverr commission calculator', 'fiverr 20 percent calculator', 'fiverr percentage calculator', 'fiverr commission rate', 'what percent does fiverr take'],
        faqs: [
          { q: 'What percent does Fiverr take?', a: 'Fiverr seller fees are commonly modeled at 20% of the order value. This calculator makes the percentage editable for planning and special cases.' },
          { q: 'What is the Fiverr commission on $100?', a: 'At a 20% seller fee, Fiverr commission on a $100 order is $20 and seller net before taxes or withdrawal costs is $80.' },
          { q: 'Can I change the commission percentage?', a: 'Yes. If Fiverr shows a different fee in your account or program, update the seller fee field and the calculator recalculates instantly.' },
          { q: 'Does this include buyer service fees?', a: 'Yes. It includes optional buyer-side fee assumptions so you can compare seller commission and buyer checkout total together.' },
        ],
        bodySections: [
          {
            heading: 'Fiverr commission calculator for percentage searches',
            body: 'Use this when you want the exact fee amount from a Fiverr percentage. Enter the order value and the calculator shows commission, seller net, and target price.',
          },
          {
            heading: 'Model the 20 percent fee quickly',
            body: 'For most seller planning, a 20% fee is the number to sanity-check. The editable fields also support buyer fee estimates and different assumptions.',
          },
        ],
      },
      {
        slug: 'hourly-vs-fixed-calculator',
        title: 'Hourly vs Fixed Price Calculator',
        headline: 'Hourly vs Fixed Price: Which Earns More?',
        description: 'Free calculator to compare hourly and fixed-price project models. Find out which pricing strategy maximizes your earnings for any project.',
        icon: '⚖️',
        category: 'Marketplace Tools',
        keywords: ['hourly vs fixed price calculator', 'hourly or fixed rate freelance', 'project pricing model comparison'],
        faqs: [
          { q: 'Should I charge hourly or fixed price?', a: 'Fixed price works best for well-defined projects — you can earn more if you work efficiently. Hourly is safer for vague scopes or ongoing work where requirements may change.' },
          { q: 'When is hourly pricing better?', a: 'Hourly is better when scope is unclear, the client makes frequent changes, or the work is research-heavy. It protects you from scope creep.' },
          { q: 'How do fixed-price projects affect earnings?', a: 'If you complete a fixed-price project faster than estimated, your effective hourly rate goes up. If it runs over, it drops. Accurate scoping is critical.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-design', label: 'for Web Design' },
          { slug: 'for-development', label: 'for Development' },
          { slug: 'for-copywriting', label: 'for Copywriting' },
        ],
      },
    ],
  },
  {
    name: 'Client Acquisition',
    slug: 'client-acquisition',
    description: 'Generate proposals, SOWs, questionnaires, and discovery call scripts.',
    tools: [
      {
        slug: 'proposal-generator',
        title: 'Proposal Generator',
        headline: 'Generate a Professional Freelance Proposal',
        description: 'Free freelance proposal generator. Enter your service, client details, and budget — get a complete, professional proposal you can copy and send.',
        seoTitle: 'Free Proposal Generator for Freelancers | SEO, Design & Consulting',
        icon: '📝',
        category: 'Client Acquisition',
        keywords: ['proposal generator', 'freelance proposal generator', 'freelance proposal template', 'seo proposal generator', 'web design proposal generator', 'consulting proposal generator'],
        faqs: [
          { q: 'What should a freelance proposal include?', a: 'A winning proposal includes: an executive summary, understanding of the problem, your proposed solution, scope of work, timeline, pricing, and a clear call to action.' },
          { q: 'How long should a freelance proposal be?', a: 'Keep it concise — 1 to 2 pages for most projects. Clients skim; lead with your understanding of their problem and how you solve it.' },
          { q: 'How do I win more proposals?', a: 'Personalize every proposal to the specific client and project, demonstrate you understand their business, and make the decision easy with clear pricing and next steps.' },
          { q: 'Can I use this as an SEO proposal generator?', a: 'Yes. Choose the SEO project variation and describe the audit, keyword research, content, technical fixes, or link-building work you plan to deliver.' },
        ],
        bodySections: [
          {
            heading: 'Proposal generator for SEO and service projects',
            body: 'Use the generator for SEO, web design, content, consulting, and agency proposals. The output is structured around the client problem, your approach, deliverables, timeline, price, and next step.',
          },
          {
            heading: 'Turn a rough brief into a client-ready pitch',
            body: 'A strong proposal should not feel generic. Add the client industry, problem, budget, and timeline so the generated proposal speaks directly to the buyer instead of sounding like a template.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-web-design', label: 'for Web Design Projects' },
          { slug: 'for-seo', label: 'for SEO Projects' },
          { slug: 'for-content-writing', label: 'for Content Writing Projects' },
          { slug: 'for-consulting', label: 'for Consulting Projects' },
        ],
      },
      {
        slug: 'scope-of-work-generator',
        title: 'Scope of Work Generator',
        headline: 'Generate a Professional Scope of Work',
        description: 'Free scope of work generator for freelancers and agencies. Enter your deliverables, timeline, and service details to create a professional SOW document.',
        seoTitle: 'Free Scope of Work Generator | SOW Template for Freelancers',
        icon: '📄',
        category: 'Client Acquisition',
        keywords: ['scope of work generator', 'sow generator', 'freelance scope of work template', 'scope of work template', 'statement of work generator', 'project scope generator'],
        faqs: [
          { q: 'What is a Scope of Work (SOW)?', a: 'A scope of work is a document that defines project deliverables, timelines, responsibilities, and boundaries. It protects both parties by clarifying what is and is not included.' },
          { q: 'Why do freelancers need an SOW?', a: 'An SOW prevents scope creep, miscommunication, and disputes. It creates a clear record of what was agreed upon so you can point to it if a client requests out-of-scope work.' },
          { q: 'What is the difference between an SOW and a contract?', a: 'An SOW defines what work will be done. A contract defines the legal terms (payment, IP, liability). Ideally, both are signed — the SOW is often an attachment to the contract.' },
          { q: 'What should I exclude from a scope of work?', a: 'Exclude extra revision rounds, additional pages or deliverables, future maintenance, rush work, third-party costs, and anything the client mentioned as a maybe but has not approved.' },
        ],
        bodySections: [
          {
            heading: 'Create a scope of work before pricing',
            body: 'The best time to define scope is before the proposal is accepted. Use this generator to turn deliverables, milestones, revision limits, and exclusions into a document both sides can understand.',
          },
          {
            heading: 'Prevent scope creep with explicit exclusions',
            body: 'A useful SOW says what is included and what is not included. Naming exclusions upfront protects your margin and gives you a clear reference when a client asks for extra work later.',
          },
        ],
        programmaticVariants: [
          { slug: 'for-web-development', label: 'for Web Development' },
          { slug: 'for-design', label: 'for Design Projects' },
          { slug: 'for-marketing', label: 'for Marketing Campaigns' },
        ],
      },
      {
        slug: 'client-questionnaire-generator',
        title: 'Client Questionnaire Generator',
        headline: 'Generate a Client Onboarding Questionnaire',
        description: 'Free client questionnaire generator. Select your service type and get a complete set of discovery questions to ask new clients before starting work.',
        icon: '❓',
        category: 'Client Acquisition',
        keywords: ['client onboarding questionnaire', 'website questionnaire template', 'freelance client questionnaire'],
        faqs: [
          { q: 'Why should I send clients a questionnaire?', a: 'A questionnaire helps you understand the client\'s goals, constraints, and expectations before you start. It reduces back-and-forth, prevents misunderstandings, and positions you as a professional.' },
          { q: 'When should I send a client questionnaire?', a: 'Send it after a call or agreement in principle — before you begin work or send a detailed proposal. It shows diligence and helps you scope the project accurately.' },
          { q: 'How many questions should a client questionnaire have?', a: 'Keep it to 8–15 focused questions. Too many and clients won\'t complete it. Prioritize questions about goals, timeline, budget, and existing assets.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-design', label: 'for Web Design Clients' },
          { slug: 'for-branding', label: 'for Branding Clients' },
          { slug: 'for-seo', label: 'for SEO Clients' },
          { slug: 'for-copywriting', label: 'for Copywriting Clients' },
        ],
      },
      {
        slug: 'freelance-contract-generator',
        title: 'Freelance Contract Generator',
        headline: 'Generate a Free Freelance Contract in Minutes',
        description: 'Free freelance contract generator. Fill in your project details, payment terms, and revision policy — get a professional contract ready to sign. No account required.',
        icon: '📃',
        category: 'Client Acquisition',
        keywords: ['freelance contract generator', 'freelance contract template', 'independent contractor agreement generator', 'free freelance contract maker', 'freelance client contract'],
        faqs: [
          { q: 'Do I need a contract as a freelancer?', a: 'Yes — always. A contract protects you from non-payment, scope creep, and disputes. Even a short, plain-English agreement establishes what was agreed and gives you legal recourse if the client doesn\'t pay.' },
          { q: 'What should a freelance contract include?', a: 'Every freelance contract should cover: parties involved, project scope and deliverables, timeline, payment amount and schedule, revision policy, kill fee (if project is cancelled), IP ownership, and confidentiality terms.' },
          { q: 'What is a kill fee in a freelance contract?', a: 'A kill fee is a cancellation fee paid if the client ends the project early. Typically 25–50% of the remaining contract value. It compensates you for time spent and opportunity cost of turning away other work.' },
          { q: 'Who owns the intellectual property in freelance work?', a: 'By default, the creator (you) owns the IP. Rights transfer to the client only when you grant them in the contract. Specify whether you\'re granting exclusive rights, non-exclusive rights, or full assignment of copyright.' },
          { q: 'Should a freelance contract be signed?', a: 'Yes. Both parties should sign before work begins. Electronic signatures (via DocuSign, HelloSign, or even an email confirmation) are legally valid in most jurisdictions.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-design', label: 'for Web Design' },
          { slug: 'for-photography', label: 'for Photography' },
          { slug: 'for-copywriting', label: 'for Copywriting' },
          { slug: 'for-video-production', label: 'for Video Production' },
          { slug: 'for-marketing', label: 'for Marketing' },
        ],
      },
      {
        slug: 'client-onboarding-checklist',
        title: 'Client Onboarding Checklist Generator',
        headline: 'Generate Your Client Onboarding Checklist',
        description: 'Free client onboarding checklist generator. Select your service type and get a customized, printable onboarding checklist that ensures every new client starts perfectly.',
        icon: '✅',
        category: 'Client Acquisition',
        keywords: ['client onboarding checklist', 'freelance client onboarding template', 'new client checklist generator', 'client onboarding process freelancer', 'freelance onboarding template'],
        faqs: [
          { q: 'Why do freelancers need a client onboarding checklist?', a: 'A checklist ensures no step is missed when onboarding a new client — from collecting credentials to setting communication norms. It makes you look professional, reduces back-and-forth, and sets the project up for success.' },
          { q: 'What should be in a freelance client onboarding process?', a: 'A solid onboarding process includes: signed contract + deposit received, access to tools and accounts, kickoff call or meeting, project brief confirmed, communication channels established, and first milestone agreed upon.' },
          { q: 'When should I send a client onboarding checklist?', a: 'Send your checklist immediately after the contract is signed and the deposit received. Use it as a step-by-step guide through the first week of the engagement to get everything in place before work begins.' },
          { q: 'How long should client onboarding take?', a: 'For most freelance projects, 2–5 business days is ideal. Complex agency engagements may need a 1–2 week structured onboarding. Keep it efficient — the client is eager to get started.' },
          { q: 'What tools help with client onboarding?', a: 'Notion or Google Docs for shared checklists, Loom for walkthrough videos, Calendly for scheduling, and a project management tool like Asana or Linear for task tracking. The most important tool is a clear, repeatable process.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-designers', label: 'for Web Designers' },
          { slug: 'for-marketing-agencies', label: 'for Marketing Agencies' },
          { slug: 'for-consultants', label: 'for Consultants' },
          { slug: 'for-social-media-managers', label: 'for Social Media Managers' },
          { slug: 'for-photographers', label: 'for Photographers' },
        ],
      },
      {
        slug: 'discovery-call-generator',
        title: 'Discovery Call Script Generator',
        headline: 'Generate Your Discovery Call Script',
        description: 'Free discovery call script generator for freelancers and agencies. Choose your service category and get a structured script to run winning discovery calls.',
        icon: '📞',
        category: 'Client Acquisition',
        keywords: ['discovery call questions', 'client discovery template', 'freelance discovery call script'],
        faqs: [
          { q: 'What is a discovery call?', a: 'A discovery call is an initial conversation with a potential client to understand their needs, goals, and fit. It helps you decide if you want to work together and how to position your proposal.' },
          { q: 'How long should a discovery call be?', a: 'Aim for 20–45 minutes. Enough to cover the key questions without taking too much of either party\'s time before a project is confirmed.' },
          { q: 'What are the most important discovery call questions?', a: 'Focus on: What is the goal? What does success look like? What has been tried before? What is the timeline? What is the budget? Who is the decision-maker?' },
        ],
        programmaticVariants: [
          { slug: 'for-web-agencies', label: 'for Web Agencies' },
          { slug: 'for-consultants', label: 'for Consultants' },
          { slug: 'for-designers', label: 'for Designers' },
        ],
      },
    ],
  },
  {
    name: 'Financial Planning',
    slug: 'financial-planning',
    description: 'Plan your taxes, savings, and retirement as a self-employed freelancer.',
    tools: [
      {
        slug: 'freelancer-tax-calculator',
        title: 'Freelancer Tax Calculator',
        headline: 'Calculate Your Freelance Taxes & Quarterly Payments',
        description: 'Free freelancer tax calculator. Enter your income, filing status, and expenses to estimate self-employment tax, federal income tax, and quarterly payment amounts.',
        icon: '🧾',
        category: 'Financial Planning',
        keywords: ['freelancer tax calculator', 'self employed tax calculator', '1099 tax calculator', 'freelance quarterly tax calculator', 'how much tax do freelancers pay'],
        faqs: [
          { q: 'How much tax does a freelancer pay?', a: 'Freelancers pay self-employment tax (15.3% on net earnings up to the Social Security wage base) plus federal and state income tax. Total effective tax rates typically range from 25–35% for most US freelancers.' },
          { q: 'What is self-employment tax?', a: 'Self-employment tax covers your Social Security (12.4%) and Medicare (2.9%) contributions — totaling 15.3%. As a freelancer, you pay both the employer and employee portions, but you can deduct half on your federal return.' },
          { q: 'When are quarterly estimated taxes due?', a: 'Quarterly estimated taxes are due April 15, June 15, September 15, and January 15. Missing these deadlines results in underpayment penalties even if you pay in full at tax time.' },
          { q: 'What business expenses can freelancers deduct?', a: 'Common deductions include home office, software subscriptions, equipment, internet, health insurance premiums, professional development, and business travel. Keep receipts for everything.' },
          { q: 'Do I need to pay taxes if I earn under a certain amount?', a: 'If your net self-employment income exceeds $400 in a year, you must file and pay self-employment tax. There is no minimum for income tax — all income is taxable.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-developers', label: 'for Web Developers' },
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'for-consultants', label: 'for Consultants' },
          { slug: 'for-content-creators', label: 'for Content Creators' },
          { slug: 'by-state', label: 'by State' },
        ],
      },
      {
        slug: 'freelancer-savings-calculator',
        title: 'Freelancer Savings & Retirement Calculator',
        headline: 'Calculate Your Emergency Fund & Retirement Savings',
        description: 'Free freelancer savings calculator. Calculate your ideal emergency fund, monthly savings target, and maximum SEP IRA or Solo 401(k) contribution based on your freelance income.',
        icon: '🏦',
        category: 'Financial Planning',
        keywords: ['freelancer emergency fund calculator', 'self employed retirement calculator', 'SEP IRA contribution calculator', 'freelance savings calculator', 'how much should freelancer save'],
        faqs: [
          { q: 'How much should a freelancer save for emergencies?', a: 'Freelancers should keep 6–9 months of expenses in an emergency fund — more than the 3–6 months typically recommended for employees — because income can be irregular and gaps between projects are common.' },
          { q: 'What retirement accounts can freelancers use?', a: 'Freelancers can use a SEP IRA (contribute up to 25% of net self-employment income, max $69,000 in 2024), Solo 401(k) (up to $69,000 plus $7,500 catch-up if 50+), or a Traditional/Roth IRA (up to $7,000 in 2024).' },
          { q: 'How much can I contribute to a SEP IRA as a freelancer?', a: 'You can contribute up to 25% of your net self-employment income (after the SE tax deduction), with a maximum of $69,000 for 2024. This is a significant tax deduction that directly reduces your taxable income.' },
          { q: 'How do I save consistently with irregular freelance income?', a: 'Pay yourself a consistent "salary" from your business account, set savings as a fixed percentage of every payment received (typically 20–30%), and use a separate account for taxes and another for savings.' },
          { q: 'What percentage of income should a freelancer save?', a: 'Target saving 20–30% gross: roughly 25–30% for taxes, 10–15% for retirement, and building emergency reserves from any surplus. Start with whatever you can manage and increase as income grows.' },
        ],
        programmaticVariants: [
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'for-developers', label: 'for Developers' },
          { slug: 'sep-ira', label: 'SEP IRA Calculator' },
          { slug: 'irregular-income', label: 'for Irregular Income' },
          { slug: 'for-agencies', label: 'for Agency Owners' },
        ],
      },
    ],
  },
  {
    name: 'Business Operations',
    slug: 'business-ops',
    description: 'Tools to run a more profitable and organized freelance business.',
    tools: [
      {
        slug: 'invoice-generator',
        title: 'Invoice Generator',
        headline: 'Create a Professional Freelance Invoice',
        description: 'Free freelance invoice generator. Add client details, line items, and tax — then print or save as PDF. No account required.',
        icon: '🧾',
        category: 'Business Operations',
        keywords: ['freelance invoice generator', 'free invoice generator', 'invoice template for freelancers'],
        faqs: [
          { q: 'What should a freelance invoice include?', a: 'Your name/business name, invoice number, date, due date, client details, line items with descriptions and amounts, subtotal, tax, and total. Always include payment instructions.' },
          { q: 'How do I save the invoice as a PDF?', a: 'Click "Print Invoice" and select "Save as PDF" from your browser\'s print dialog. This works on all major browsers without any additional software.' },
          { q: 'What payment terms should I use?', a: 'Net 7 or Net 14 is common for freelancers. Avoid Net 30+ unless working with large enterprises. Always follow up one day before the due date.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-developers', label: 'for Web Developers' },
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'for-consultants', label: 'for Consultants' },
        ],
      },
      {
        slug: 'meeting-cost-calculator',
        title: 'Meeting Cost Calculator',
        headline: 'Calculate the True Cost of Any Meeting',
        description: 'Free meeting cost calculator. Enter attendees, hourly rates, and duration to see exactly how much a meeting costs your business in real time.',
        icon: '⏱️',
        category: 'Business Operations',
        keywords: ['meeting cost calculator', 'cost of meeting calculator', 'is this meeting worth it'],
        faqs: [
          { q: 'Why calculate meeting costs?', a: 'Meetings are expensive — an hour with 5 people at $100/hr costs $500. Making the cost visible encourages shorter meetings, better agendas, and fewer unnecessary attendees.' },
          { q: 'What is the average cost of a business meeting?', a: 'A 1-hour meeting with 5 professionals averaging $75–$100/hr costs $375–$500 in labor alone — not counting opportunity cost of work not done.' },
          { q: 'How can I reduce meeting costs?', a: 'Limit attendees to essential people, set a clear agenda, time-box the meeting, and use async communication (Slack, Loom) for updates that don\'t require real-time discussion.' },
        ],
        programmaticVariants: [
          { slug: 'for-3-people', label: 'for 3-Person Meetings' },
          { slug: 'for-5-people', label: 'for 5-Person Meetings' },
          { slug: 'for-10-people', label: 'for 10-Person Meetings' },
        ],
      },
      {
        slug: 'commission-calculator',
        title: 'Commission Calculator',
        headline: 'Calculate Sales Commission Earnings',
        description: 'Free sales commission calculator. Enter sale amount and commission percentage to calculate your earnings and see commission at a glance.',
        icon: '💸',
        category: 'Business Operations',
        keywords: ['commission calculator', 'sales commission calculator', 'how to calculate commission'],
        faqs: [
          { q: 'How do I calculate sales commission?', a: 'Multiply the sale amount by the commission rate. Example: $10,000 sale × 10% = $1,000 commission.' },
          { q: 'What is a typical sales commission rate?', a: 'Commission rates vary by industry. SaaS: 5–10%, real estate: 2–6%, insurance: 5–15%, general sales: 10–20%.' },
          { q: 'What is a tiered commission structure?', a: 'A tiered structure increases commission rates as you hit higher sales targets. For example: 5% on first $50k, 8% on $50k–$100k, 12% above $100k.' },
        ],
        programmaticVariants: [
          { slug: 'at-5-percent', label: 'at 5% Commission' },
          { slug: 'at-10-percent', label: 'at 10% Commission' },
          { slug: 'at-20-percent', label: 'at 20% Commission' },
        ],
      },
      {
        slug: 'revenue-goal-calculator',
        title: 'Revenue Goal Calculator',
        headline: 'Break Down Your Revenue Goal Into Daily Targets',
        description: 'Free revenue goal calculator. Enter your annual revenue target and get your monthly, weekly, and daily targets — with the number of projects or clients needed.',
        icon: '🎯',
        category: 'Business Operations',
        keywords: ['revenue goal calculator', 'freelance revenue target', 'monthly revenue calculator'],
        faqs: [
          { q: 'How do I set a realistic freelance revenue goal?', a: 'Start with your desired annual take-home, gross it up for taxes and expenses, then divide by your average project value to know how many clients you need.' },
          { q: 'How many clients does a freelancer need?', a: 'It depends on average project size. If you earn $3,000/project and want $90,000/year gross, you need 30 projects — about 2–3 per month.' },
          { q: 'What is a good annual revenue target for a freelancer?', a: 'This depends heavily on location, niche, and experience. US freelancers in tech/design often target $80,000–$200,000 gross. Agencies can target $500k–$5M+.' },
        ],
        programmaticVariants: [
          { slug: 'for-100k', label: 'for $100K Goal' },
          { slug: 'for-200k', label: 'for $200K Goal' },
          { slug: 'for-500k', label: 'for $500K Goal' },
        ],
      },
      {
        slug: 'project-deadline-calculator',
        title: 'Project Deadline Calculator',
        headline: 'Calculate Your Freelance Project Deadline',
        description: 'Free project deadline calculator for freelancers. Enter your hours, daily availability, revision rounds, and client feedback windows to get an accurate project completion date.',
        icon: '📅',
        category: 'Business Operations',
        keywords: ['project deadline calculator', 'freelance timeline calculator', 'project timeline estimator', 'working days calculator freelancer', 'how long will my project take'],
        faqs: [
          { q: 'How do I calculate a realistic project deadline?', a: 'Divide total estimated hours by your daily available hours to get base work days. Add days for each revision round (your work time + client feedback window). Add a buffer of 10–20% and any known blackout days.' },
          { q: 'How many revision rounds should I allow in my timeline?', a: 'Most projects include 2–3 revision rounds. Each round should account for your implementation time plus a realistic client turnaround window (typically 2–5 business days for feedback). Bake these into your deadline from the start.' },
          { q: 'What is a buffer day in project planning?', a: 'Buffer days are padding added to absorb unexpected complexity, delays in client feedback, or small scope additions. A 10–20% buffer (e.g., 2–4 extra days on a 2-week project) is standard and protects you from missing deadlines.' },
          { q: 'Should I give clients my internal deadline or a padded deadline?', a: 'Always communicate the padded deadline to clients. Delivering early is a pleasant surprise; delivering late damages trust. Your internal deadline should be earlier than what you quote.' },
          { q: 'How do I plan a project timeline with multiple milestones?', a: 'Break the project into phases (design, development, review, launch). Estimate hours for each phase, add client feedback windows between phases, and set milestone dates with buffer built in. This calculator gives you the end date; use it as your anchor.' },
        ],
        programmaticVariants: [
          { slug: 'for-web-development', label: 'for Web Development' },
          { slug: 'for-design-projects', label: 'for Design Projects' },
          { slug: 'for-content-writing', label: 'for Content Writing' },
          { slug: 'for-agencies', label: 'for Agencies' },
          { slug: 'with-milestones', label: 'with Milestones' },
        ],
      },
      {
        slug: 'late-payment-fee-calculator',
        title: 'Late Payment Fee Calculator',
        headline: 'Calculate Late Payment Fees on Overdue Client Invoices',
        description: 'Free late payment fee calculator for freelancers and agencies. Enter invoice amount, overdue days, and your contract rate to calculate interest, updated balance due, and the number to use in a payment reminder.',
        seoTitle: 'Late Payment Fee Calculator | Overdue Invoice Interest Tool',
        icon: '⏰',
        category: 'Business Operations',
        keywords: ['late payment fee calculator', 'invoice late fee calculator', 'overdue invoice interest calculator', 'freelance late payment calculator', 'invoice overdue fee', 'late fee on invoice calculator', '1.5 percent late fee calculator'],
        faqs: [
          { q: 'Can freelancers charge late fees on overdue invoices?', a: 'Yes — if your contract or invoice specifies a late fee policy. Without it in writing, enforcing fees is difficult. Always include your late fee terms in every contract and on every invoice before starting work.' },
          { q: 'What is the standard late fee for freelancers?', a: '1.5% per month (18% annually) is the most common standard used by freelancers and small businesses in the US. Some freelancers use 2% per month. Always check your state\'s usury laws for maximum rates.' },
          { q: 'How do I calculate a late payment fee?', a: 'Multiply the invoice amount by the monthly rate, then multiply by the number of months (or use the daily rate × days overdue). Example: $2,000 invoice × 1.5% × 2 months = $60 in late fees.' },
          { q: 'What should I do before charging a late fee?', a: 'Send a polite payment reminder first. Many late payments are administrative oversights. Only apply late fees if payment is significantly overdue (15–30 days past due) and after at least one follow-up. Maintain the relationship while enforcing your terms.' },
          { q: 'Can I charge late fees retroactively?', a: 'Only if your original contract or invoice specified the late fee terms before work began. You cannot retroactively add fees that weren\'t disclosed. This is why including late fee language in every contract matters.' },
          { q: 'Does this calculator work for 1.5% per month and 2% per month?', a: 'Yes. Enter the annualized or monthly-equivalent rate from your contract. The common 1.5% monthly pattern is included in the variant pages, but you can calculate other rates too.' },
        ],
        bodySections: [
          {
            heading: 'Use the exact number in your payment reminder',
            body: 'When a client pays late, the biggest communication problem is often not knowing what number to quote. This calculator turns your contract terms into a fee amount, updated balance, and a clear basis for the reminder email.',
          },
          {
            heading: 'Built for the common 1.5% monthly workflow',
            body: 'Many freelancers use 1.5% per month as their standard late-fee planning rule. The tool is flexible enough for other contract rates, but it is especially useful for the common 30-day, 60-day, and monthly-interest scenarios that show up in search.',
          },
          {
            heading: 'Helpful before you escalate the collection tone',
            body: 'A precise number keeps the message professional. Instead of sending a vague overdue notice, you can explain the original invoice amount, the days late, the agreed fee rate, and the updated total due in one clean follow-up.',
          },
        ],
        programmaticVariants: [
          { slug: 'at-1-5-percent', label: 'at 1.5%/Month' },
          { slug: 'at-2-percent', label: 'at 2%/Month' },
          { slug: 'for-30-days', label: '30 Days Overdue' },
          { slug: 'for-60-days', label: '60 Days Overdue' },
        ],
      },
      {
        slug: 'late-charge-calculator',
        title: 'Late Charge Calculator',
        headline: 'Calculate a Late Charge on an Overdue Invoice',
        description: 'Free late charge calculator for freelancers and small businesses. Enter invoice amount, days overdue, and your contract rate to estimate the charge, updated balance, and a clean number to use in a reminder.',
        seoTitle: 'Late Charge Calculator | Calculate Overdue Invoice Fees',
        icon: '⏱️',
        category: 'Business Operations',
        keywords: ['late charge calculator', 'calculate late fee', 'late fee calculator', 'overdue payment charge calculator', 'late payment interest calculator', 'late charge on invoice calculator'],
        faqs: [
          { q: 'How do I calculate a late charge?', a: 'Convert your annual or monthly late fee rate into a daily rate, multiply by the number of days overdue, then multiply by the invoice amount. The calculator does this automatically.' },
          { q: 'Can I charge a late charge if it was not in the contract?', a: 'It is much harder to enforce a late charge if the original contract or invoice did not disclose the fee. Add late-fee language before work begins.' },
          { q: 'What is a common late charge rate?', a: 'Many freelancers use 1.5% per month or 18% per year, but rules vary by location and contract. Check local limits before enforcing a fee.' },
          { q: 'Should I send a reminder first?', a: 'Yes. Send a polite reminder before adding fees. Use late charges to enforce agreed terms, not as the first communication.' },
          { q: 'When is a late charge calculator more useful than a flat late fee?', a: 'It helps when your contract uses interest or a daily accrual model instead of one flat penalty. That is common when a balance remains unpaid for more than one billing cycle.' },
        ],
        bodySections: [
          {
            heading: 'Late charge calculator for overdue work',
            body: 'Use this when a client invoice is overdue and you need to calculate a reasonable charge from your written payment terms.',
          },
          {
            heading: 'Keep the relationship professional',
            body: 'The calculator also gives you a practical total to include in a payment reminder, so the follow-up is clear without sounding improvised.',
          },
          {
            heading: 'Useful for daily or monthly accrual models',
            body: 'Some contracts describe late fees as a monthly percentage, while others need a daily-equivalent number for partial months. This workflow helps with both and keeps the math consistent from reminder to reminder.',
          },
        ],
      },
      {
        slug: 'invoice-late-fee-calculator',
        title: 'Invoice Late Fee Calculator',
        headline: 'Calculate Late Fees on Client Invoices',
        description: 'Free invoice late fee calculator for freelancers and agencies. Estimate overdue invoice fees, daily or monthly interest, updated balance due, and the amount to use in a follow-up email.',
        seoTitle: 'Invoice Late Fee Calculator | Overdue Client Payment Tool',
        icon: '🧾',
        category: 'Business Operations',
        keywords: ['invoice late fee calculator', 'late payment fee calculator', 'overdue invoice interest calculator', 'calculate invoice late fee', 'client late fee calculator', 'overdue invoice fee calculator'],
        faqs: [
          { q: 'How do I add a late fee to an invoice?', a: 'Use the late fee terms already stated in your contract or invoice, calculate the fee, then send an updated payment reminder with the new total.' },
          { q: 'What should my invoice late fee terms say?', a: 'They should state when payment is due, when the late fee starts, the fee rate, and whether fees accrue monthly or daily.' },
          { q: 'Can this calculate daily late fees?', a: 'Yes. Enter the invoice amount, days overdue, and annual late fee rate to estimate the daily-accrued amount.' },
          { q: 'Is this legal advice?', a: 'No. This calculator is for planning and communication. Check your contract and local law before enforcing invoice late fees.' },
          { q: 'Can I use this before resending the invoice?', a: 'Yes. Many freelancers resend the invoice together with a short reminder and the updated total due. This tool helps you calculate that amount before you send the message.' },
        ],
        bodySections: [
          {
            heading: 'Invoice late fee calculator for freelancers',
            body: 'Freelancers often know a payment is late but do not know what number to include in the reminder. This tool turns your invoice terms into a clear fee and balance.',
          },
          {
            heading: 'Use before sending the payment reminder',
            body: 'Calculate the late fee first, then copy the reminder template and send a calm, specific follow-up with invoice number, days overdue, and total due.',
          },
          {
            heading: 'Built for overdue invoice search intent',
            body: 'The page is designed for people searching how to calculate a late fee on an invoice, not just for legal theory. It gets users from an overdue balance to a usable payment reminder without forcing them into a spreadsheet.',
          },
        ],
      },
      {
        slug: 'break-even-calculator',
        title: 'Break-Even Calculator',
        headline: 'Calculate Your Freelance Break-Even Point',
        description: 'Free break-even calculator for freelancers. Enter fixed costs, project price, and variable costs to find your break-even point instantly.',
        icon: '📈',
        category: 'Business Operations',
        keywords: ['break even calculator', 'freelance break even point', 'business break even analysis'],
        faqs: [
          { q: 'What is a break-even point?', a: 'The break-even point is the number of projects (or revenue amount) at which your total income equals your total costs — you\'re neither profitable nor losing money.' },
          { q: 'Why is break-even analysis important for freelancers?', a: 'It tells you the minimum number of projects or monthly revenue you need just to cover costs. Below this, you\'re losing money. Above it, you\'re profitable.' },
          { q: 'What are fixed vs variable costs for freelancers?', a: 'Fixed costs recur regardless of work volume (software subscriptions, internet, insurance). Variable costs only arise when you take a project (stock photos, subcontractors, etc.).' },
        ],
        programmaticVariants: [
          { slug: 'for-agencies', label: 'for Agencies' },
          { slug: 'for-solopreneurs', label: 'for Solopreneurs' },
          { slug: 'for-saas', label: 'for SaaS Businesses' },
        ],
      },
    ],
  },
  {
    name: 'Utility Tools',
    slug: 'utility-tools',
    description: 'Free browser-based tools for files, text, and productivity. No upload to server — everything runs locally.',
    tools: [
      {
        slug: 'pdf-to-jpg-converter',
        title: 'PDF to JPG Converter',
        headline: 'Convert PDF Pages to JPG Images Free',
        description: 'Free PDF to JPG converter. Upload any PDF and instantly convert every page to a high-quality JPG image. Runs entirely in your browser — no files uploaded to any server.',
        icon: '🖼️',
        category: 'Utility Tools',
        keywords: ['pdf to jpg converter', 'pdf to jpeg converter', 'convert pdf to image', 'pdf page to jpg free', 'pdf to image online free'],
        faqs: [
          { q: 'Is this PDF to JPG converter free?', a: 'Yes — completely free, no signup, no watermark, and no file size limit (within your browser\'s memory). Convert as many PDFs as you like.' },
          { q: 'Are my PDF files uploaded to a server?', a: 'No. This tool runs entirely in your browser using JavaScript. Your PDF file never leaves your device and is not uploaded anywhere.' },
          { q: 'What quality are the output JPGs?', a: 'Pages are rendered at 2× screen resolution (approximately 144 DPI equivalent) which is suitable for screen use, presentations, and most print needs. Use the quality slider to balance file size and clarity.' },
          { q: 'Can I convert a multi-page PDF?', a: 'Yes. Every page of your PDF is converted to a separate JPG. You can download them individually or use the Download All button to get all pages at once.' },
          { q: 'What PDF types does this support?', a: 'Standard PDF files including text-based, scanned, and mixed PDFs. Password-protected PDFs are not supported — remove the password first.' },
        ],
        programmaticVariants: [
          { slug: 'multi-page', label: 'Multi-Page PDF' },
          { slug: 'high-quality', label: 'High Quality' },
          { slug: 'for-designers', label: 'for Designers' },
          { slug: 'no-watermark', label: 'Without Watermark' },
        ],
      },
      {
        slug: 'image-compressor',
        title: 'Image Compressor',
        headline: 'Compress & Resize Images Free Online',
        description: 'Free image compressor and resizer. Upload JPG, PNG, or WebP images and reduce file size instantly. Runs in your browser — no files sent to any server.',
        icon: '🗜️',
        category: 'Utility Tools',
        keywords: ['image compressor', 'compress image online free', 'resize image online', 'reduce image file size', 'jpg compressor free'],
        faqs: [
          { q: 'How does image compression work?', a: 'This tool uses your browser\'s built-in canvas API to redraw and re-encode your image at a lower quality or smaller resolution. JPEG compression is lossy — you can control how much quality is traded for smaller file size.' },
          { q: 'What image formats are supported?', a: 'JPG/JPEG, PNG, and WebP files are supported for upload. Output is JPEG (best for photos) or PNG (best for graphics with transparency). WebP output coming soon.' },
          { q: 'Is there a file size limit?', a: 'No hard limit — the tool runs in your browser so it depends on your device\'s memory. Most images up to 20MB compress without issue. Very large images (50MB+) may be slow on older devices.' },
          { q: 'Will the compressed image lose quality?', a: 'JPEG compression is lossy, so some quality is lost. At 80% quality, most images look identical to the human eye while being 50–70% smaller. PNG compression is lossless — only the dimensions change.' },
          { q: 'Are my images stored or shared?', a: 'Never. Everything happens locally in your browser. Your images are never uploaded, stored, or seen by anyone.' },
        ],
        programmaticVariants: [
          { slug: 'jpg', label: 'JPG Compressor' },
          { slug: 'png', label: 'PNG Compressor' },
          { slug: 'for-web', label: 'for Web' },
          { slug: 'bulk', label: 'Bulk Images' },
        ],
      },
      {
        slug: 'word-count-tool',
        title: 'Word Count Tool',
        headline: 'Word Count, Readability & Text Analysis',
        description: 'Free word count and readability checker. Paste any text to instantly see word count, character count, reading time, sentence count, and Flesch readability score.',
        icon: '📝',
        category: 'Utility Tools',
        keywords: ['word count tool', 'word counter online', 'character count tool', 'readability checker', 'reading time calculator'],
        faqs: [
          { q: 'What is the Flesch Reading Ease score?', a: 'The Flesch Reading Ease score (0–100) measures how easy text is to read. 90–100 = very easy (5th grade), 60–70 = standard (8th grade), 30–50 = difficult (college), 0–30 = very difficult (professional). Higher is easier.' },
          { q: 'How is reading time calculated?', a: 'Reading time is estimated at 200–250 words per minute, which is the average adult reading speed. The tool also shows speaking time (150 words/minute) which is useful for presentation scripts.' },
          { q: 'Does this tool store my text?', a: 'No. Your text never leaves your browser. Everything is processed locally in JavaScript with no server calls.' },
          { q: 'What is a good word count for a blog post?', a: 'For SEO, 1,500–2,500 words is the sweet spot for most topics. Long-form content (3,000+) tends to rank well for competitive keywords. For landing pages, 500–1,000 words usually works best.' },
          { q: 'Can I use this as a character counter?', a: 'Yes. The tool shows characters with spaces and without spaces separately, which is useful for Twitter/X limits (280 chars), LinkedIn posts (3,000 chars), and SMS messages (160 chars).' },
        ],
        programmaticVariants: [
          { slug: 'for-seo', label: 'for SEO Content' },
          { slug: 'for-copywriters', label: 'for Copywriters' },
          { slug: 'character-counter', label: 'Character Counter' },
          { slug: 'readability-checker', label: 'Readability Checker' },
        ],
      },
      {
        slug: 'pomodoro-timer',
        title: 'Pomodoro Timer',
        headline: 'Free Pomodoro Timer for Focused Work',
        description: 'Free Pomodoro timer for freelancers. Set work intervals, short breaks, and long breaks. Track your sessions and stay focused. No signup — works entirely in your browser.',
        icon: '🍅',
        category: 'Utility Tools',
        keywords: ['pomodoro timer', 'pomodoro technique', 'focus timer online', 'work timer free', 'productivity timer freelancer'],
        faqs: [
          { q: 'What is the Pomodoro Technique?', a: 'The Pomodoro Technique is a time management method developed by Francesco Cirillo. You work for 25 minutes (one "pomodoro"), then take a 5-minute break. After 4 pomodoros, take a longer 15–30 minute break.' },
          { q: 'How many pomodoros should I do per day?', a: 'Most people can sustain 8–12 pomodoros (4–6 hours of focused work) per day. Freelancers often find 6–8 is their sweet spot, leaving time for admin, email, and business development.' },
          { q: 'Can I customize the timer intervals?', a: 'Yes. You can adjust the work interval, short break, and long break to any duration. Some people prefer 50/10 or 90/20 cycles depending on their focus style.' },
          { q: 'Does the timer work if I minimize the browser?', a: 'Yes. The timer continues running in the background. You\'ll see a visual and text notification when the session ends.' },
          { q: 'Why use a Pomodoro timer as a freelancer?', a: 'Freelancers often struggle with focus and time tracking. The Pomodoro method creates natural work/break cycles that prevent burnout, help estimate project time (X pomodoros = Y hours), and make it easier to start difficult tasks.' },
        ],
        programmaticVariants: [
          { slug: '25-5', label: '25/5 Classic' },
          { slug: '50-10', label: '50/10 Extended' },
          { slug: 'for-freelancers', label: 'for Freelancers' },
          { slug: 'for-developers', label: 'for Developers' },
        ],
      },
      {
        slug: 'working-days-calculator',
        title: 'Working Days Calculator',
        headline: 'Calculate Working Days Between Dates or Add Business Days',
        description: 'Free working days calculator. Count business days between two dates, or add working days to a start date to find a deadline. Excludes weekends and US public holidays.',
        icon: '📆',
        category: 'Utility Tools',
        keywords: ['working days calculator', 'business days calculator', 'days between dates calculator', 'add working days to date', 'business day calculator freelancer', 'working day counter'],
        faqs: [
          { q: 'What counts as a working day?', a: 'A working day (also called a business day) is any day Monday through Friday that is not a public holiday. Saturdays and Sundays are not working days. Some freelancers and countries may define this differently — this calculator uses the standard Mon–Fri definition.' },
          { q: 'How do I calculate business days between two dates?', a: 'Count all days from start to end, then subtract Saturdays, Sundays, and any public holidays. For example, May 1 (Thursday) to May 9 (Friday) = 9 calendar days, but only 5 business days (excluding the weekend of May 3–4).' },
          { q: 'How do I add 10 business days to a date?', a: 'Use the "Add Working Days" mode above. Enter your start date and the number of business days to add. The calculator skips weekends and holidays to give you the exact deadline date.' },
          { q: 'Why use working days for freelance project timelines?', a: 'Clients don\'t work on weekends or holidays, so deliverables, feedback, and payments are governed by business days. Quoting timelines in business days (e.g., "10 business days") is more professional and prevents misunderstandings.' },
          { q: 'Does this calculator account for holidays?', a: 'Yes — you can toggle US public holiday exclusion. The calculator includes major US federal holidays. If you\'re in another country or have custom non-working days, use the calendar-day count and subtract holidays manually.' },
        ],
        programmaticVariants: [
          { slug: 'between-dates', label: 'Between Two Dates' },
          { slug: 'add-5-days', label: 'Add 5 Business Days' },
          { slug: 'add-10-days', label: 'Add 10 Business Days' },
          { slug: 'add-30-days', label: 'Add 30 Business Days' },
        ],
      },
      {
        slug: 'time-zone-converter',
        title: 'Time Zone Converter',
        headline: 'Time Zone Converter for Freelancers & Remote Teams',
        description: 'Free time zone converter for freelancers. Enter your time zone and a client\'s time zone to find overlapping business hours and schedule meetings without confusion.',
        icon: '🌍',
        category: 'Utility Tools',
        keywords: ['time zone converter', 'time zone meeting planner', 'world clock for freelancers', 'remote team time zone tool', 'schedule meeting across time zones'],
        faqs: [
          { q: 'How do I schedule a meeting across time zones?', a: 'Enter your time zone and your client\'s time zone. The converter shows what time it will be for each party at any given hour. Aim for meeting times that fall within both parties\' 9am–6pm window.' },
          { q: 'What are the best hours to schedule with US clients from Europe?', a: 'Central European Time (CET/UTC+1) overlaps with US Eastern Time (EST/UTC-5) from approximately 3pm–6pm CET (9am–12pm EST). With US Pacific Time (UTC-8), the overlap is very limited — 6pm–7pm CET / 9am–10am PST.' },
          { q: 'What does UTC mean?', a: 'UTC (Coordinated Universal Time) is the global time standard. All time zones are expressed as offsets from UTC — for example, UTC+5:30 is India Standard Time, UTC-8 is US Pacific Standard Time.' },
          { q: 'How do I avoid scheduling mistakes with international clients?', a: 'Always confirm the client\'s exact time zone (not just country — some countries have multiple zones). Send calendar invites in UTC or use a tool like this to convert first. Mention the time zone explicitly in your confirmation emails.' },
          { q: 'Does this account for Daylight Saving Time?', a: 'Yes. The converter uses your browser\'s locale data which automatically accounts for current DST rules for each region.' },
        ],
        programmaticVariants: [
          { slug: 'us-to-uk', label: 'US to UK' },
          { slug: 'us-to-india', label: 'US to India' },
          { slug: 'us-to-australia', label: 'US to Australia' },
          { slug: 'europe-to-us', label: 'Europe to US' },
        ],
      },
    ],
  },
  ...ADVANCED_TOOL_CATEGORIES,
]

export const ALL_TOOLS: ToolMeta[] = TOOL_CATEGORIES.flatMap((c) => c.tools)
export const PRICING_TOOLS = TOOL_CATEGORIES[0].tools

export function getToolBySlug(slug: string): ToolMeta | undefined {
  return ALL_TOOLS.find((t) => t.slug === slug)
}

export function getRelatedTools(slug: string, limit = 4): ToolMeta[] {
  const tool = getToolBySlug(slug)
  if (!tool) return []
  const sameCategory = ALL_TOOLS.filter((t) => t.category === tool.category && t.slug !== slug)
  const otherCategories = ALL_TOOLS.filter((t) => t.category !== tool.category)
  return [...sameCategory, ...otherCategories].slice(0, limit)
}
