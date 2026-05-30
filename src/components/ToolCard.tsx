import Link from 'next/link'

interface ToolCardProps {
  title: string
  description: string
  href: string
  icon: string
  keywords?: string[]
}

export default function ToolCard({ title, description, href, icon, keywords }: ToolCardProps) {
  return (
    <Link
      href={href}
      className="group flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:border-brand-200 hover:shadow-md active:scale-[0.99] sm:p-6"
    >
      <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-2xl sm:mb-4 sm:h-12 sm:w-12">
        {icon}
      </div>
      <h2 className="text-sm font-semibold text-gray-900 group-hover:text-brand-600 sm:text-base">{title}</h2>
      <p className="mt-1.5 flex-1 text-xs leading-relaxed text-gray-500 sm:text-sm line-clamp-3">{description}</p>
      {keywords && (
        <div className="mt-3 flex flex-wrap gap-1.5 sm:mt-4">
          {keywords.slice(0, 2).map((kw) => (
            <span key={kw} className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs text-gray-500">
              {kw}
            </span>
          ))}
        </div>
      )}
      <span className="mt-3 text-xs font-medium text-brand-600 group-hover:underline sm:mt-4 sm:text-sm">Use tool →</span>
    </Link>
  )
}
