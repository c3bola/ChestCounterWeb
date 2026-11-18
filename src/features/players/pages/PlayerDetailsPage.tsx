import { useEffect, useState } from 'react'
import {
  ArrowLeft,
  Copy,
} from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { Card } from '../../../components/common/Card/Card'
import { PlayerProfileLink } from '../../../components/common/PlayerProfileLink/PlayerProfileLink'
import { PlayerSkinAvatar } from '../../../components/common/PlayerSkinAvatar/PlayerSkinAvatar'
import { TilesetIcon } from '../../../components/common/TilesetIcon/TilesetIcon'
import type { TilesetIconName } from '../../../components/common/TilesetIcon/tilesetIcons'
import { Container } from '../../../components/layout/Container/Container'
import { PageHero } from '../../../components/layout/PageHero/PageHero'
import { assets } from '../../../constants/assets'
import {
  usePlayerAnalyticsHistory,
  usePlayerAnalyticsSummary,
  usePlayerAnalyticsTeammates,
  usePlayerAnalyticsTreasures,
} from '../../../services/queries/playerAnalytics'
import { usePlayerSkin } from '../../../services/queries/playerSkins'
import type { PlayerAnalyticsPage } from '../../../services/api/playerAnalytics'
import { numberFormatter } from '../../../utils/formatters'
import { containerCategoryLabel } from '../utils/containerCategoryLabel'
import { playlistLabel } from '../utils/playlistLabel'
import {
  ProfileSectionSkeleton,
  ProfileSummarySkeleton,
} from '../../../components/common/Skeleton/LoadingSkeletons'

const dateFormatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium' })
const dateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'medium',
  timeStyle: 'short',
})
const decimalFormatter = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

function formatDate(value: string | null, withTime = false): string {
  if (!value) return 'Não disponível'
  if (!withTime && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split('-').map(Number)
    return dateFormatter.format(new Date(year, month - 1, day, 12))
  }
  const timestamp = Date.parse(value)
  if (Number.isNaN(timestamp)) return 'Não disponível'
  return (withTime ? dateTimeFormatter : dateFormatter).format(timestamp)
}

function formatMetric(value: number | null, decimals = false): string {
  if (value === null) return 'Não disponível'
  return decimals ? decimalFormatter.format(value) : numberFormatter.format(value)
}

function SectionState({
  query,
  emptyMessage,
  loadingFallback,
  children,
}: {
  query: {
    isPending: boolean
    error: Error | null
    data?: unknown
    refetch: () => Promise<unknown>
  }
  emptyMessage: string
  loadingFallback?: React.ReactNode
  children: React.ReactNode
}) {
  if (query.isPending) {
    return loadingFallback ?? <ProfileSectionSkeleton kind="table" />
  }
  if (query.error && !query.data) {
    return (
      <div className="profile-section-state profile-section-error" role="alert">
        <p>Não foi possível carregar esta seção. {query.error.message}</p>
        <button type="button" onClick={() => void query.refetch()}>Tentar novamente</button>
      </div>
    )
  }
  return children || <p className="profile-section-state" role="status">{emptyMessage}</p>
}

function Pagination({
  result,
  onPageChange,
  label,
}: {
  result: PlayerAnalyticsPage<unknown>
  onPageChange: (page: number) => void
  label: string
}) {
  if (result.total_pages < 2) return null
  return (
    <nav className="profile-pagination" aria-label={`Paginação de ${label}`}>
      <button type="button" onClick={() => onPageChange(result.page - 1)} disabled={result.page <= 1} aria-label="Página anterior">
        <TilesetIcon name="previous" size={22} />
      </button>
      <span>Página {numberFormatter.format(result.page)} de {numberFormatter.format(result.total_pages)}</span>
      <button type="button" onClick={() => onPageChange(result.page + 1)} disabled={result.page >= result.total_pages} aria-label="Próxima página">
        <TilesetIcon name="next" size={22} />
      </button>
    </nav>
  )
}

