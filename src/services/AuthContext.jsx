import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { API_BASE_URL } from './api.js'
import { ACCESS_TOKEN_KEY, POST_LOGIN_REDIRECT_KEY } from './constants.js'
import { fetchCurrentUser } from './userApi.js'

const AuthContext = createContext(null)
const AUTH_TOKEN_PARAM_NAMES = ['token', 'access_token', 'id_token', 'jwt']

function readStoredToken() {
  try {
    const fromLs = localStorage.getItem(ACCESS_TOKEN_KEY)
    if (fromLs) return fromLs
    const legacy = sessionStorage.getItem('consensia_access_token')
    if (legacy) {
      localStorage.setItem(ACCESS_TOKEN_KEY, legacy)
      sessionStorage.removeItem('consensia_access_token')
      return legacy
    }
    return null
  } catch {
    return null
  }
}

function writeToken(token) {
  try {
    if (token) localStorage.setItem(ACCESS_TOKEN_KEY, token)
    else localStorage.removeItem(ACCESS_TOKEN_KEY)
  } catch {
    /* ignore storage errors */
  }
}

export function AuthProvider({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [token, setTokenState] = useState(() => readStoredToken())
  const [authChecked, setAuthChecked] = useState(() => !readStoredToken())
  const [user, setUser] = useState(null)

  useEffect(() => {
    const sync = () => setTokenState(readStoredToken())
    window.addEventListener('access-token-updated', sync)
    return () => window.removeEventListener('access-token-updated', sync)
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    let urlToken = ''
    for (const key of AUTH_TOKEN_PARAM_NAMES) {
      const value = params.get(key)
      if (!urlToken && value) urlToken = value
      params.delete(key)
    }

    let nextHash = location.hash || ''
    if (nextHash) {
      const hashParams = new URLSearchParams(nextHash.replace(/^#/, ''))
      for (const key of AUTH_TOKEN_PARAM_NAMES) {
        const value = hashParams.get(key)
        if (!urlToken && value) urlToken = value
        hashParams.delete(key)
      }
      const cleanedHash = hashParams.toString()
      nextHash = cleanedHash ? `#${cleanedHash}` : ''
    }

    if (!urlToken) return

    try {
      localStorage.setItem(ACCESS_TOKEN_KEY, urlToken)
      setTokenState(urlToken)
      sessionStorage.removeItem(POST_LOGIN_REDIRECT_KEY)
    } catch {
      /* ignore storage errors */
    }
    const qs = params.toString()
    navigate(
      {
        pathname: location.pathname,
        search: qs ? `?${qs}` : '',
        hash: nextHash,
      },
      { replace: true }
    )
  }, [location.pathname, location.search, location.hash, navigate])

  const setToken = useCallback((next) => {
    writeToken(next)
    setTokenState(next || null)
    if (!next) setUser(null)
  }, [])

  const loginWithGoogle = useCallback(() => {
    const currentHost = window.location.origin
    const currentUrl = new URL(window.location.href)
    for (const key of AUTH_TOKEN_PARAM_NAMES) {
      currentUrl.searchParams.delete(key)
    }
    const targetPath = `${currentUrl.pathname}${currentUrl.search}${currentUrl.hash}`
    const targetPage = `${currentHost}${targetPath}`
    try {
      sessionStorage.setItem(POST_LOGIN_REDIRECT_KEY, targetPath || '/app')
    } catch {
      /* ignore storage errors */
    }
    const loginUrl = `${API_BASE_URL}/auth/google/login?front_url=${encodeURIComponent(targetPage)}`
    window.location.href = loginUrl
  }, [])

  const logout = useCallback(() => {
    writeToken(null)
    setTokenState(null)
    setUser(null)
  }, [])

  const refreshUser = useCallback(async () => {
    if (!token) {
      setUser(null)
      return { ok: false, status: 401 }
    }
    try {
      const result = await fetchCurrentUser()
      if (result.ok === false && result.status === 401) {
        writeToken(null)
        setTokenState(null)
        setUser(null)
        return result
      }
      if (result.ok && result.user) {
        setUser(result.user)
        return result
      }
      setUser(null)
      return result
    } catch {
      setUser(null)
      return { ok: false, status: 0 }
    }
  }, [token])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setAuthChecked(true)
      return
    }
    setAuthChecked(false)
    let cancelled = false
    ;(async () => {
      try {
        const result = await fetchCurrentUser()
        if (cancelled) return
        if (result.ok === false && result.status === 401) {
          writeToken(null)
          setTokenState(null)
          setUser(null)
        } else if (result.ok && result.user) {
          setUser(result.user)
        } else {
          setUser(null)
        }
      } catch {
        if (!cancelled) setUser(null)
      } finally {
        if (!cancelled) setAuthChecked(true)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      authChecked,
      setToken,
      loginWithGoogle,
      logout,
      refreshUser,
    }),
    [token, user, authChecked, setToken, loginWithGoogle, logout, refreshUser]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook lives next to provider so auth stays one module; fast-refresh caveat is acceptable.
// eslint-disable-next-line react-refresh/only-export-components -- useAuth is the public API
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
