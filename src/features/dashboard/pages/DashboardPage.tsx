import { Container } from '../../../components/layout/Container/Container'
import { QueryState } from '../../../components/common/QueryState/QueryState'
import { useDashboardQueries } from '../../../services/queries/dashboard'
import { ChestRanking } from '../components/ChestRanking'
import { ActivitySummary } from '../components/ActivitySummary'
import { CommunityTotals } from '../../../components/data-display/CommunityTotals/CommunityTotals'
import { HeroSection } from '../components/HeroSection'
import { QuickAccess } from '../components/QuickAccess'
import { RecentActivities } from '../components/RecentActivities'
import { DashboardLoadingSkeleton } from '../../../components/common/Skeleton/LoadingSkeletons'

export function DashboardPage() {
  const { home } = useDashboardQueries()

  return (
    <div className="dashboard">
      <HeroSection />
      <QuickAccess />
      <QueryState
        isLoading={home.isPending}
        error={home.data ? null : home.error}
        isEmpty={!home.data}
        onRetry={() => void home.refetch()}
        emptyMessage="A API não retornou dados para a página inicial."
        loadingFallback={<DashboardLoadingSkeleton />}
      >
        {home.data && (
          <>
            <CommunityTotals totals={home.data.totals} />
            <Container className="dashboard-content">
              <div className="ranking-grid">
                <ChestRanking items={home.data.observed_interaction_ranking} />
                <ActivitySummary items={home.data.recent_activity} />
              </div>
              <RecentActivities items={home.data.recent_activity} />
            </Container>
          </>
        )}
      </QueryState>
    </div>
  )
}
