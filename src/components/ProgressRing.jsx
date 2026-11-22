export default function ProgressRing({ value = 0, size = 58, stroke = 6, color = 'var(--accent)' }) {
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  return <svg className="progress-ring" width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-label={`${value}% complete`}>
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="var(--ring-track)" strokeWidth={stroke} />
    <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={circumference * (1 - value / 100)} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
    <text x="50%" y="54%" dominantBaseline="middle" textAnchor="middle" className="ring-label">{value}%</text>
  </svg>
}
