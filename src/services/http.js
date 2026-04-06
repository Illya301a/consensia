import { API_BASE_URL } from './api.js'
import { ACCESS_TOKEN_KEY } from './constants.js'

function buildUrl(path) {
  if (path.startsWith('http')) return path
  const p = path.startsWith('/') ? path : `/${path}`
  return `${API_BASE_URL}${p}`
}

async function parseRefreshResponse(r) {
  const text = await r.text()
  if (!text) return {}
  try {
    return JSON.parse(text)
  } catch {
    return {}
  }
}

async function refreshAccessToken() {
  const r = await fetch(buildUrl('/api/auth/refresh'), {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
  })
  if (!r.ok) throw new Error('refresh failed')
  const data = await parseRefreshResponse(r)
  const newToken = data.access_token
  if (!newToken) throw new Error('no access_token in refresh response')
  try {
    localStorage.setItem(ACCESS_TOKEN_KEY, newToken)
  } catch {
    throw new Error('cannot store token')
  }
  window.dispatchEvent(new Event('access-token-updated'))
  return newToken
}

export async function apiFetch(path, init = {}) {
  const url = buildUrl(path)
  const isRefresh = url.includes('/auth/refresh')
  const isRetry = Boolean(init._retry)

  const headers = new Headers(init.headers || {})
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(url, {
    ...init,
    credentials: 'include',
    headers,
  })

  if (res.status === 401 && !isRetry && !isRefresh) {
    try {
      await refreshAccessToken()
      return apiFetch(path, { ...init, _retry: true })
    } catch {
      try {
        localStorage.removeItem(ACCESS_TOKEN_KEY)
      } catch {
        /* ignore */
      }
      window.dispatchEvent(new Event('access-token-updated'))
    }
  }

  return res
}
