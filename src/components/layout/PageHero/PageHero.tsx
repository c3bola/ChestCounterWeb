import { Container } from '../Container/Container'
import { Skeleton } from '../../common/Skeleton/Skeleton'

type Props = {
  title: string
  description: string
  image: string
  loadingTitle?: boolean
}

export function PageHero({ title, description, image, loadingTitle = false }: Props) {
  return (
    <section className="page-hero" style={{ backgroundImage: `url("${image}")` }}>
      <Container className="page-hero-inner">
        <div className="page-hero-copy">
          <span className="eyebrow">FORTNITE BRASIL</span>
          <h1 aria-busy={loadingTitle || undefined}>
            {loadingTitle ? (
              <>
                <span className="sr-only">Carregando nome do jogador</span>
                <Skeleton shape="title" width="min(320px, 78vw)" height={54} />
              </>
            ) : title}
          </h1>
          <span className="page-hero-ribbon">CAÇADORES DE BAÚS</span>
          <p>{description}</p>
        </div>
      </Container>
    </section>
  )
}
