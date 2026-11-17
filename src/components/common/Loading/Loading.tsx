export function Loading({ label = 'Carregando...' }: { label?: string }) {
  return <p className="loading" role="status">{label}</p>
}
