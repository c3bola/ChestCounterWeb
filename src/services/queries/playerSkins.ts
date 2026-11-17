import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { resolvePlayerSkin } from '../api/playerSkins'

const playerSkinQueryKey = (playerId: number, preferredSkinId?: string | null) =>
  ['player-skin', playerId, preferredSkinId ?? null] as const

export function usePlayerSkin(playerId: number, preferredSkinId?: string | null) {
  const queryClient = useQueryClient()
  const query = useQuery({
    queryKey: playerSkinQueryKey(playerId, preferredSkinId),
    queryFn: () => resolvePlayerSkin(playerId, preferredSkinId),
    enabled: playerId > 0,
    staleTime: 60_000,
    retry: false,
  })

  useEffect(() => {
    if (preferredSkinId && query.data) {
      queryClient.setQueryData(playerSkinQueryKey(playerId), query.data)
    }
  }, [playerId, preferredSkinId, query.data, queryClient])

  return query
}
