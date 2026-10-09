import type { ArtProps } from './ProjectArt'

/** Intranet BMOI — Enterprise · Intranet. Module grid behind an SSO lock. */
export default function IntranetArt({ className }: ArtProps) {
  const modules = Array.from({ length: 14 }, (_, i) => i)
  return (
    <svg
      className={className}
      viewBox="0 0 600 340"
      preserveAspectRatio="xMidYMid slice"
    >
      <rect width="600" height="340" fill="#0b0f17" />
      <defs>
        <linearGradient id="g-intranet" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#16223a" />
          <stop offset="1" stopColor="#0b0f17" />
        </linearGradient>
      </defs>
      <rect width="600" height="340" fill="url(#g-intranet)" />
      {/* 14 business modules — a 7 × 2 grid */}
      <g transform="translate(76 92)">
        {modules.map((i) => (
          <rect
            key={i}
            x={(i % 7) * 66}
            y={Math.floor(i / 7) * 66}
            width="54"
            height="54"
            rx="8"
            fill="#16223a"
            stroke="#8FA8FF"
            strokeWidth="1.2"
            opacity={0.45 + (i % 4) * 0.15}
          >
            <animate
              attributeName="opacity"
              values="0.35;0.9;0.35"
              dur="4s"
              begin={`${i * 0.25}s`}
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </g>
      {/* SSO lock badge */}
      <g transform="translate(300 262)">
        <circle r="20" fill="#8FA8FF" />
        <rect x="-7" y="-2" width="14" height="11" rx="2" fill="#0b0f17" />
        <path
          d="M -4 -2 v -4 a 4 4 0 0 1 8 0 v 4"
          fill="none"
          stroke="#0b0f17"
          strokeWidth="2"
        />
      </g>
      <text
        x="48"
        y="306"
        fontFamily="monospace"
        fontSize="11"
        fill="#5e6f99"
        letterSpacing="0.1em"
      >
        DDD · CQRS · 14 MODULES · AZURE AD
      </text>
    </svg>
  )
}