function ProfileStat({ icon, label, value }: { icon: TilesetIconName; label: string; value: string }) {
  return (
    <div className="profile-stat">
      <TilesetIcon name={icon} size={38} />
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function SectionHeading({
  icon,
  title,
  description,
  detail,
  id,
}: {
  icon: TilesetIconName
  title: string
  description: string
  detail?: React.ReactNode
  id?: string
}) {
  return (
    <header className="profile-panel-heading">
      <TilesetIcon name={icon} size={38} />
      <div><h2 id={id}>{title}</h2><p>{description}</p></div>
      {detail}
    </header>
  )
}
export function PlayerDetailsPage() {
  const { id: idParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedSkinId = searchParams.get('skin')
  const playerId = /^\d+$/.test(idParam ?? '') ? Number(idParam) : NaN
  const validPlayerId = Number.isSafeInteger(playerId) && playerId > 0
  const id = validPlayerId ? playerId : 0
  const [historyPage, setHistoryPage] = useState(1)
  const [teammatePage, setTeammatePage] = useState(1)
  const [treasurePage, setTreasurePage] = useState(1)
  const [shareMessage, setShareMessage] = useState('')
  const summary = usePlayerAnalyticsSummary(id)
  const history = usePlayerAnalyticsHistory(id, historyPage)
  const teammates = usePlayerAnalyticsTeammates(id, teammatePage)
  const treasures = usePlayerAnalyticsTreasures(id, treasurePage)
  const skin = usePlayerSkin(id, requestedSkinId)
  const name = summary.data?.display_name ?? `Jogador ${idParam ?? ''}`
  const daily = summary.data?.daily_history ?? []
  const chartMax = Math.max(
    1,
    ...daily.flatMap((item) => item.container_interactions_observed === null
      ? []
      : [item.container_interactions_observed]),
  )

  useEffect(() => {
    if (!validPlayerId || !skin.data || requestedSkinId === skin.data.id) return
    const next = new URLSearchParams(searchParams)
    next.set('skin', skin.data.id)
    setSearchParams(next, { replace: true })
  }, [validPlayerId, requestedSkinId, searchParams, setSearchParams, skin.data])

  async function shareProfile() {
    const url = window.location.href
    try {
      await navigator.share({ title: `Perfil de ${name}`, url })
      setShareMessage('Perfil compartilhado.')
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return
      try {
        await navigator.clipboard.writeText(url)
        setShareMessage('Link copiado.')
      } catch {
        setShareMessage('Não foi possível compartilhar o perfil.')
      }
    }
  }

  if (!validPlayerId) {
    return (
      <div className="analytics-page">
        <Container className="analytics-content">
          <Card className="player-profile">
            <p>O identificador do jogador na URL não é válido.</p>
            <Link className="back-link" to="/jogadores"><ArrowLeft size={17} /> Voltar aos jogadores</Link>
          </Card>
        </Container>
      </div>
    )
  }

  return (
    <div className="analytics-page">
      <PageHero
        image={assets.headerPlayers}
        title={name}
        description="Resumo das métricas observadas disponibilizadas pela API."
        loadingTitle={summary.isPending}
      />
      <Container className="player-analytics-content">
        <div className="player-profile-toolbar">
          <Link className="back-link" to="/jogadores"><ArrowLeft size={17} /> Voltar aos jogadores</Link>
          <div className="player-share">
            <button type="button" className="player-share-button" onClick={() => void shareProfile()}>
              {typeof navigator !== 'undefined' && 'share' in navigator
                ? <TilesetIcon name="share" size={24} />
                : <Copy size={16} />}
              Compartilhar perfil
            </button>
            <span className="player-share-feedback" role="status" aria-live="polite">{shareMessage}</span>
          </div>
        </div>

        <section aria-label="Resumo do jogador">
          <SectionState query={summary} emptyMessage="Não há dados de resumo para este jogador." loadingFallback={<ProfileSummarySkeleton />}>
            {summary.data ? (
              <Card className="player-summary-card">
                <header className="profile-summary-heading">
                  <div>
                    <span>RESUMO DO JOGADOR</span>
                    <p>
                      Primeira partida: {formatDate(summary.data.first_match_at)}
                      {' · '}Último registro: {formatDate(summary.data.last_match_at)}
                    </p>
                  </div>
                  <div className="profile-summary-skin">
                    {skin.error && <span role="status">Catálogo de skins indisponível.</span>}
                    <PlayerSkinAvatar
                      playerId={id}
                      preferredSkinId={requestedSkinId}
                      alt={`Skin de ${name}`}
                      color="teal"
                      size={38}
                    />
                  </div>
                </header>
                <div className="player-profile-metrics">
                  <ProfileStat icon="gamepad" label="Partidas" value={formatMetric(summary.data.matches_played)} />
                  <ProfileStat icon="trophy" label="Vitórias registradas" value={formatMetric(summary.data.wins)} />
                  <ProfileStat icon="rifle" label="Eliminações individuais" value={formatMetric(summary.data.kills)} />
                  <ProfileStat icon="star" label="Colocação média" value={formatMetric(summary.data.average_placement, true)} />
                  <ProfileStat icon="chest" label="Interações observadas" value={formatMetric(summary.data.container_interactions_observed)} />
                  <ProfileStat icon="chart" label="Média de interações por partida coberta" value={formatMetric(summary.data.average_interactions_per_covered_match, true)} />
                  <ProfileStat icon="chest" label="Média de baús classificados por partida" value={formatMetric(summary.data.average_chests_per_covered_match, true)} />
                  <ProfileStat icon="star" label="Recorde de interações em partida" value={formatMetric(summary.data.record_interactions_in_match)} />
                  <ProfileStat icon="chest" label="Recorde de baús classificados" value={formatMetric(summary.data.record_chests_in_match)} />
                  <ProfileStat icon="team" label="Eliminações de equipe" value={formatMetric(summary.data.team_kills)} />
                  <ProfileStat icon="gem" label="Eventos de tesouro" value={formatMetric(summary.data.treasure_events_observed)} />
                </div>
                <p className="player-profile-note">
                  Interações de contêiner não confirmam baús abertos. Os indicadores de baús correspondem a interações classificadas pela API; valores indisponíveis permanecem sem estimativa.
                </p>
              </Card>
            ) : null}
          </SectionState>
        </section>

        <div className="player-profile-grid">
          <section aria-labelledby="player-evolution-title">
            <Card className="profile-panel">
              <SectionHeading id="player-evolution-title" icon="chart" title="Evolução diária" description="Interações observadas por data da partida" />
              <SectionState query={summary} emptyMessage="Não há registros diários para este jogador." loadingFallback={<ProfileSectionSkeleton kind="chart" />}>
                {summary.data && daily.length > 0 ? (
                  daily.some((item) => item.container_interactions_observed !== null) ? (
                    <div className="profile-chart" role="list" aria-label="Interações observadas por dia">
                      {daily.map((item) => {
                        const value = item.container_interactions_observed
                        return (
                          <div className="profile-chart-column" key={item.date} role="listitem"
                            title={`${formatDate(item.date)}: ${value === null ? 'dados indisponíveis' : `${numberFormatter.format(value)} interações`}`}>
                            <span className="profile-chart-value">{value === null ? '—' : numberFormatter.format(value)}</span>
                            <div className="profile-chart-track">
                              {value !== null && <span style={{ height: value === 0 ? '0%' : `${value / chartMax * 100}%` }} />}
                            </div>
                            <time dateTime={item.date}>{formatDate(item.date)}</time>
                          </div>
                        )
                      })}
                    </div>
                  ) : <p className="profile-section-state">Os registros diários não possuem cobertura de interações.</p>
                ) : null}
              </SectionState>
            </Card>
          </section>

          <section aria-labelledby="player-categories-title">
            <Card className="profile-panel">
              <SectionHeading id="player-categories-title" icon="chest" title="Categorias de contêiner" description="Classificação conforme retornada pela API" />
              <SectionState query={summary} emptyMessage="Não há categorias de contêiner para exibir." loadingFallback={<ProfileSectionSkeleton kind="categories" />}>
                {summary.data && summary.data.container_categories.length > 0 ? (
                  <>
                    <p className="profile-total">
                      Total: {numberFormatter.format(summary.data.container_interactions_observed)} interações observadas
                    </p>
                    {summary.data.container_categories.every((category) => category.category === 'unclassified') && (
                      <p className="profile-classification-note">Todas as interações retornadas estão sem classificação de categoria.</p>
                    )}
                    <ul className="profile-category-list">
                      {summary.data.container_categories.map((category) => (
                        <li key={category.category}>
                          <div><span>{containerCategoryLabel(category.category)}</span>
                            <strong>{numberFormatter.format(category.observed_interactions)}</strong></div>
                          <div className="profile-category-track" aria-label={`${decimalFormatter.format(category.percentage)}%`}>
                            <span style={{ width: `${Math.min(100, Math.max(0, category.percentage))}%` }} />
                          </div>
                          <small>{decimalFormatter.format(category.percentage)}% das interações observadas</small>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </SectionState>
            </Card>
          </section>

          <section aria-labelledby="player-playlists-title">
            <Card className="profile-panel">
              <SectionHeading id="player-playlists-title" icon="gamepad" title="Partidas por modo" description="Métricas agregadas por playlist reportada" />
              <SectionState query={summary} emptyMessage="Não há dados por playlist para exibir." loadingFallback={<ProfileSectionSkeleton kind="table" />}>
                {summary.data && summary.data.playlists.length > 0 ? (
                  <>
                    <div className="profile-table-wrap">
                      <table className="profile-table">
                        <thead><tr><th>Playlist</th><th>Partidas</th><th>Interações observadas</th><th>Baús classificados*</th><th>Média de baús*</th><th>Recorde de baús*</th><th>Vitórias</th></tr></thead>
                        <tbody>
                          {summary.data.playlists.map((playlist, index) => (
                            <tr key={`${playlist.playlist ?? 'sem-playlist'}-${index}`}>
                              <th scope="row">{playlistLabel(playlist.playlist)}</th>
                              <td>{formatMetric(playlist.matches_played)}</td>
                              <td>{formatMetric(playlist.interactions_observed)}</td>
                              <td>{formatMetric(playlist.chests_observed)}</td>
                              <td>{formatMetric(playlist.average_chests_per_covered_match, true)}</td>
                              <td>{formatMetric(playlist.record_chests_in_match)}</td>
                              <td>{formatMetric(playlist.wins)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <p className="profile-table-note">* Interações classificadas como baú não confirmam aberturas.</p>
                  </>
                ) : null}
              </SectionState>
            </Card>
          </section>
        </div>

        <section aria-labelledby="player-history-title">
          <Card className="profile-panel">
            <SectionHeading id="player-history-title" icon="calendar" title="Histórico de partidas" description="Dados individuais paginados retornados pela API"
              detail={history.data && <strong>{numberFormatter.format(history.data.total)} partidas</strong>} />
            <SectionState query={history} emptyMessage="Não há partidas registradas para este jogador." loadingFallback={<ProfileSectionSkeleton kind="table" />}>
              {history.data && history.data.items.length > 0 ? (
                <>
                  <div className="profile-table-wrap">
                    <table className="profile-table">
                      <thead><tr><th>Data</th><th>Playlist</th><th>Colocação</th><th>Eliminações</th><th>Interações</th><th>Tesouros</th></tr></thead>
                      <tbody>
                        {history.data.items.map((match) => (
                          <tr key={`${match.match_id}-${match.match_player_id}`}>
                            <td>{formatDate(match.match_start_at, true)}</td>
                            <td>{playlistLabel(match.playlist)}</td>
                            <td>{formatMetric(match.placement)}</td>
                            <td>{formatMetric(match.kills)}</td>
                            <td>{match.container_data_covered ? formatMetric(match.container_interactions_observed) : 'Sem cobertura'}</td>
                            <td>{formatMetric(match.treasure_events_observed)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <Pagination result={history.data} onPageChange={setHistoryPage} label="histórico de partidas" />
                </>
              ) : null}
            </SectionState>
          </Card>
        </section>

        <div className="player-lower-grid">
          <section aria-labelledby="player-teammates-title">
            <Card className="profile-panel">
              <SectionHeading id="player-teammates-title" icon="team" title="Companheiros de equipe" description="Identidades vinculadas a partidas com equipe registrada"
                detail={teammates.data && <strong>{numberFormatter.format(teammates.data.total)} jogadores</strong>} />
              <SectionState query={teammates} emptyMessage="Não há companheiros identificados nas partidas disponíveis." loadingFallback={<ProfileSectionSkeleton kind="teammates" />}>
                {teammates.data && teammates.data.items.length > 0 ? (
                  <>
                    <ul className="profile-teammates">
                      {teammates.data.items.map((teammate) => (
                        <li key={teammate.player_id}>
                          <PlayerSkinAvatar
                            playerId={teammate.player_id}
                            alt={`Skin de ${teammate.display_name ?? `jogador ${teammate.player_id}`}`}
                            color="teal"
                            size={30}
                          />
                          <div><strong>{teammate.display_name ?? `Jogador ${teammate.player_id}`}</strong></div>
                          <span>{numberFormatter.format(teammate.matches_together)} partidas juntos</span>
                          <PlayerProfileLink
                            playerId={teammate.player_id}
                            ariaLabel={`Ver perfil de ${teammate.display_name ?? `jogador ${teammate.player_id}`}`}
                          >
                            Ver perfil
                          </PlayerProfileLink>
                        </li>
                      ))}
                    </ul>
                    <Pagination result={teammates.data} onPageChange={setTeammatePage} label="companheiros de equipe" />
                  </>
                ) : null}
              </SectionState>
            </Card>
          </section>

          <section aria-labelledby="player-treasures-title">
            <Card className="profile-panel">
              <SectionHeading id="player-treasures-title" icon="gem" title="Eventos de tesouro" description="Eventos atribuídos diretamente ao jogador, sem classificação de recompensa"
                detail={treasures.data && <strong>{numberFormatter.format(treasures.data.total)} eventos</strong>} />
              <SectionState query={treasures} emptyMessage="Não há eventos de tesouro atribuídos diretamente a este jogador." loadingFallback={<ProfileSectionSkeleton kind="table" />}>
                {treasures.data && treasures.data.items.length > 0 ? (
                  <>
                    <div className="profile-table-wrap">
                      <table className="profile-table">
                        <thead><tr><th>Partida</th><th>Data</th><th>Item / ID observado</th><th>Origem informada</th><th>Momento</th><th>Classificação</th></tr></thead>
                        <tbody>
                          {treasures.data.items.map((event) => (
                            <tr key={event.id}>
                              <td>{numberFormatter.format(event.match_id)}</td>
                              <td>{formatDate(event.match_start_at, true)}</td>
                              <td>{event.prize_id ?? 'Não informado'}</td>
                              <td>{event.source_container ?? 'Não informada'}</td>
                              <td>{event.time_seconds === null ? 'Não informado' : `${decimalFormatter.format(event.time_seconds)} s`}</td>
                              <td><span className="profile-unclassified">Não classificado</span></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Pagination result={treasures.data} onPageChange={setTreasurePage} label="eventos de tesouro" />
                  </>
                ) : null}
              </SectionState>
            </Card>
          </section>
        </div>
      </Container>
    </div>
  )
}
