import { EmptyState } from '../../common/EmptyState/EmptyState'
import { Container } from '../Container/Container'

export function PlaceholderPage({ title, description = 'Esta página está em preparação.' }: { title: string; description?: string }) {
  return (
    <div className="placeholder-page" style={{ backgroundImage: `linear-gradient(#f5dfbde8, #f5dfbde8)` }}>
      <Container>
        <EmptyState title={title} description={description} />
      </Container>
    </div>
  )
}
