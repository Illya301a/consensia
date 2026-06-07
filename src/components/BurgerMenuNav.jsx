import { NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const MENU_ITEMS = [
  { to: '/about', labelKey: 'nav.about' },
  { to: '/models', labelKey: 'nav.models' },
  { to: '/developers', labelKey: 'nav.developers' },
  { to: '/github-actions', labelKey: 'nav.githubActions' },
  { to: '/ai-agent', labelKey: 'nav.aiAgent' },
]

export default function BurgerMenuNav({ ariaLabel, onNavigate, className = 'top__menu-nav' }) {
  const { t } = useTranslation()

  return (
    <nav className={className} aria-label={ariaLabel}>
      {MENU_ITEMS.map(({ to, labelKey }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
          onClick={onNavigate}
        >
          {t(labelKey)}
        </NavLink>
      ))}
    </nav>
  )
}
