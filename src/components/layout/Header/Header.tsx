import { BarChart3, Home, Menu, Search, Trophy, Users, X } from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Button } from '../../common/Button/Button'
import { Brand } from '../Brand/Brand'
import { Container } from '../Container/Container'

const links = [
  { label: 'Início', href: '/', Icon: Home },
  { label: 'Ranking', href: '/ranking', Icon: Trophy },
  { label: 'Estatísticas', href: '/estatisticas', Icon: BarChart3 },
  { label: 'Jogadores', href: '/jogadores', Icon: Users },
]

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="site-header">
      <Container className="header-inner">
        <Brand />
        <Button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </Button>
        <nav id="main-nav" className={`main-nav ${menuOpen ? 'is-open' : ''}`} aria-label="Navegação principal">
          {links.map(({ label, href, Icon }) => (
            <NavLink key={href} to={href} end={href === '/'} className={({ isActive }) => isActive ? 'active' : ''} onClick={() => setMenuOpen(false)}>
              <Icon size={19} aria-hidden="true" /> {label}
            </NavLink>
          ))}
          <Link className="nav-search" to="/jogadores#buscar" aria-label="Buscar jogadores" onClick={() => setMenuOpen(false)}>
            <Search size={19} aria-hidden="true" />
          </Link>
          <a className="community-link" href="#comunidade" onClick={() => setMenuOpen(false)}>
            <Users size={18} aria-hidden="true" /> Comunidade FNBR
          </a>
        </nav>
      </Container>
    </header>
  )
}
