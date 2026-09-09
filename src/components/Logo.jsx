export default function Logo({ size = 30 }) {
  return (
    <svg
      className="logo"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      role="img"
      aria-label="TaskFlow"
    >
      <rect width="32" height="32" rx="8" fill="url(#logo-gradient)" />
      <path
        d="M9 16.5l4.5 4.5L23 11.5"
        stroke="white"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <defs>
        <linearGradient id="logo-gradient" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#6366f1" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
    </svg>
  )
}
