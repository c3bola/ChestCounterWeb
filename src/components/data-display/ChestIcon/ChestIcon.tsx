export function ChestIcon({ className = '' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 70" fill="none" aria-hidden="true">
      <path d="M8 32V25C8 13 19 7 40 7s32 6 32 18v7" fill="#BA5B08" stroke="#7D3906" strokeWidth="4" />
      <path d="M8 30h64v28c0 3-3 5-6 5H14c-3 0-6-2-6-5V30Z" fill="#C86B0B" stroke="#7D3906" strokeWidth="4" />
      <path d="M6 28h68v10H6z" fill="#F9B900" stroke="#9D5600" strokeWidth="3" />
      <path d="M17 11h9v18h-9zM54 11h9v18h-9zM18 38h8v24h-8zM54 38h8v24h-8z" fill="#FFCF32" />
      <rect x="34" y="31" width="12" height="15" rx="2" fill="#FFDA55" stroke="#9D5600" strokeWidth="2" />
      <circle cx="40" cy="38" r="2" fill="#814000" />
    </svg>
  )
}
