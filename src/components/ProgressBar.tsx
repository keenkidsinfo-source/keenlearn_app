interface ProgressBarProps {
  pct: number          // 0–100
  color?: string       // tailwind bg class e.g. 'bg-science-500'
  label?: string
  height?: string      // tailwind h class e.g. 'h-3'
}

export function ProgressBar({ pct, color = 'bg-keen-500', label, height = 'h-3' }: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, pct))
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between text-sm font-semibold text-gray-500 mb-1">
          <span>{label}</span>
          <span>{Math.round(clamped)}%</span>
        </div>
      )}
      <div className={`w-full ${height} bg-gray-100 rounded-full overflow-hidden`}>
        <div
          className={`${height} ${color} rounded-full transition-all duration-500`}
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  )
}
