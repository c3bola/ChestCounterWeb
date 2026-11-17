import { useState } from 'react'

type Props = {
  initials: string
  color: string
  src?: string
  alt?: string
}

export function Avatar({ initials, color, src, alt }: Props) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = src && !imageFailed

  return (
    <span className={`avatar ${color}`} role={alt ? 'img' : undefined} aria-label={alt} aria-hidden={alt ? undefined : true}>
      {showImage ? <img src={src} alt="" onError={() => setImageFailed(true)} /> : initials}
    </span>
  )
}
