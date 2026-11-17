import { ArrowRight, Skull, Trophy } from 'lucide-react'
import { Container } from '../../../components/layout/Container/Container'
import { assets } from '../../../constants/assets'

export function HeroSection() {
  return (
    <section className="hero" id="inicio" aria-labelledby="hero-title" style={{ backgroundImage: `url("${assets.headerHome}")` }}>
      <Container className="hero-inner">
        <div className="hero-copy">
          <span className="eyebrow">FORTNITE</span>
          <h1 id="hero-title">
            <span className="hero-japanese">トレジャー <Skull aria-hidden="true" /></span>
            <span className="hero-title-main">CAÇADORES DE TESOURO</span>
            <span className="hero-japanese">ハンターズ</span>
          </h1>
          <div className="hero-ribbon">TEMPORADA ONE PIECE</div>
          <p>Estatísticas, rankings e conquistas da comunidade Fortnite Brasil.</p>
          <a className="primary-button" href="#ranking"><Trophy size={21} /> Ver Ranking <ArrowRight size={21} /></a>
        </div>
      </Container>
    </section>
  )
}
