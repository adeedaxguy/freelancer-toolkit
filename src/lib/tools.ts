export interface ToolMeta {
  slug: string
  title: string
  headline: string
  description: string
  icon: string
  category: string
  keywords: string[]
  faqs: { q: string; a: string }[]
  programmaticVariants?: { slug: string; label: string; values?: Record<string, number | string> }[]
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
        description: 'Free project cost calculator for freelancers and agencies. Estimate hours, add a scope buffer and revisions, and get the right quote to stay profitable.',
        icon: '📋',
        category: 'Pricing & Profitability',
        keywords: ['project cost calculator', 'freelance project pricing', 'how to quote a freelance project'],
        faqs: [
          { q: 'How do I price a freelance project?', a: "Estimate hours × your hourly rate, then add a 15–25% scope buffer for unknowns, plus hours for revisions. This gives a quote that protects your margin." },
          { q: 'What is a scope buffer?', a: "A scope buffer (typically 15–25%) is padding added to your base estimate to cover unexpected work, client changes, or complexity you didn't anticipate." },
          { q: 'How many revision rounds should I include?', a: '2–3 revision rounds is standard for most creative or development projects. Define what counts as a revision in your contract to avoid scope creep.' },
        ],
        programmaticVariants: [
          { slug: 'for-1000', label: 'for $1,000 Projects' },
          { slug: 'for-5000', label: 'for $5,000 Projects' },
          { slug: 'for-10000', label: 'for $10,000 Projects' },
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
        headline: 'Calculate Your Upwork Fees & Net Earnings',
        description: 'Free Upwork fee calculator. Enter your project value and see exactly how much Upwork charges and what you take home.',
        icon: '🔢',
        category: 'Marketplace Tools',
        keywords: ['upwork fee calculator', 'upwork earnings calculator', 'how much does upwork charge'],
        faqs: [
          { q: 'How much does Upwork charge freelancers?', a: 'Upwork charges a flat 10% service fee on all earnings with a given client. This replaced the tiered fee structure (20%/10%/5%) in 2023.' },
          { q: 'Does Upwork charge clients too?', a: 'Yes. Clients pay a 5% payment processing fee on top of the contract amount.' },
          { q: 'How do I get paid more on Upwork?', a: 'Build long-term client relationships (reduces effective fee impact), raise your rates to account for the 10% cut, and pursue direct clients outside Upwork for large projects.' },
          { q: 'What is Upwork Connects?', a: "Connects are tokens used to bid on jobs. They don't reduce your earnings but are a cost to factor into your Upwork ROI calculation." },
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
        title: 'Freelancer Commission Calculator',
        headline: 'Calculate Marketplace Fees Across Platforms',
        description: 'Free commission calculator for Upwork, Fiverr, Freelancer.com, and PeoplePerHour. See your net income after platform fees on any project value.',
        icon: '🧮',
        category: 'Marketplace Tools',
        keywords: ['freelancer commission calculator', 'fiverr fee calculator', 'freelancer.com commission', 'peopleperhour fees'],
        faqs: [
          { q: 'How much does Fiverr take from sellers?', a: 'Fiverr charges a 20% commission on all seller earnings, regardless of order size.' },
          { q: 'What are Freelancer.com fees?', a: 'Freelancer.com charges 10% or $5 (whichever is greater) on fixed-price projects, and 10% on hourly projects.' },
          { q: 'Which freelance marketplace has the lowest fees?', a: 'Upwork (10%) and Freelancer.com (10%) have lower standard rates than Fiverr (20%). However, each platform has different client acquisition costs and competition levels.' },
          { q: 'How do I compare marketplaces?', a: 'Factor in fee percentage, typical project size, competition level, and how easy it is to find clients. Use this calculator to compare net earnings side-by-side.' },
        ],
        programmaticVariants: [
          { slug: 'upwork', label: 'for Upwork' },
          { slug: 'fiverr', label: 'for Fiverr' },
          { slug: 'freelancer-com', label: 'for Freelancer.com' },
          { slug: 'peopleperhour', label: 'for PeoplePerHour' },
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
        icon: '📝',
        category: 'Client Acquisition',
        keywords: ['proposal generator', 'freelance proposal generator', 'freelance proposal template'],
        faqs: [
          { q: 'What should a freelance proposal include?', a: 'A winning proposal includes: an executive summary, understanding of the problem, your proposed solution, scope of work, timeline, pricing, and a clear call to action.' },
          { q: 'How long should a freelance proposal be?', a: 'Keep it concise — 1 to 2 pages for most projects. Clients skim; lead with your understanding of their problem and how you solve it.' },
          { q: 'How do I win more proposals?', a: 'Personalize every proposal to the specific client and project, demonstrate you understand their business, and make the decision easy with clear pricing and next steps.' },
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
        icon: '📄',
        category: 'Client Acquisition',
        keywords: ['scope of work generator', 'sow generator', 'freelance scope of work template'],
        faqs: [
          { q: 'What is a Scope of Work (SOW)?', a: 'A scope of work is a document that defines project deliverables, timelines, responsibilities, and boundaries. It protects both parties by clarifying what is and is not included.' },
          { q: 'Why do freelancers need an SOW?', a: 'An SOW prevents scope creep, miscommunication, and disputes. It creates a clear record of what was agreed upon so you can point to it if a client requests out-of-scope work.' },
          { q: 'What is the difference between an SOW and a contract?', a: 'An SOW defines what work will be done. A contract defines the legal terms (payment, IP, liability). Ideally, both are signed — the SOW is often an attachment to the contract.' },
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
