import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ACCESS_TOKEN_KEY } from '../services/constants.js'

function extractToken() {
  const search = new URLSearchParams(window.location.search)
  const err = search.get('error') || search.get('error_description')
  if (err) return { error: err }

  const fromQuery =
    search.get('token') ||
    search.get('access_token') ||
    search.get('id_token') ||
    search.get('jwt')

  if (fromQuery) return { token: fromQuery }

  const hash = window.location.hash?.replace(/^#/, '')
  if (hash) {
    const hp = new URLSearchParams(hash)
    const t =
      hp.get('access_token') || hp.get('token') || hp.get('id_token')
    if (t) return { token: t }
  }

  return {}
}

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const lang = String(i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
  const loadingLabel =
    lang === 'uk' ? 'Вхід…' : lang === 'en' ? 'Signing in…' : 'Вход…'

  useEffect(() => {
    const { token, error } = extractToken()
    if (token) {
      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
      } catch {
        /* ignore storage errors */
      }
      window.location.replace('/app')
      return
    }
    const q = error ? `?error=${encodeURIComponent(error)}` : '?error=auth'
    navigate(`/app${q}`, { replace: true })
  }, [navigate])

  return (
    <div className="app-suspense-fallback" role="status">
      {loadingLabel}
    </div>
  )
}
