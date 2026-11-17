import { Route, Routes } from 'react-router-dom'
import { MainLayout } from '../../components/layout/MainLayout/MainLayout'
import { DashboardPage } from '../../features/dashboard/pages/DashboardPage'
import { RankingPage } from '../../features/rankings/pages/RankingPage'
import { StatisticsPage } from '../../features/statistics/pages/StatisticsPage'
import { PlayersPage } from '../../features/players/pages/PlayersPage'
import { PlayerDetailsPage } from '../../features/players/pages/PlayerDetailsPage'
import { TreasuresPage } from '../../features/treasures/pages/TreasuresPage'
import { PlaceholderPage } from '../../components/layout/PlaceholderPage/PlaceholderPage'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="ranking" element={<RankingPage />} />
        <Route path="estatisticas" element={<StatisticsPage />} />
        <Route path="jogadores" element={<PlayersPage />} />
        <Route path="jogadores/:id" element={<PlayerDetailsPage />} />
        <Route path="tesouros" element={<TreasuresPage />} />
        <Route path="*" element={<PlaceholderPage title="Página não encontrada" description="Esta página não existe." />} />
      </Route>
    </Routes>
  )
}
