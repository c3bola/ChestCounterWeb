import type { LucideIcon } from 'lucide-react'
import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

type Props = {
  Icon: LucideIcon
  title: string
  action?: { label: string; to: string }
}

export function SectionTitle({ Icon, title, action }: Props) {
  return (
    <div className="section-title">
      <h2><Icon size={28} aria-hidden="true" /> {title}</h2>
      {action && <Link to={action.to}>{action.label}<ArrowRight size={18} aria-hidden="true" /></Link>}
    </div>
  )
}
