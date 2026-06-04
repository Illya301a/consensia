export const DEFAULT_LANGUAGE = 'en'

export const SUPPORTED_LANGUAGE_CODES = ['ru', 'ua', 'en', 'de', 'es']

export function normalizeLanguageCode(lng) {
  const base = String(lng || '').split('-')[0].toLowerCase()
  if (base === 'uk') return 'ua'
  if (SUPPORTED_LANGUAGE_CODES.includes(base)) return base
  return DEFAULT_LANGUAGE
}

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'ru', label: 'Русский' },
  { code: 'ua', label: 'Українська' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
]
