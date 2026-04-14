import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ACCESS_TOKEN_KEY, POST_LOGIN_REDIRECT_KEY } from '../services/constants.js'
import SiteHeader from '../components/SiteHeader.jsx'

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

function resolvePostLoginTarget() {
  const fallback = '/app'
  try {
    const fromSession = sessionStorage.getItem(POST_LOGIN_REDIRECT_KEY)
    sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
    if (!fromSession) return fallback
    if (fromSession.startsWith('/')) return fromSession
    const parsed = new URL(fromSession)
    if (parsed.origin === window.location.origin) {
      return `${parsed.pathname}${parsed.search}${parsed.hash}` || fallback
    }
    return fallback
  } catch {
    return fallback
  }
}

export default function AuthCallbackPage() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const loadingLabel = t('authCallback.loading')

  useEffect(() => {
    const { token, error } = extractToken()
    const target = resolvePostLoginTarget()
    if (token) {
      try {
        localStorage.setItem(ACCESS_TOKEN_KEY, token)
      } catch {
        /* ignore storage errors */
      }
      window.location.replace(target)
      return
    }
    const q = error ? `?error=${encodeURIComponent(error)}` : '?error=auth'
    navigate(`/app${q}`, { replace: true })
  }, [navigate])

  return (
    <div className="app legal-page">
      <SiteHeader />
      <div className="app-suspense-fallback" role="status">
        {loadingLabel}
      </div>
    </div>
  )
}
