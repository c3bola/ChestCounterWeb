import { Activity, Gem, Users } from 'lucide-react'
import type { AnalyticsScreenTotals } from '../../../services/api/analytics'
import { assets } from '../../../constants/assets'
import { ChestIcon } from '../ChestIcon/ChestIcon'
import { numberFormatter } from '../../../utils/formatters'

const totalItems: {
  label: string
  key: keyof AnalyticsScreenTotals
  icon: 'players' | 'matches' | 'interactions' | 'treasures'
}[] = [
  { label: 'Jogadores identificados', key: 'identified_players', icon: 'players' },
  { label: 'Partidas registradas', key: 'matches_recorded', icon: 'matches' },
  { label: 'Interações observadas', key: 'container_interactions_observed', icon: 'interactions' },
  { label: 'Eventos de tesouro', key: 'treasure_events_observed', icon: 'treasures' },
]

function TotalIcon({ icon }: { icon: (typeof totalItems)[number]['icon'] }) {
  if (icon === 'players') return <Users className="stat-players" size={48} aria-hidden="true" />
  if (icon === 'matches') return <Activity className="stat-activity" size={48} aria-hidden="true" />
  if (icon === 'interactions') return <ChestIcon className="stat-chest" />
  return <Gem className="stat-gem" size={48} aria-hidden="true" />
}

export function CommunityTotals({ totals }: { totals: AnalyticsScreenTotals }) {
  return (
    <section className="stats community-totals" aria-label="Indicadores observados da comunidade">
      <img className="stats-brush" src={assets.blueLineTop} alt="" aria-hidden="true" />
      {totalItems.map(({ label, key, icon }) => (
        <div key={key} className="stat">
          <TotalIcon icon={icon} />
          <div>
            <strong>{numberFormatter.format(totals[key])}</strong>
            <span>{label}</span>
          </div>
        </div>
      ))}
    </section>
  )
}
