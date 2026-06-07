import { useTranslation } from 'react-i18next'
import { useTheme } from '../services/ThemeContext.jsx'

export default function ThemeSwitcher({ className = '' }) {
  const { t } = useTranslation()
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      className={`theme-switcher ${className}`.trim()}
      onClick={toggleTheme}
      aria-label={t('a11y.toggleTheme')}
      aria-pressed={isDark ? 'true' : 'false'}
      title={isDark ? t('theme.light') : t('theme.dark')}
    >
      <span className="theme-switcher__icon" aria-hidden="true">
        {isDark ? (
          <svg viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
            <path
              d="M12 2.5v2.2M12 19.3v2.2M4.7 12H2.5M21.5 12h-2.2M6.1 6.1l-1.55-1.55M19.45 19.45l-1.55-1.55M17.9 6.1l1.55-1.55M6.1 17.9l-1.55 1.55"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M20 14.3A7.8 7.8 0 0 1 9.7 4a6.8 6.8 0 1 0 10.3 10.3Z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </span>
      <span className="theme-switcher__label">{isDark ? t('theme.light') : t('theme.dark')}</span>
    </button>
  )
}
