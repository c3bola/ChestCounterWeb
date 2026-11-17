import type { ReactNode } from 'react'
import { Loading } from '../Loading/Loading'

type Props = {
  isLoading: boolean
  error?: Error | null
  isEmpty: boolean
  onRetry: () => void
  emptyMessage: string
  children: ReactNode
}

export function QueryState({
  isLoading,
  error,
  isEmpty,
  onRetry,
  emptyMessage,
  children,
}: Props) {
  if (isLoading) {
    return <Loading label="Carregando dados..." />
  }

  if (error) {
    return (
      <div className="query-state" role="alert">
        <p>Não foi possível carregar os dados. {error.message}</p>
        <button type="button" onClick={onRetry}>Tentar novamente</button>
      </div>
    )
  }

  if (isEmpty) {
    return <p className="query-state" role="status">{emptyMessage}</p>
  }

  return children
}
