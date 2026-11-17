import { assets } from '../../../constants/assets'
import { tilesetIcons, type TilesetIconName } from './tilesetIcons'

type Props = {
  name: TilesetIconName
  size?: number
  className?: string
  alt?: string
}

export function TilesetIcon({ name, size = 32, className = '', alt }: Props) {
  const crop = tilesetIcons[name]
  const width = 1774
  const height = 887
  const displayWidth = size
  const displayHeight = size * 3 / 4
  const scale = Math.min(displayWidth / crop.width, displayHeight / crop.height) * crop.scale

  return (
    <span
      className={`tileset-icon ${className}`}
      role={alt ? 'img' : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      style={{ width: displayWidth, height: displayHeight }}
    >
      <img
        src={assets.iconsTileset}
        alt=""
        aria-hidden="true"
        draggable={false}
        style={{
          width: width * scale,
          height: height * scale,
          left: (displayWidth - crop.width * scale) / 2 + crop.offsetX - crop.x * scale,
          top: (displayHeight - crop.height * scale) / 2 + crop.offsetY - crop.y * scale,
        }}
      />
    </span>
  )
}
