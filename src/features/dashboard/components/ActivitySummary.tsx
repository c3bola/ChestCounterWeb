import { Activity, CircleDollarSign, Gem, PackageOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '../../../components/common/Card/Card'
import type { AnalyticsHomeActivity, AnalyticsHomeEventType } from '../../../services/api/analytics'

const eventLabels: Record<AnalyticsHomeEventType, string> = {
  container_interaction: 'Interações com contêineres',
  treasure_event: 'Eventos de tesouro',
  prize_handler_grant: 'Recompensas processadas',
}

const eventIcons = {
  container_interaction: PackageOpen,
  treasure_event: Gem,
  prize_handler_grant: CircleDollarSign,
} satisfies Record<AnalyticsHomeEventType, LucideIcon>

export function ActivitySummary({ items }: { items: AnalyticsHomeActivity[] }) {
  const counts = items.reduce<Record<AnalyticsHomeEventType, number>>((result, item) => {
    result[item.event_type] += 1
    return result
  }, {
    container_interaction: 0,
    treasure_event: 0,
    prize_handler_grant: 0,
  })

  return (
    <Card className="panel activity-summary">
      <div className="hall-heading">
        <Activity size={30} aria-hidden="true" />
        <div>
          <h2>Eventos observados</h2>
          <p>Resumo dos últimos {items.length} registros recebidos.</p>
        </div>
      </div>
      {items.length ? (
        <ul className="activity-summary-list">
          {(Object.keys(eventLabels) as AnalyticsHomeEventType[]).map((eventType) => {
            const Icon = eventIcons[eventType]

            return (
              <li key={eventType}>
                <Icon aria-hidden="true" />
                <span>{eventLabels[eventType]}</span>
                <strong>{counts[eventType]}</strong>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="dashboard-data-state" role="status">Nenhum evento recente.</p>
      )}
    </Card>
  )
}
