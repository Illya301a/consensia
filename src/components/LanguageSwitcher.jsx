import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { SUPPORTED_LANGUAGES } from '../i18n/constants.js'

/**
 * Compact language selector; persists via i18next-browser-languagedetector.
 */
export default function LanguageSwitcher({ className = '' }) {
  const { t, i18n } = useTranslation()
  const [activeLng, setActiveLng] = useState(
    () => String(i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
  )
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    const sync = () => {
      setActiveLng(String(i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0])
    }
    i18n.on('languageChanged', sync)
    sync()
    return () => {
      i18n.off('languageChanged', sync)
    }
  }, [i18n])

  const value = SUPPORTED_LANGUAGES.some((l) => l.code === activeLng) ? activeLng : 'ru'
  const activeMeta = SUPPORTED_LANGUAGES.find((l) => l.code === value) || SUPPORTED_LANGUAGES[0]

  useEffect(() => {
    if (!open) return
    const onDown = (ev) => {
      const el = rootRef.current
      if (!el) return
      if (ev.target instanceof Node && !el.contains(ev.target)) setOpen(false)
    }
    const onKey = (ev) => {
      if (ev.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div className={`lang-switcher ${className}`.trim()} ref={rootRef}>
      <button
        type="button"
        className="lang-switcher__button"
        aria-label={t('a11y.chooseLanguage')}
        aria-haspopup="menu"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{t(activeMeta.labelKey)}</span>
        <span className={`lang-switcher__chevron${open ? ' lang-switcher__chevron--open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>
      {open ? (
        <div className="lang-switcher__menu" role="menu" aria-label={t('a11y.chooseLanguage')}>
          {SUPPORTED_LANGUAGES.map(({ code, labelKey }) => (
            <button
              key={code}
              type="button"
              role="menuitemradio"
              aria-checked={value === code ? 'true' : 'false'}
              className={`lang-switcher__item${value === code ? ' lang-switcher__item--active' : ''}`}
              onClick={() => {
                setActiveLng(code)
                setOpen(false)
                void i18n.changeLanguage(code)
              }}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
