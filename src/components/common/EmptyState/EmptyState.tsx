import { Card } from '../Card/Card'

export function EmptyState({ title, description }: { title: string; description: string }) {
  return <Card className="empty-state"><h1>{title}</h1><p>{description}</p></Card>
}
