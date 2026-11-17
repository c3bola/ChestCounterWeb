import type { ReactNode } from 'react'

export function StatCard({ icon, value, label }: { icon: ReactNode; value: string; label: string }) {
  return <div className="stat">{icon}<div><strong>{value}</strong><span>{label}</span></div></div>
}
