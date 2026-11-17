import { Link } from 'react-router-dom'
import { assets } from '../../../constants/assets'

export function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Contador de Baús - início">
      <img className="brand-logo" src={assets.logo} alt="" />
      <span className="brand-name">Contador de Baús</span>
    </Link>
  )
}
