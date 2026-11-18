import type { ReactNode } from 'react'
import { Loading } from '../Loading/Loading'
import { EmptyState } from '../EmptyState/EmptyState'

type Props = {
  isLoading: boolean
  error?: Error | null
  isEmpty: boolean
  onRetry: () => void
  emptyMessage: string
  loadingFallback?: ReactNode
  children: ReactNode
}

export function QueryState({
  isLoading,
  error,
  isEmpty,
  onRetry,
  emptyMessage,
  loadingFallback,
  children,
}: Props) {
  if (isLoading) {
    return loadingFallback ?? <Loading label="Carregando dados..." />
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
    return <EmptyState title="Sem dados para exibir" description={emptyMessage} />
  }

  return children
}
