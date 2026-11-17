import { useQuery } from '@tanstack/react-query'
import { getAnalyticsHome } from '../api/analytics'

const homeActivityLimit = 5

export function useDashboardQueries() {
  const home = useQuery({
    queryKey: ['analytics', 'screen', 'home', homeActivityLimit],
    queryFn: () => getAnalyticsHome(homeActivityLimit),
    staleTime: 60_000,
    refetchInterval: 60_000,
    retry: false,
  })

  return { home }
}
