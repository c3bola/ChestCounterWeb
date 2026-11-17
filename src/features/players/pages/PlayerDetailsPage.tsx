import { Activity, ArrowLeft, Gem } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { Card } from '../../../components/common/Card/Card'
import { ChestIcon } from '../../../components/data-display/ChestIcon/ChestIcon'
import { Container } from '../../../components/layout/Container/Container'
import { PageHero } from '../../../components/layout/PageHero/PageHero'
import type { AnalyticsScreenPlayer } from '../../../services/api/analytics'
import { assets } from '../../../constants/assets'
import { numberFormatter } from '../../../utils/formatters'

function isAnalyticsScreenPlayer(value: unknown): value is AnalyticsScreenPlayer {
  if (typeof value !== 'object' || value === null) return false

  const player = value as Record<string, unknown>
  return Number.isInteger(player.position) &&
    Number.isInteger(player.player_id) &&
    (typeof player.display_name === 'string' || player.display_name === null) &&
    Number.isInteger(player.matches_played) &&
    Number.isInteger(player.container_interactions_observed) &&
    Number.isInteger(player.treasure_events_observed)
}

export function PlayerDetailsPage() {
  const { id } = useParams()
  const location = useLocation()
  const state = typeof location.state === 'object' && location.state !== null
    ? location.state as { player?: unknown }
    : null
  const player = isAnalyticsScreenPlayer(state?.player) &&
    String(state.player.player_id) === id
    ? state.player
    : null
  const name = player?.display_name ?? `Jogador ${id ?? ''}`

  return (
    <div className="analytics-page">
      <PageHero
        image={assets.headerPlayers}
        title={player ? name : 'Perfil do jogador'}
        description={player
          ? 'Resumo das métricas observadas disponibilizadas pela API.'
          : 'As informações detalhadas dependem de abrir o perfil a partir da lista de jogadores.'}
      />
      {player ? (
        <Container className="analytics-content">
          <Card className="player-profile">
            <header className="player-profile-heading">
              <div>
                <span>Jogador identificado</span>
                <h2>{name}</h2>
                <p>ID: {numberFormatter.format(player.player_id)}</p>
              </div>
              <Link className="back-link" to="/jogadores"><ArrowLeft size={17} /> Voltar aos jogadores</Link>
            </header>
            <div className="player-profile-metrics">
              <div><ChestIcon /><span>Interações observadas</span><strong>{numberFormatter.format(player.container_interactions_observed)}</strong></div>
              <div><Gem /><span>Eventos de tesouro</span><strong>{numberFormatter.format(player.treasure_events_observed)}</strong></div>
              <div><Activity /><span>Partidas registradas</span><strong>{numberFormatter.format(player.matches_played)}</strong></div>
            </div>
            <p className="player-profile-note">
              Estes dados são observações registradas e não representam, por si só, aberturas confirmadas de baús ou tokens encontrados.
            </p>
          </Card>
        </Container>
      ) : (
        <Container className="analytics-content">
          <Card className="player-profile">
            <p>Este perfil não contém dados da listagem atual. A API não oferece uma consulta pública individual por ID para esta tela.</p>
            <Link className="back-link" to="/jogadores"><ArrowLeft size={17} /> Voltar à lista de jogadores</Link>
          </Card>
        </Container>
      )}
    </div>
  )
}
