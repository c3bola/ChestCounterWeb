import { useQuery } from '@tanstack/react-query'
import {
  getPlayerAnalyticsHistory,
  getPlayerAnalyticsSummary,
  getPlayerAnalyticsTeammates,
  getPlayerAnalyticsTreasures,
} from '../api/playerAnalytics'

export function usePlayerAnalyticsSummary(playerId: number) {
  return useQuery({
    queryKey: ['analytics', 'player', playerId, 'summary'],
    queryFn: () => getPlayerAnalyticsSummary(playerId),
    enabled: playerId > 0,
    staleTime: 60_000,
    retry: false,
  })
}

export function usePlayerAnalyticsHistory(playerId: number, page: number) {
  return useQuery({
    queryKey: ['analytics', 'player', playerId, 'history', page],
    queryFn: () => getPlayerAnalyticsHistory(playerId, page),
    enabled: playerId > 0,
    staleTime: 60_000,
    retry: false,
  })
}

export function usePlayerAnalyticsTeammates(playerId: number, page: number) {
  return useQuery({
    queryKey: ['analytics', 'player', playerId, 'teammates', page],
    queryFn: () => getPlayerAnalyticsTeammates(playerId, page),
    enabled: playerId > 0,
    staleTime: 60_000,
    retry: false,
  })
}

export function usePlayerAnalyticsTreasures(playerId: number, page: number) {
  return useQuery({
    queryKey: ['analytics', 'player', playerId, 'treasures', page],
    queryFn: () => getPlayerAnalyticsTreasures(playerId, page),
    enabled: playerId > 0,
    staleTime: 60_000,
    retry: false,
  })
}
