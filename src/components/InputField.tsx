interface InputFieldProps {
  label: string
  value: number | string
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  prefix?: string
  suffix?: string
  hint?: string
}

export default function InputField({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix,
  suffix,
  hint,
}: InputFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">{label}</label>
      {hint && <p className="mb-1.5 text-xs leading-relaxed text-gray-400">{hint}</p>}
      <div className="flex items-center">
        {prefix && (
          <span className="flex h-10 flex-shrink-0 items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
            {prefix}
          </span>
        )}
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          /* font-size ≥ 16px prevents iOS auto-zoom on focus */
          style={{ fontSize: 'max(16px, 0.875rem)' }}
          className={`input-field h-10 ${prefix ? 'rounded-l-none' : ''} ${suffix ? 'rounded-r-none' : ''}`}
        />
        {suffix && (
          <span className="flex h-10 flex-shrink-0 items-center rounded-r-lg border border-l-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    </div>
  )
}
