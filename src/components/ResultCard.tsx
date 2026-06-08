interface ResultCardProps {
  label: string
  value: string
  highlight?: boolean
  sublabel?: string
}

export default function ResultCard({ label, value, highlight, sublabel }: ResultCardProps) {
  return (
    <div
      className={`result-card ${
        highlight ? 'border-brand-200 bg-brand-50' : ''
      }`}
    >
      <p className="text-xs font-medium uppercase tracking-wider text-gray-400">{label}</p>
      <p className={`mt-1 text-xl sm:text-2xl font-bold break-words ${highlight ? 'text-brand-700' : 'text-gray-900'}`}>{value}</p>
      {sublabel && <p className="mt-0.5 text-xs text-gray-500">{sublabel}</p>}
    </div>
  )
}
