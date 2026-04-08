import { useEffect, useState } from 'react'
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

  return (
    <select
      className={className}
      aria-label={t('a11y.chooseLanguage')}
      value={value}
      onChange={(e) => {
        const code = e.target.value
        setActiveLng(code)
        void i18n.changeLanguage(code)
      }}
    >
      {SUPPORTED_LANGUAGES.map(({ code, labelKey }) => (
        <option key={code} value={code}>
          {t(labelKey)}
        </option>
      ))}
    </select>
  )
}
