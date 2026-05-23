import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ru from './locales/ru.json'
import ua from './locales/ua.json'
import de from './locales/de.json'
import {
  DEFAULT_LANGUAGE,
  normalizeLanguageCode,
  SUPPORTED_LANGUAGE_CODES,
} from './constants.js'

const resources = {
  ru: { translation: ru },
  ua: { translation: ua },
  en: { translation: en },
  de: { translation: de },
}

function syncDocumentLang(lng) {
  if (typeof document === 'undefined') return
  const code = normalizeLanguageCode(lng)
  document.documentElement.lang = code === 'ua' ? 'uk' : code
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: {
      uk: ['ua'],
      default: [DEFAULT_LANGUAGE],
    },
    supportedLngs: SUPPORTED_LANGUAGE_CODES,
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
      convertDetectedLanguage: normalizeLanguageCode,
    },
  })
  .then(() => {
    const resolved = normalizeLanguageCode(
      i18n.resolvedLanguage || i18n.language,
    )
    if (resolved !== (i18n.resolvedLanguage || i18n.language)) {
      return i18n.changeLanguage(resolved)
    }
  })
  .then(() => {
    syncDocumentLang(i18n.resolvedLanguage || i18n.language)
  })

i18n.on('languageChanged', syncDocumentLang)

export default i18n
