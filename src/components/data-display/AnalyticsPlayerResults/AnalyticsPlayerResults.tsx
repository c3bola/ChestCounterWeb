import { Activity, ArrowUpRight, ChevronLeft, ChevronRight, Gem, Search, Users } from 'lucide-react'
import { Card } from '../../common/Card/Card'
import { PlayerProfileLink } from '../../common/PlayerProfileLink/PlayerProfileLink'
import { PlayerSkinAvatar } from '../../common/PlayerSkinAvatar/PlayerSkinAvatar'
import { ChestIcon } from '../ChestIcon/ChestIcon'
import { PlayerCard } from '../PlayerCard/PlayerCard'
import type { AnalyticsScreenPlayer } from '../../../services/api/analytics'
import { numberFormatter } from '../../../utils/formatters'

type Props = {
  items: AnalyticsScreenPlayer[]
  total: number
  page: number
  pageSize: number
  query: string
  title: string
  description: string
  onPageChange: (page: number) => void
}

export function AnalyticsPlayerResults({
  items,
  total,
  page,
  pageSize,
  query,
  title,
  description,
  onPageChange,
}: Props) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))

  return (
    <Card className="analytics-results">
      <header className="analytics-results-heading">
        <div className="analytics-results-title">
          <Users size={34} aria-hidden="true" />
          <div>
            <h2>{title}</h2>
            <p>{description}</p>
          </div>
        </div>
        <strong className="analytics-results-count">
          {numberFormatter.format(total)} {total === 1 ? 'jogador encontrado' : 'jogadores encontrados'}
        </strong>
      </header>
      {items.length ? (
        <>
          <div className="player-results-columns" aria-hidden="true">
            <span>#</span><span>Jogador</span><span><ChestIcon /> Interações</span>
            <span><Gem /> Tesouros</span><span><Activity /> Partidas</span><span />
          </div>
          <ol className="player-results-list">
            {items.map((player) => {
              const name = player.display_name ?? `Jogador ${player.player_id}`

              return (
                <PlayerCard key={player.player_id}>
                  <span className={`player-position rank-${player.position}`}>{player.position}</span>
                  <PlayerSkinAvatar playerId={player.player_id} color="teal" alt={`Skin de ${name}`} />
                  <strong className="player-name">{name}</strong>
                  <span className="player-result-metric metric-interactions"><ChestIcon /> {numberFormatter.format(player.container_interactions_observed)}</span>
                  <span className="player-result-metric metric-treasures"><Gem /> {numberFormatter.format(player.treasure_events_observed)}</span>
                  <span className="player-result-metric metric-matches"><Activity /> {numberFormatter.format(player.matches_played)}</span>
                  <PlayerProfileLink className="profile-link" playerId={player.player_id} state={{ player }}>
                    Ver perfil <ArrowUpRight size={16} aria-hidden="true" />
                  </PlayerProfileLink>
                </PlayerCard>
              )
            })}
          </ol>
          <nav className="pagination" aria-label="Paginação dos jogadores">
            <button type="button" onClick={() => onPageChange(page - 1)} disabled={page <= 1} aria-label="Página anterior">
              <ChevronLeft aria-hidden="true" />
            </button>
            <span>Página {numberFormatter.format(page)} de {numberFormatter.format(pageCount)}</span>
            <button type="button" onClick={() => onPageChange(page + 1)} disabled={page >= pageCount} aria-label="Próxima página">
              <ChevronRight aria-hidden="true" />
            </button>
          </nav>
        </>
      ) : (
        <div className="player-results-empty">
          <Search size={48} aria-hidden="true" />
          <p>
            {query
              ? `Nenhum jogador encontrado para “${query}”.`
              : 'Não há jogadores para exibir com esses filtros.'}
          </p>
        </div>
      )}
    </Card>
  )
}
