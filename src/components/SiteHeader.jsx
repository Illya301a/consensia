import { Link, NavLink } from 'react-router-dom'

export default function SiteHeader() {
  return (
    <header className="site-header">
      <Link to="/" className="logo site-header__logo">
        Consensia
      </Link>
      <nav className="site-header__nav" aria-label="Основная навигация">
        <NavLink to="/about" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
          О нас
        </NavLink>
        <NavLink to="/models" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
          Модели
        </NavLink>
        <NavLink to="/developers" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
          Разработчики
        </NavLink>
      </nav>
    </header>
  )
}
