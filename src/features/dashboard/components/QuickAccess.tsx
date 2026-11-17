import { ArrowRight, BarChart3, Trophy, Users } from 'lucide-react'
import { Link } from 'react-router-dom'

const shortcuts = [
  { title: 'Ranking', description: 'Veja os maiores caçadores de baús.', href: '/ranking', Icon: Trophy, color: 'gold' },
  { title: 'Estatísticas', description: 'Dados globais, recordes e evolução dos jogadores.', href: '/estatisticas', Icon: BarChart3, color: 'blue' },
  { title: 'Jogadores', description: 'Conheça os jogadores, perfis e conquistas.', href: '/jogadores', Icon: Users, color: 'purple' },
]

export function QuickAccess() {
  return (
    <section className="shortcuts container" aria-label="Explore o dashboard">
      {shortcuts.map(({ title, description, href, Icon, color }) => (
        <Link className="shortcut card" to={href} key={title}>
          <Icon className={`shortcut-icon ${color}`} size={48} strokeWidth={2.4} aria-hidden="true" />
          <span><strong>{title}</strong><span>{description}</span></span>
          <ArrowRight className="shortcut-arrow" size={22} aria-hidden="true" />
        </Link>
      ))}
    </section>
  )
}
