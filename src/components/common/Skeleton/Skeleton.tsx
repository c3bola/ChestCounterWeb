import type { CSSProperties } from 'react'

type SkeletonProps = {
  className?: string
  width?: CSSProperties['width']
  height?: CSSProperties['height']
  radius?: CSSProperties['borderRadius']
  shape?: 'rectangle' | 'circle' | 'avatar' | 'text' | 'title' | 'card'
  animated?: boolean
}

export function Skeleton({
  className = '',
  width,
  height,
  radius,
  shape = 'rectangle',
  animated = true,
}: SkeletonProps) {
  const style = {
    width,
    height,
    borderRadius: radius,
  } satisfies CSSProperties

  return (
    <span
      className={`skeleton skeleton-${shape} ${animated ? 'skeleton-animated' : ''} ${className}`}
      style={style}
      aria-hidden="true"
    />
  )
}

export function SkeletonText({
  lines = 3,
  className = '',
}: {
  lines?: number
  className?: string
}) {
  return (
    <span className={`skeleton-text-group ${className}`} aria-hidden="true">
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton
          key={index}
          shape="text"
          width={index === lines - 1 && lines > 1 ? '62%' : index === 0 ? '92%' : '100%'}
        />
      ))}
    </span>
  )
}
