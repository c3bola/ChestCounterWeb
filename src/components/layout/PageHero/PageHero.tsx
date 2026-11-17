import { Container } from '../Container/Container'

type Props = {
  title: string
  description: string
  image: string
}

export function PageHero({ title, description, image }: Props) {
  return (
    <section className="page-hero" style={{ backgroundImage: `url("${image}")` }}>
      <Container className="page-hero-inner">
        <div className="page-hero-copy">
          <span className="eyebrow">FORTNITE BRASIL</span>
          <h1>{title}</h1>
          <span className="page-hero-ribbon">CAÇADORES DE BAÚS</span>
          <p>{description}</p>
        </div>
      </Container>
    </section>
  )
}
