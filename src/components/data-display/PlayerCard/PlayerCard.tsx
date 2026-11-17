import type { ReactNode } from 'react'

export function PlayerCard({ children }: { children: ReactNode }) {
  return <li className="player-row">{children}</li>
}
