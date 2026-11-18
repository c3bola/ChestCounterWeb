import { BarChart3, CircleHelp } from 'lucide-react'
import { Card } from '../../../components/common/Card/Card'
import { QueryState } from '../../../components/common/QueryState/QueryState'
import { CommunityTotals } from '../../../components/data-display/CommunityTotals/CommunityTotals'
import { PageHero } from '../../../components/layout/PageHero/PageHero'
import { Container } from '../../../components/layout/Container/Container'
import { assets } from '../../../constants/assets'
import { useAnalyticsScreenStatistics } from '../../../services/queries/analyticsScreens'
import { numberFormatter } from '../../../utils/formatters'
import { StatisticsLoadingSkeleton } from '../../../components/common/Skeleton/LoadingSkeletons'

export function StatisticsPage() {
  const statistics = useAnalyticsScreenStatistics()
  const playlists = statistics.data?.matches_by_playlist ?? []
  const maxMatches = Math.max(1, ...playlists.map((item) => item.matches_recorded))

  return (
    <div className="analytics-page">
      <PageHero
        image={assets.headerStatistics}
        title="Estatísticas"
        description="Acompanhe os dados observados e a atividade registrada pela comunidade."
      />
      <QueryState
        isLoading={statistics.isPending}
        error={statistics.data ? null : statistics.error}
        isEmpty={!statistics.data}
        onRetry={() => void statistics.refetch()}
        emptyMessage="A API não retornou estatísticas."
        loadingFallback={<StatisticsLoadingSkeleton />}
      >
        {statistics.data && (
          <>
            <CommunityTotals totals={statistics.data.totals} />
            <Container className="analytics-content">
              <div className="statistics-grid">
                <Card className="statistics-panel">
                  <header className="analytics-section-heading">
                    <BarChart3 aria-hidden="true" />
                    <div>
                      <h2>Partidas por playlist</h2>
                      <p>Distribuição das partidas registradas por modo.</p>
                    </div>
                  </header>
                  {playlists.length ? (
                    <ul className="playlist-chart">
                      {playlists.map(({ playlist, matches_recorded }, index) => (
                          <li key={`${playlist ?? 'unknown-playlist'}-${index}`}>
                            <div>
                              <span>{playlist ?? 'Playlist não identificada'}</span>
                              <strong>{numberFormatter.format(matches_recorded)}</strong>
                            </div>
                            <span className="playlist-bar">
                              <span style={{ width: `${(matches_recorded / maxMatches) * 100}%` }} />
                            </span>
                          </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="analytics-empty">A API ainda não retornou partidas agrupadas por playlist.</p>
                  )}
                </Card>
                <Card className="statistics-panel statistics-notes">
                  <header className="analytics-section-heading">
                    <CircleHelp aria-hidden="true" />
                    <div>
                      <h2>Como interpretar</h2>
                      <p>Métricas baseadas em observações persistidas.</p>
                    </div>
                  </header>
                  <ul>
                    <li>Interações com contêineres não confirmam, por si só, a abertura de um baú.</li>
                    <li>Eventos de tesouro não são classificados como tokens ou recompensas.</li>
                    <li>A API não fornece série histórica nem filtros por período nesta tela.</li>
                  </ul>
                </Card>
              </div>
            </Container>
          </>
        )}
      </QueryState>
    </div>
  )
}
