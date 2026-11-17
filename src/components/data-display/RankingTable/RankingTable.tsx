import type { ReactNode } from 'react'

export function RankingTable({ className, children }: { className?: string; children: ReactNode }) {
  return <ol className={className}>{children}</ol>
}
