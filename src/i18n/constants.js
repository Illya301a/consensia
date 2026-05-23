export const DEFAULT_LANGUAGE = 'en'

export const SUPPORTED_LANGUAGE_CODES = ['ru', 'ua', 'en', 'de']

export function normalizeLanguageCode(lng) {
  const base = String(lng || '').split('-')[0].toLowerCase()
  if (base === 'uk') return 'ua'
  if (SUPPORTED_LANGUAGE_CODES.includes(base)) return base
  return DEFAULT_LANGUAGE
}

export const SUPPORTED_LANGUAGES = [
  { code: 'ru', label: 'Русский' },
  { code: 'ua', label: 'Українська' },
  { code: 'en', label: 'English' },
  { code: 'de', label: 'Deutsch' },
]
