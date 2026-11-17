import type { ComponentPropsWithoutRef } from 'react'

export function Badge({ className = '', ...props }: ComponentPropsWithoutRef<'span'>) {
  return <span className={className} {...props} />
}
