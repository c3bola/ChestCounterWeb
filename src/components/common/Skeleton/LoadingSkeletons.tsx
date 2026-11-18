import { Card } from '../Card/Card'
import { Skeleton, SkeletonText } from './Skeleton'

function CommunityTotalsSkeleton() {
  return (
    <section className="stats community-totals skeleton-totals" aria-label="Carregando indicadores da comunidade">
      {Array.from({ length: 4 }, (_, index) => (
        <div className="stat" key={index}>
          <Skeleton shape="circle" width={48} height={48} />
          <div><Skeleton shape="title" width={76} /><Skeleton width={105} height={11} /></div>
        </div>
      ))}
    </section>
  )
}

function PanelHeadingSkeleton() {
  return (
    <div className="skeleton-panel-heading">
      <Skeleton shape="circle" width={34} height={34} />
      <span><Skeleton shape="title" width="55%" /><Skeleton width="78%" height={11} /></span>
    </div>
  )
}

function PlayerRowsSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="skeleton-player-rows">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-player-row" key={index}>
          <Skeleton width={28} height={28} radius={9} />
          <Skeleton shape="avatar" width={34} height={34} />
          <Skeleton width="100%" height={14} />
          <Skeleton width={58} height={13} />
          <Skeleton width={58} height={13} />
          <Skeleton width={58} height={13} />
          <Skeleton width={82} height={30} radius={9} />
        </div>
      ))}
    </div>
  )
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="loading-structure" aria-busy="true" aria-label="Carregando painel">
      <CommunityTotalsSkeleton />
      <div className="container dashboard-content">
        <div className="ranking-grid">
          {[0, 1].map((panel) => (
            <Card className="panel skeleton-dashboard-panel" key={panel}>
              <PanelHeadingSkeleton />
              {panel === 0 ? <PlayerRowsSkeleton count={5} /> : (
                <div className="skeleton-summary-rows">
                  {Array.from({ length: 3 }, (_, index) => <div key={index}><Skeleton shape="circle" width={25} height={25} /><Skeleton width="70%" height={13} /><Skeleton width={24} height={18} /></div>)}
                </div>
              )}
            </Card>
          ))}
        </div>
        <Card className="panel activity skeleton-activity-panel">
          <PanelHeadingSkeleton />
          {Array.from({ length: 5 }, (_, index) => <div className="skeleton-activity-row" key={index}><Skeleton shape="circle" width={28} height={28} /><Skeleton width="78%" height={12} /><Skeleton width={60} height={11} /></div>)}
        </Card>
      </div>
    </div>
  )
}

export function DirectoryLoadingSkeleton() {
  return (
    <div className="loading-structure" aria-busy="true" aria-label="Carregando jogadores">
      <CommunityTotalsSkeleton />
      <div className="container analytics-content">
        <div className="analytics-directory-grid">
          <Card className="analytics-filters skeleton-filters">
            <PanelHeadingSkeleton />
            <Skeleton shape="text" width="100%" height={38} />
            <Skeleton shape="text" width="100%" height={38} />
            <Skeleton width="100%" height={40} radius={10} />
          </Card>
          <Card className="analytics-results">
            <div className="analytics-results-heading"><PanelHeadingSkeleton /><Skeleton width={112} height={13} /></div>
            <div className="player-results-columns skeleton-table-heading">
              <Skeleton width={24} height={10} /><Skeleton width="80%" height={10} />
              <Skeleton width="70%" height={10} /><Skeleton width="70%" height={10} /><Skeleton width="70%" height={10} />
            </div>
            <PlayerRowsSkeleton count={10} />
            <div className="pagination"><Skeleton width={34} height={32} /><Skeleton width={110} height={12} /><Skeleton width={34} height={32} /></div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export function StatisticsLoadingSkeleton() {
  return (
    <div className="loading-structure" aria-busy="true" aria-label="Carregando estatísticas">
      <CommunityTotalsSkeleton />
      <div className="container analytics-content">
        <div className="statistics-grid">
          <Card className="statistics-panel">
            <PanelHeadingSkeleton />
            <div className="skeleton-chart-bars">
              {[82, 64, 92, 48, 72].map((width, index) => <div key={index}><Skeleton width={`${55 + index * 7}%`} height={12} /><Skeleton width={`${width}%`} height={14} radius={99} /></div>)}
            </div>
          </Card>
          <Card className="statistics-panel">
            <PanelHeadingSkeleton />
            <SkeletonText lines={6} />
          </Card>
        </div>
      </div>
    </div>
  )
}

export function ProfileSummarySkeleton() {
  return (
    <Card className="player-summary-card loading-structure" aria-label="Carregando resumo do jogador" aria-busy="true">
      <div className="profile-summary-heading">
        <div><Skeleton width={150} height={13} /><Skeleton width={260} height={11} /></div>
        <Skeleton shape="avatar" width={38} height={38} />
      </div>
      <div className="player-profile-metrics">
        {Array.from({ length: 11 }, (_, index) => (
          <div className="profile-stat skeleton-profile-stat" key={index}>
            <Skeleton shape="circle" width={34} height={34} />
            <Skeleton width="78%" height={11} />
            <Skeleton width={44} height={20} />
          </div>
        ))}
      </div>
      <SkeletonText lines={2} />
    </Card>
  )
}

export function ProfileSectionSkeleton({ kind }: { kind: 'chart' | 'categories' | 'table' | 'teammates' }) {
  if (kind === 'chart') {
    return <div className="profile-skeleton-chart loading-structure" aria-busy="true">
      {[35, 64, 48, 82, 56, 70, 42].map((height, index) => <div key={index}><Skeleton width={28} height={10} /><Skeleton width={34} height={`${height}%`} radius="5px 5px 1px 1px" /><Skeleton width={42} height={10} /></div>)}
    </div>
  }
  if (kind === 'categories') {
    return <div className="skeleton-category-list loading-structure" aria-busy="true">
      <Skeleton width={140} height={13} />
      {Array.from({ length: 4 }, (_, index) => <div key={index}><Skeleton width="45%" height={12} /><Skeleton width={`${92 - index * 17}%`} height={8} radius={99} /><Skeleton width="32%" height={9} /></div>)}
    </div>
  }
  if (kind === 'teammates') {
    return <div className="skeleton-teammates loading-structure" aria-busy="true">
      {Array.from({ length: 4 }, (_, index) => <div key={index}><Skeleton shape="avatar" width={30} height={30} /><Skeleton width="100%" height={12} /><Skeleton width={100} height={11} /><Skeleton width={76} height={28} radius={7} /></div>)}
      <div className="pagination"><Skeleton width={34} height={32} /><Skeleton width={95} height={12} /><Skeleton width={34} height={32} /></div>
    </div>
  }
  return <div className="skeleton-profile-table loading-structure" aria-busy="true">
    <div><Skeleton width="100%" height={30} /></div>
    {Array.from({ length: 5 }, (_, index) => <div key={index}><Skeleton width="95%" height={12} /><Skeleton width="62%" height={12} /><Skeleton width="70%" height={12} /><Skeleton width="55%" height={12} /></div>)}
    <div className="pagination"><Skeleton width={34} height={32} /><Skeleton width={95} height={12} /><Skeleton width={34} height={32} /></div>
  </div>
}
