import { useState } from 'react'
import { TilesetIcon } from '../TilesetIcon/TilesetIcon'
import { usePlayerSkin } from '../../../services/queries/playerSkins'

type Props = {
  playerId: number
  alt: string
  color?: string
  size?: number
  className?: string
  preferredSkinId?: string | null
}

export function PlayerSkinAvatar({
  playerId,
  alt,
  color = 'coral',
  size = 34,
  className = '',
  preferredSkinId,
}: Props) {
  const skin = usePlayerSkin(playerId, preferredSkinId)
  const [failedSkinId, setFailedSkinId] = useState<string | null>(null)
  const image = skin.data && skin.data.id !== failedSkinId ? skin.data : null

  return (
    <span
      className={`avatar ${color} player-skin-avatar ${className}`}
      role="img"
      aria-label={alt}
      title={skin.error ? 'Não foi possível carregar o catálogo local de skins.' : image?.name ?? alt}
      style={{ width: size, height: size, flexBasis: size }}
    >
      {image ? (
        <img src={image.image} alt="" onError={() => setFailedSkinId(image.id)} />
      ) : (
        <TilesetIcon name="player" size={size * 0.72} />
      )}
    </span>
  )
}
