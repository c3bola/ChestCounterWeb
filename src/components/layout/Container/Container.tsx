import type { ComponentPropsWithoutRef, ReactNode } from 'react'

type Props = ComponentPropsWithoutRef<'div'> & { children: ReactNode }

export function Container({ children, className = '', ...props }: Props) {
  return <div className={`container ${className}`} {...props}>{children}</div>
}
