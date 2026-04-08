import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import en from './locales/en.json'
import ru from './locales/ru.json'
import uk from './locales/uk.json'
import { DEFAULT_LANGUAGE } from './constants.js'

const resources = {
  ru: { translation: ru },
  uk: { translation: uk },
  en: { translation: en },
}

function syncDocumentLang(lng) {
  if (typeof document === 'undefined') return
  const base = String(lng || '').split('-')[0]
  const map = { ru: 'ru', uk: 'uk', en: 'en' }
  document.documentElement.lang = map[base] ?? 'ru'
}

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: DEFAULT_LANGUAGE,
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['ru', 'uk', 'en'],
    load: 'languageOnly',
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed',
    },
    detection: {
      order: ['localStorage'],
      caches: ['localStorage'],
      lookupLocalStorage: 'i18nextLng',
    },
  })
  .then(() => {
    syncDocumentLang(i18n.resolvedLanguage || i18n.language)
  })

i18n.on('languageChanged', syncDocumentLang)

export default i18n
