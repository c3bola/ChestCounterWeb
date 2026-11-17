import { BarChart3, Search, SlidersHorizontal } from 'lucide-react'

export type PlayerSortOption = {
  value: string
  label: string
}

type Props = {
  query: string
  sort: string
  queryLabel: string
  queryPlaceholder: string
  sortLabel: string
  sortOptions: PlayerSortOption[]
  onQueryChange: (value: string) => void
  onSortChange: (value: string) => void
  onApply: () => void
}

export function PlayerFilters({
  query,
  sort,
  queryLabel,
  queryPlaceholder,
  sortLabel,
  sortOptions,
  onQueryChange,
  onSortChange,
  onApply,
}: Props) {
  return (
    <aside className="analytics-filters card" aria-label="Filtros">
      <h2><SlidersHorizontal aria-hidden="true" /> Filtros</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        onApply()
      }}>
        <label className="filter-field">
          <span>{queryLabel}</span>
          <span className="filter-input-wrap">
            <Search size={18} aria-hidden="true" />
            <input
              id="buscar"
              type="search"
              value={query}
              maxLength={200}
              placeholder={queryPlaceholder}
              onChange={(event) => onQueryChange(event.target.value)}
            />
          </span>
        </label>
        <label className="filter-field">
          <span>{sortLabel}</span>
          <span className="filter-select-wrap">
            <BarChart3 size={18} aria-hidden="true" />
            <select value={sort} onChange={(event) => onSortChange(event.target.value)}>
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </span>
        </label>
        <button className="primary-button filter-apply" type="submit">
          <SlidersHorizontal size={17} aria-hidden="true" /> Aplicar filtros
        </button>
      </form>
    </aside>
  )
}
