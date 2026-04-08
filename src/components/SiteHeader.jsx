import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'

export default function SiteHeader() {
  const { t } = useTranslation()
  return (
    <header className="site-header">
      <Link to="/" className="logo site-header__logo">
        {t('common.brand')}
      </Link>
      <div className="site-header__row">
        <nav className="site-header__nav" aria-label={t('a11y.mainNav')}>
          <NavLink to="/about" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
            {t('nav.about')}
          </NavLink>
          <NavLink to="/models" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
            {t('nav.models')}
          </NavLink>
          <NavLink to="/developers" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
            {t('nav.developers')}
          </NavLink>
        <LanguageSwitcher className="site-header__lang" />
        </nav>
      </div>
    </header>
  )
}
