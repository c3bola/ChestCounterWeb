import { CircleDollarSign, Clock3, Gem, PackageOpen } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card } from '../../../components/common/Card/Card'
import type { AnalyticsHomeActivity, AnalyticsHomeEventType } from '../../../services/api/analytics'
import { SectionTitle } from './SectionTitle'

const relativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', { numeric: 'auto' })

function formatRelativeTime(timestamp: string): string {
  const difference = (Date.parse(timestamp) - Date.now()) / 1000
  const absoluteDifference = Math.abs(difference)

  if (absoluteDifference < 60) return relativeTimeFormatter.format(Math.round(difference), 'second')
  if (absoluteDifference < 3600) return relativeTimeFormatter.format(Math.round(difference / 60), 'minute')
  if (absoluteDifference < 86400) return relativeTimeFormatter.format(Math.round(difference / 3600), 'hour')
  return relativeTimeFormatter.format(Math.round(difference / 86400), 'day')
}

const eventIcons = {
  container_interaction: PackageOpen,
  treasure_event: Gem,
  prize_handler_grant: CircleDollarSign,
} satisfies Record<AnalyticsHomeEventType, LucideIcon>

export function RecentActivities({ items }: { items: AnalyticsHomeActivity[] }) {
  return (
    <Card className="panel activity" id="atividades">
      <SectionTitle Icon={Clock3} title="Atividade Recente" action={{ label: 'Ver todas as atividades', to: '#atividades' }} />
      {items.length ? (
        <ul className="activity-list">
          {items.map((item) => {
            const Icon = eventIcons[item.event_type]

            return (
              <li key={item.id}>
                <Icon className="activity-icon" aria-hidden="true" />
                <p>
                  <strong>{item.player_name ?? 'Jogador não identificado'}</strong> {item.description}
                </p>
                <time dateTime={item.received_at} title="Horário de recebimento do registro">
                  {formatRelativeTime(item.received_at)}
                </time>
              </li>
            )
          })}
        </ul>
      ) : (
        <p className="dashboard-data-state" role="status">Nenhuma atividade recente.</p>
      )}
    </Card>
  )
}
