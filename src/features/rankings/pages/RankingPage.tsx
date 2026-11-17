import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { AnalyticsPlayerSort } from '../../../services/api/analytics'
import { useAnalyticsScreenPlayers } from '../../../services/queries/analyticsScreens'
import { CommunityTotals } from '../../../components/data-display/CommunityTotals/CommunityTotals'
import { AnalyticsPlayerResults } from '../../../components/data-display/AnalyticsPlayerResults/AnalyticsPlayerResults'
import { PlayerFilters } from '../../../components/data-display/PlayerFilters/PlayerFilters'
import { QueryState } from '../../../components/common/QueryState/QueryState'
import { PageHero } from '../../../components/layout/PageHero/PageHero'
import { Container } from '../../../components/layout/Container/Container'
import { assets } from '../../../constants/assets'
import { analyticsScreenPageSize } from '../../../services/queries/analyticsScreens'

const sortOptions = [
  { value: 'container_interactions_observed', label: 'Interações observadas' },
  { value: 'treasure_events_observed', label: 'Eventos de tesouro' },
  { value: 'matches_played', label: 'Partidas registradas' },
]

function isPlayerSort(value: string | null): value is AnalyticsPlayerSort {
  return value === 'container_interactions_observed' ||
    value === 'treasure_events_observed' ||
    value === 'matches_played'
}

export function RankingPage() {
  const [params, setParams] = useSearchParams()
  const search = params.get('search') ?? ''
  const sortParam = params.get('sort')
  const sort: AnalyticsPlayerSort = isPlayerSort(sortParam) ? sortParam : 'container_interactions_observed'
  const page = Math.min(1_000_000, Math.max(1, Number.parseInt(params.get('page') ?? '1', 10) || 1))
  const [draftQuery, setDraftQuery] = useState(search)
  const [draftSort, setDraftSort] = useState(sort)
  const ranking = useAnalyticsScreenPlayers({ screen: 'ranking', search, sort, page })

  useEffect(() => {
    setDraftQuery(search)
    setDraftSort(sort)
  }, [search, sort])

  function applyFilters() {
    const next = new URLSearchParams(params)
    if (draftQuery.trim()) next.set('search', draftQuery.trim())
    else next.delete('search')
    next.set('sort', draftSort)
    next.set('page', '1')
    setParams(next)
  }

  function changeSort(value: string) {
    setDraftSort(isPlayerSort(value) ? value : 'container_interactions_observed')
  }

  function changePage(nextPage: number) {
    const next = new URLSearchParams(params)
    next.set('page', String(nextPage))
    setParams(next)
  }

  return (
    <div className="analytics-page">
      <PageHero
        image={assets.headerRanking}
        title="Ranking"
        description="Confira os jogadores com mais interações observadas na comunidade."
      />
      <QueryState
        isLoading={ranking.isPending}
        error={ranking.data ? null : ranking.error}
        isEmpty={!ranking.data}
        onRetry={() => void ranking.refetch()}
        emptyMessage="A API não retornou o ranking."
      >
        {ranking.data && (
          <>
            <CommunityTotals totals={ranking.data.totals} />
            <Container className="analytics-content">
              <div className="analytics-directory-grid">
                <PlayerFilters
                  query={draftQuery}
                  sort={draftSort}
                  queryLabel="Buscar jogador"
                  queryPlaceholder="Nome, Epic ID ou ID de plataforma"
                  sortLabel="Tipo de ranking"
                  sortOptions={sortOptions}
                  onQueryChange={setDraftQuery}
                  onSortChange={changeSort}
                  onApply={applyFilters}
                />
                <AnalyticsPlayerResults
                  items={ranking.data.items}
                  total={ranking.data.total}
                  page={ranking.data.page}
                  pageSize={ranking.data.page_size || analyticsScreenPageSize}
                  query={search}
                  title="Ranking de Jogadores"
                  description={`Classificação por ${sortOptions.find((option) => option.value === sort)?.label.toLowerCase()}.`}
                  onPageChange={changePage}
                />
              </div>
            </Container>
          </>
        )}
      </QueryState>
    </div>
  )
}
