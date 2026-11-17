import { useQuery } from '@tanstack/react-query'
import {
  getAnalyticsScreenPlayers,
  getAnalyticsScreenStatistics,
  type AnalyticsPlayerSort,
} from '../api/analytics'

const pageSize = 10

export function useAnalyticsScreenStatistics() {
  return useQuery({
    queryKey: ['analytics', 'screen', 'statistics'],
    queryFn: getAnalyticsScreenStatistics,
    staleTime: 60_000,
    retry: false,
  })
}

export function useAnalyticsScreenPlayers(options: {
  screen: 'players' | 'ranking'
  search: string
  sort: AnalyticsPlayerSort
  page: number
}) {
  const search = options.search.trim()
  const apiScreen = options.screen === 'players' && search ? 'search' : options.screen

  return useQuery({
    queryKey: ['analytics', 'screen', options.screen, search, options.sort, options.page, pageSize],
    queryFn: () => getAnalyticsScreenPlayers({
      screen: apiScreen,
      search,
      sort: options.sort,
      page: options.page,
      pageSize,
    }),
    staleTime: 60_000,
    retry: false,
  })
}

export { pageSize as analyticsScreenPageSize }
