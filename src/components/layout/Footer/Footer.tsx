import { Gamepad2, Music2, Newspaper, SquarePlay, UsersRound } from 'lucide-react'
import { Link } from 'react-router-dom'
import { assets } from '../../../constants/assets'
import { Container } from '../Container/Container'

const currentYear = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="site-footer" id="comunidade">
      <div className="waves" aria-hidden="true">
        <img className="footer-clouds" src={assets.footerClouds} alt="" />
        <img className="footer-ocean" src={assets.footerOcean} alt="" />
        <img className="footer-boat" src={assets.footerBoat} alt="" />
      </div>
      <Container className="footer-inner">
        <div className="footer-intro">
          <img src={assets.logo} alt="Fortnite Brasil" className="footer-logo" />
          <div className="footer-intro-text">
            <h2>Contador de Baús</h2>
            <p>Estatísticas, rankings e conquistas<br />da comunidade Fortnite Brasil.</p>
          </div>
        </div>

        <div className="footer-column">
          <h2>Navegação</h2>
          <div className="footer-links">
            <Link to="/">Início</Link>
            <Link to="/ranking">Ranking</Link>
            <Link to="/estatisticas">Estatísticas</Link>
            <Link to="/jogadores">Jogadores</Link>
          </div>
        </div>

        <div className="footer-column">
          <h2>Comunidade</h2>
          {/* Links aplicados nas redes sociais */}
          <ul className="footer-social">
            <li>
              <a href="https://x.com/Embananeiro" target="_blank" rel="noopener noreferrer">
                <svg className="community-custom-icon" aria-hidden="true"><use href={`${import.meta.env.BASE_URL}icons.svg#x-icon`} /></svg>
                X
              </a>
            </li>
            <li>
              <a href="https://www.youtube.com/c3bola" target="_blank" rel="noopener noreferrer">
                <SquarePlay aria-hidden="true" />
                YouTube
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@c3bola" target="_blank" rel="noopener noreferrer">
                <Music2 aria-hidden="true" />
                TikTok
              </a>
            </li>
            <li>
              <a href="https://t.me/s/brasilfortnite" target="_blank" rel="noopener noreferrer">
                <Newspaper aria-hidden="true" />
                Notícias
              </a>
            </li>
            <li>
              <a href="https://t.me/s/fortnitebrasil" target="_blank" rel="noopener noreferrer">
                <UsersRound aria-hidden="true" />
                Grupo
              </a>
            </li>
            <li>
              <a href="https://discord.gg/9H3nA4m" target="_blank" rel="noopener noreferrer">
                <svg className="community-custom-icon" aria-hidden="true"><use href={`${import.meta.env.BASE_URL}icons.svg#discord-icon`} /></svg>
                Discord
              </a>
            </li>
          </ul>
        </div>

        <div className="footer-bottom">
          <span>© {currentYear} Fortnite Brasil no Telegram, este projeto não tem vinculo com a empresa Epic Games.</span>
          <span><Gamepad2 size={17} aria-hidden="true" /> Desenvolvido por fãs para fãs da comunidade Fortnite Brasil</span>
        </div>
      </Container>
    </footer>
  )
}