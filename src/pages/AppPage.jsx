import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../App.scss'
import './AppPage.scss'
import { ChatMessageItem } from '../components/ChatMessageItem.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { useOrchestratorWs } from '../services/useOrchestratorWs.js'

const MODES = [
  { value: 'ECONOMY', label: 'Экономия' },
  { value: 'BALANCED', label: 'Баланс' },
  { value: 'MAX_POWER', label: 'Максимум' },
]

function statusLabel(status) {
  switch (status) {
    case 'connecting':
      return 'Подключение…'
    case 'open':
      return 'Готово'
    case 'closed':
      return 'Отключено'
    default:
      return null
  }
}

export default function AppPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionFromUrl = searchParams.get('session') || ''
  const { token, isAuthenticated, authChecked, loginWithGoogle, logout } = useAuth()

  const {
    status,
    messages,
    inputLocked,
    lastError,
    connect,
    disconnect,
    sendFollowUp,
  } = useOrchestratorWs({
    onSessionId: (sid) => {
      navigate(`/app?session=${encodeURIComponent(sid)}`, { replace: true })
    },
  })

  const [code, setCode] = useState('const example = () => {\n  return 1;\n};')
  const [context, setContext] = useState('')
  const [rounds, setRounds] = useState(3)
  const [mode, setMode] = useState('BALANCED')
  const [draft, setDraft] = useState('')
  const [showSetup, setShowSetup] = useState(true)
  const [authGateError, setAuthGateError] = useState('')

  const endRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const err = searchParams.get('error')
    if (!err) return
    try {
      const decoded = decodeURIComponent(err)
      setAuthGateError(
        decoded === 'auth' ? 'Не удалось войти. Попробуйте ещё раз.' : decoded
      )
    } catch {
      setAuthGateError('Не удалось войти')
    }
    navigate('/app', { replace: true })
  }, [searchParams, navigate])

  useEffect(() => {
    if (!isAuthenticated) disconnect()
  }, [isAuthenticated, disconnect])

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!inputLocked && status === 'open') {
      inputRef.current?.focus()
    }
  }, [inputLocked, status])

  const handleStart = useCallback(
    (e) => {
      e.preventDefault()
      if (!token) return
      connect({
        token,
        sessionId: sessionFromUrl || null,
        mode,
        code,
        context,
        rounds,
      })
      setShowSetup(false)
    },
    [connect, token, sessionFromUrl, mode, code, context, rounds]
  )

  const handleNewSession = useCallback(() => {
    disconnect()
    navigate('/app', { replace: true })
    setShowSetup(true)
  }, [disconnect, navigate])

  const handleLogout = useCallback(() => {
    disconnect()
    logout()
    navigate('/', { replace: true })
  }, [disconnect, logout, navigate])

  const handleSend = useCallback(
    (e) => {
      e.preventDefault()
      const text = draft.trim()
      if (!text) return
      sendFollowUp(text)
      setDraft('')
    },
    [draft, sendFollowUp]
  )

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }

  const busy = status === 'connecting'
  const statusText = statusLabel(status)

  if (!authChecked) {
    return (
      <div className="chat-app">
        <div className="chat-app__shell chat-app__shell--loading">
          <p className="chat-app__loading-text">Загрузка…</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="chat-app">
        <div className="chat-app__shell chat-app__shell--auth">
          <header className="chat-app__header">
            <div className="chat-app__brand">
              <Link to="/" className="chat-app__logo">
                Consensia
              </Link>
            </div>
            <Link to="/" className="chat-app__link">
              На главную
            </Link>
          </header>
          <section className="chat-app__auth">
            <h1 className="chat-app__auth-title">Вход в Consensia</h1>
            <p className="chat-app__auth-lede">
              Чтобы пользоваться анализом, войдите через Google — так мы связываем сессии с вашим
              аккаунтом.
            </p>
            {authGateError ? (
              <p className="chat-app__auth-error" role="alert">
                {authGateError}
              </p>
            ) : null}
            <button type="button" className="chat-app__google" onClick={loginWithGoogle}>
              <svg
                className="chat-app__google-svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Продолжить с Google
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-app">
      <div className="chat-app__shell">
        <header className="chat-app__header">
          <div className="chat-app__brand">
            <Link to="/" className="chat-app__logo">
              Consensia
            </Link>
            <span className="chat-app__badge">Анализ</span>
          </div>
          <div className="chat-app__header-actions">
            {statusText ? <span className="chat-app__meta">{statusText}</span> : null}
            <button type="button" className="chat-app__btn" onClick={handleNewSession}>
              Новый анализ
            </button>
            <button type="button" className="chat-app__btn chat-app__btn--ghost" onClick={handleLogout}>
              Выйти
            </button>
            <Link to="/" className="chat-app__link">
              Главная
            </Link>
          </div>
        </header>

        {showSetup ? (
          <section className="chat-app__setup">
            <form className="chat-app__setup-card" onSubmit={handleStart}>
              <h2 className="chat-app__setup-title">Новый анализ</h2>
              <p className="chat-app__setup-lede">
                Вставьте код и при необходимости опишите задачу — модели проведут раунды разбора.
              </p>
              <div className="chat-app__field">
                <label htmlFor="code">Код</label>
                <textarea
                  id="code"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  spellCheck={false}
                />
              </div>
              <div className="chat-app__field">
                <label htmlFor="ctx">Задача (по желанию)</label>
                <input
                  id="ctx"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Например: найди уязвимости и предложи правки"
                />
              </div>
              <div className="chat-app__row">
                <div className="chat-app__field">
                  <label htmlFor="mode">Режим</label>
                  <select id="mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                    {MODES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="chat-app__field">
                  <label htmlFor="rounds">Раунды</label>
                  <select
                    id="rounds"
                    value={rounds}
                    onChange={(e) => setRounds(Number(e.target.value))}
                  >
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                  </select>
                </div>
              </div>
              {sessionFromUrl ? (
                <p className="chat-app__hint">Продолжаем сохранённую сессию.</p>
              ) : null}
              <button type="submit" className="chat-app__submit" disabled={busy}>
                {busy ? 'Подключение…' : 'Запустить анализ'}
              </button>
            </form>
          </section>
        ) : null}

        {!showSetup || messages.length > 0 ? (
          <div className="chat-app__messages-wrap">
            <div className="chat-app__messages" role="log" aria-live="polite">
              {messages.map((msg) => (
                <ChatMessageItem key={msg.id} msg={msg} />
              ))}
              <div ref={endRef} />
            </div>

            <div className="chat-app__composer">
              <form className="chat-app__composer-inner" onSubmit={handleSend}>
                <textarea
                  ref={inputRef}
                  className="chat-app__input"
                  rows={1}
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={onKeyDown}
                  placeholder={
                    inputLocked
                      ? 'Ожидаем ответ оркестратора…'
                      : 'Ваш ответ оркестратору…'
                  }
                  disabled={inputLocked || status !== 'open'}
                />
                <button
                  type="submit"
                  className="chat-app__send"
                  disabled={inputLocked || status !== 'open' || !draft.trim()}
                  aria-label="Отправить"
                >
                  ↑
                </button>
              </form>
            </div>
          </div>
        ) : null}

        {lastError ? (
          <p className="chat-app__hint" role="alert">
            {lastError}
          </p>
        ) : null}
      </div>
    </div>
  )
}
