import type { MouseEvent, ReactNode } from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { resolvePlayerSkin } from '../../../services/api/playerSkins'
import { usePlayerSkin } from '../../../services/queries/playerSkins'

type Props = {
  playerId: number
  className?: string
  ariaLabel?: string
  state?: Record<string, unknown>
  children: ReactNode
}

function profilePath(playerId: number, skinId?: string): string {
  if (!skinId) return `/jogadores/${playerId}`
  return `/jogadores/${playerId}?${new URLSearchParams({ skin: skinId }).toString()}`
}

export function PlayerProfileLink({ playerId, className, ariaLabel, state, children }: Props) {
  const skin = usePlayerSkin(playerId)
  const navigate = useNavigate()
  const [skinLoadFailed, setSkinLoadFailed] = useState(false)

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (
      skin.data ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) return

    event.preventDefault()
    setSkinLoadFailed(false)
    void resolvePlayerSkin(playerId)
      .then((selected) => {
        navigate(profilePath(playerId, selected.id), { state })
      })
      .catch(() => setSkinLoadFailed(true))
  }

  return (
    <Link
      className={className}
      to={profilePath(playerId, skin.data?.id)}
      aria-label={ariaLabel}
      state={state}
      onClick={handleClick}
    >
      {children}
      {skinLoadFailed && <span className="sr-only" role="alert">Não foi possível carregar a skin deste jogador.</span>}
    </Link>
  )
}
