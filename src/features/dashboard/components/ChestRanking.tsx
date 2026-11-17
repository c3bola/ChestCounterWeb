import { Trophy } from 'lucide-react'
import { Badge } from '../../../components/common/Badge/Badge'
import { Card } from '../../../components/common/Card/Card'
import { PlayerSkinAvatar } from '../../../components/common/PlayerSkinAvatar/PlayerSkinAvatar'
import { PlayerCard } from '../../../components/data-display/PlayerCard/PlayerCard'
import { RankingTable } from '../../../components/data-display/RankingTable/RankingTable'
import { ChestIcon } from '../../../components/data-display/ChestIcon/ChestIcon'
import type { AnalyticsScreenPlayer } from '../../../services/api/analytics'
import { SectionTitle } from './SectionTitle'

const numberFormatter = new Intl.NumberFormat('pt-BR')

export function ChestRanking({ items }: { items: AnalyticsScreenPlayer[] }) {
  return (
    <Card className="panel" id="ranking">
      <SectionTitle Icon={Trophy} title="Ranking de Interações" action={{ label: 'Ver ranking completo', to: '/ranking' }} />
      {items.length ? (
        <RankingTable className="ranking-list">
          {items.map((player) => {
            const name = player.display_name ?? `Jogador ${player.player_id}`

            return (
              <PlayerCard key={player.player_id}>
                <Badge className={`rank rank-${player.position}`}>{player.position}º</Badge>
                <PlayerSkinAvatar playerId={player.player_id} color="coral" alt={`Skin de ${name}`} />
                <strong className="player-name">{name}</strong>
                <ChestIcon className="row-chest" />
                <strong className="player-score">{numberFormatter.format(player.container_interactions_observed)}</strong>
              </PlayerCard>
            )
          })}
        </RankingTable>
      ) : (
        <p className="dashboard-data-state" role="status">Ainda não há interações registradas no ranking.</p>
      )}
    </Card>
  )
}
