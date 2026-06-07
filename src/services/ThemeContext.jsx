import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { flushSync } from 'react-dom'

export const THEME_STORAGE_KEY = 'consensia_theme_v1'
export const THEME_TRANSITION_MS = 400

const ThemeContext = createContext(null)
let transitionGeneration = 0

function normalizeTheme(value) {
  return value === 'dark' ? 'dark' : 'light'
}

function prefersReducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function nextFrame() {
  return new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })
}

function waitForOpacityTransition(element, maxMs) {
  return new Promise((resolve) => {
    let settled = false

    const finish = () => {
      if (settled) return
      settled = true
      element.removeEventListener('transitionend', onTransitionEnd)
      element.removeEventListener('transitioncancel', onTransitionEnd)
      window.clearTimeout(fallback)
      resolve()
    }

    const onTransitionEnd = (event) => {
      if (event.target === element && event.propertyName === 'opacity') {
        finish()
      }
    }

    element.addEventListener('transitionend', onTransitionEnd)
    element.addEventListener('transitioncancel', onTransitionEnd)
    const fallback = window.setTimeout(finish, maxMs + 100)
  })
}

export function readStoredTheme() {
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY)
    if (raw === 'dark' || raw === 'light') return raw
  } catch {
    /* ignore storage errors */
  }
  return 'light'
}

export function syncDocumentTheme(theme) {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute('data-theme', normalizeTheme(theme))
}

function setThemeSwitching(active) {
  if (typeof document === 'undefined') return
  document.documentElement.classList.toggle('theme-switching', active)
}

function clearThemeVeil() {
  if (typeof document === 'undefined') return
  const veil = document.getElementById('theme-veil')
  veil?.classList.remove('is-active', 'is-dimmed')
  setThemeSwitching(false)
}

function applyThemeUpdate(setThemeState, next) {
  flushSync(() => {
    setThemeState((current) => {
      const resolved = normalizeTheme(
        typeof next === 'function' ? next(current) : next,
      )
      syncDocumentTheme(resolved)
      try {
        localStorage.setItem(THEME_STORAGE_KEY, resolved)
      } catch {
        /* ignore storage errors */
      }
      return resolved
    })
  })
}

function runViewTransition(applyTheme) {
  const transition = document.startViewTransition(() => {
    applyTheme()
  })

  setThemeSwitching(true)
  transition.finished
    .catch(() => {})
    .finally(() => {
      setThemeSwitching(false)
    })
}

async function runDimScrimTransition(applyTheme) {
  const veil = document.getElementById('theme-veil')
  if (!veil) {
    applyTheme()
    return
  }

  const generation = ++transitionGeneration
  const dimMs = 240
  const revealMs = THEME_TRANSITION_MS

  clearThemeVeil()
  setThemeSwitching(true)
  veil.classList.add('is-active')
  await nextFrame()
  await nextFrame()

  if (generation !== transitionGeneration) return

  veil.classList.add('is-dimmed')
  await waitForOpacityTransition(veil, dimMs)

  if (generation !== transitionGeneration) return

  applyTheme()
  await nextFrame()

  if (generation !== transitionGeneration) return

  veil.classList.remove('is-dimmed')
  await waitForOpacityTransition(veil, revealMs)

  if (generation !== transitionGeneration) return

  veil.classList.remove('is-active')
  setThemeSwitching(false)
}

function runThemeTransition(setThemeState, next) {
  const applyTheme = () => applyThemeUpdate(setThemeState, next)

  if (typeof document === 'undefined' || prefersReducedMotion()) {
    applyTheme()
    return
  }

  if (typeof document.startViewTransition === 'function') {
    runViewTransition(applyTheme)
    return
  }

  void runDimScrimTransition(applyTheme)
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => readStoredTheme())

  useEffect(() => {
    syncDocumentTheme(theme)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme)
    } catch {
      /* ignore storage errors */
    }
  }, [theme])

  useEffect(() => {
    if (typeof document === 'undefined') return undefined

    let veil = document.getElementById('theme-veil')
    if (!veil) {
      veil = document.createElement('div')
      veil.id = 'theme-veil'
      veil.setAttribute('aria-hidden', 'true')
      document.body.appendChild(veil)
    }

    return () => {
      transitionGeneration += 1
      clearThemeVeil()
      veil?.remove()
    }
  }, [])

  const setTheme = useCallback((next) => {
    runThemeTransition(setThemeState, next)
  }, [])

  const toggleTheme = useCallback(() => {
    runThemeTransition(setThemeState, (current) =>
      current === 'dark' ? 'light' : 'dark',
    )
  }, [])

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === 'dark',
      setTheme,
      toggleTheme,
    }),
    [theme, setTheme, toggleTheme],
  )

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
