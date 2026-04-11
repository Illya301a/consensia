import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import '../App.scss'
import './AppPage.scss'
import { ChatComposer } from '../components/ChatComposer.jsx'
import { ChatMessageItem } from '../components/ChatMessageItem.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { apiFetch } from '../services/http.js'
import {
  buildResumeMessagesFromSessionData,
  buildResumeUsageEventsFromSessionData,
  deriveSessionRounds,
  deriveSessionScenario,
  deriveSessionTitle,
  deleteSession,
  fetchSessionDetails,
  fetchSessionsList,
  normalizeSessionsFromApi,
} from '../services/sessionsApi.js'
import { useOrchestratorWs } from '../services/useOrchestratorWs.js'

const DATA_COLLECTION_KEY = 'consensia_data_collection_v1'
const MAX_SESSION_CONNECT_ATTEMPTS = 3

const APP_COPY = {
  ru: {
    profileLabel: 'Профиль',
    modes: { economy: 'Экономия', balanced: 'Баланс', maxPower: 'Максимум' },
    status: { connecting: 'Подключение…', open: 'Готово', closed: 'Отключено' },
    errors: {
      loginFailed: 'Не удалось войти. Попробуйте еще раз.',
      sessionsLoadFailed: 'Не удалось загрузить список сессий',
      sessionLoadStopped: 'Подключение остановлено. Попробуйте снова.',
      sessionLoadFailed: 'Не удалось загрузить сессию',
      topUpMinAmount: 'Минимальная сумма пополнения — 1$',
      createPaymentFailed: 'Ошибка создания платежа',
      checkoutUrlMissing: 'Stripe checkout URL не получен',
      fileReadFailed: 'Не удалось прочитать файл (слишком большой или недоступен).',
      deleteSessionFailed: 'Не удалось удалить сессию',
    },
    loading: 'Загрузка…',
    navHome: 'На главную',
    authTitle: 'Вход в Consensia',
    authLead: 'Чтобы пользоваться чатом, войдите через Google — так мы связываем сессии с вашим аккаунтом.',
    continueGoogle: 'Продолжить с Google',
    beta: 'Beta',
    closeHistory: 'Закрыть историю',
    openHistory: 'Открыть историю',
    newChat: 'Новый чат',
    credits: 'Кредиты: {{count}}',
    topUpAmountAria: 'Сумма пополнения в долларах',
    creditsShort: '{{count}} кр.',
    topUpRate: 'Курс: {{multiplier}} кредитов за $1',
    topUpButton: 'Пополнить',
    dataCollection: 'Сбор данных',
    logout: 'Выйти',
    home: 'Главная',
    historyAria: 'История чатов',
    historyTitle: 'История',
    closeMenu: 'Закрыть меню',
    sessionsLoading: 'Загрузка…',
    roundLabel: 'Раунд',
    roundMissing: 'Раунд —',
    deleteSessionAria: 'Удалить сессию',
    deleteTitle: 'Удалить',
    historyEmpty: 'Тут появятся ваши чаты после первого запуска.',
    setupTitle: 'Новый чат',
    setupLead: 'Вставьте код или приложите файлы — и опишите задачу.',
    setupLeadNonReview: 'Опишите задачу и при необходимости приложите файлы.',
    codeLabel: 'Код',
    attachFiles: 'Прикрепить файлы к коду',
    attachDocuments: 'Прикрепить документы',
    removeFileAria: 'Удалить {{name}}',
    contextLabelOptional: 'Задача (по желанию)',
    contextLabelRequired: 'Задача',
    contextPlaceholder: 'Например: найди уязвимости и предложи правки',
    modeLabel: 'Режим',
    roundsLabel: 'Раунды',
    resumeHint: 'Продолжаем сохраненную сессию.',
    connectBtn: 'Запустить',
    loadingSession: 'Загрузка сессии…',
    generatingAria: 'Генерация ответа',
    generatingText: 'Генерируем ответ…',
    spentCredits: 'Кредитов потрачено',
    placeholderLocked: 'Ожидаем ответ оркестратора…',
    placeholderOpen: 'Ваш ответ оркестратору…',
  },
  ua: {
    profileLabel: 'Профіль',
    modes: { economy: 'Економія', balanced: 'Баланс', maxPower: 'Максимум' },
    status: { connecting: 'Підключення…', open: 'Готово', closed: 'Відключено' },
    errors: {
      loginFailed: 'Не вдалося увійти. Спробуйте ще раз.',
      sessionsLoadFailed: 'Не вдалося завантажити список сесій',
      sessionLoadStopped: 'Підключення зупинено. Спробуйте знову.',
      sessionLoadFailed: 'Не вдалося завантажити сесію',
      topUpMinAmount: 'Мінімальна сума поповнення — 1$',
      createPaymentFailed: 'Помилка створення платежу',
      checkoutUrlMissing: 'Stripe checkout URL не отримано',
      fileReadFailed: 'Не вдалося прочитати файл (завеликий або недоступний).',
      deleteSessionFailed: 'Не вдалося видалити сесію',
    },
    loading: 'Завантаження…',
    navHome: 'На головну',
    authTitle: 'Вхід у Consensia',
    authLead: 'Щоб користуватися чатом, увійдіть через Google — так ми повʼязуємо сесії з вашим акаунтом.',
    continueGoogle: 'Продовжити з Google',
    beta: 'Beta',
    closeHistory: 'Закрити історію',
    openHistory: 'Відкрити історію',
    newChat: 'Новий чат',
    credits: 'Кредити: {{count}}',
    topUpAmountAria: 'Сума поповнення у доларах',
    creditsShort: '{{count}} кр.',
    topUpRate: 'Курс: {{multiplier}} кредитів за $1',
    topUpButton: 'Поповнити',
    dataCollection: 'Збір даних',
    logout: 'Вийти',
    home: 'Головна',
    historyAria: 'Історія чатів',
    historyTitle: 'Історія',
    closeMenu: 'Закрити меню',
    sessionsLoading: 'Завантаження…',
    roundLabel: 'Раунд',
    roundMissing: 'Раунд —',
    deleteSessionAria: 'Видалити сесію',
    deleteTitle: 'Видалити',
    historyEmpty: 'Тут зʼявляться ваші чати після першого запуску.',
    setupTitle: 'Новий чат',
    setupLead: 'Вставте код або додайте файли — і опишіть задачу.',
    setupLeadNonReview: 'Опишіть задачу і за потреби додайте файли.',
    codeLabel: 'Код',
    attachFiles: 'Додати файли до коду',
    attachDocuments: 'Додати документи',
    removeFileAria: 'Видалити {{name}}',
    contextLabelOptional: 'Задача (за бажанням)',
    contextLabelRequired: 'Задача',
    contextPlaceholder: 'Наприклад: знайди вразливості та запропонуй виправлення',
    modeLabel: 'Режим',
    roundsLabel: 'Раунди',
    resumeHint: 'Продовжуємо збережену сесію.',
    connectBtn: 'Запустити',
    loadingSession: 'Завантаження сесії…',
    generatingAria: 'Генерація відповіді',
    generatingText: 'Генеруємо відповідь…',
    spentCredits: 'Кредитів витрачено',
    placeholderLocked: 'Очікуємо відповідь оркестратора…',
    placeholderOpen: 'Ваша відповідь оркестратору…',
  },
  en: {
    profileLabel: 'Profile',
    modes: { economy: 'Economy', balanced: 'Balanced', maxPower: 'Maximum' },
    status: { connecting: 'Connecting…', open: 'Ready', closed: 'Disconnected' },
    errors: {
      loginFailed: 'Sign-in failed. Please try again.',
      sessionsLoadFailed: 'Failed to load sessions list',
      sessionLoadStopped: 'Connection stopped. Please try again.',
      sessionLoadFailed: 'Failed to load session',
      topUpMinAmount: 'Minimum top-up amount is $1',
      createPaymentFailed: 'Failed to create payment',
      checkoutUrlMissing: 'Stripe checkout URL was not received',
      fileReadFailed: 'Failed to read file (too large or unavailable).',
      deleteSessionFailed: 'Failed to delete session',
    },
    loading: 'Loading…',
    navHome: 'Home',
    authTitle: 'Sign in to Consensia',
    authLead: 'To use the chat, sign in with Google — this links sessions to your account.',
    continueGoogle: 'Continue with Google',
    beta: 'Beta',
    closeHistory: 'Close history',
    openHistory: 'Open history',
    newChat: 'New chat',
    credits: 'Credits: {{count}}',
    topUpAmountAria: 'Top-up amount in dollars',
    creditsShort: '{{count}} cr.',
    topUpRate: 'Rate: {{multiplier}} credits per $1',
    topUpButton: 'Top up',
    dataCollection: 'Data collection',
    logout: 'Log out',
    home: 'Home',
    historyAria: 'Chat history',
    historyTitle: 'History',
    closeMenu: 'Close menu',
    sessionsLoading: 'Loading…',
    roundLabel: 'Round',
    roundMissing: 'Round —',
    deleteSessionAria: 'Delete session',
    deleteTitle: 'Delete',
    historyEmpty: 'Your chats will appear here after the first run.',
    setupTitle: 'New chat',
    setupLead: 'Paste code or attach files — and describe your task.',
    setupLeadNonReview: 'Describe your task and attach files if needed.',
    codeLabel: 'Code',
    attachFiles: 'Attach files to code',
    attachDocuments: 'Attach documents',
    removeFileAria: 'Remove {{name}}',
    contextLabelOptional: 'Task (optional)',
    contextLabelRequired: 'Task',
    contextPlaceholder: 'For example: find vulnerabilities and suggest fixes',
    modeLabel: 'Mode',
    roundsLabel: 'Rounds',
    resumeHint: 'Continuing saved session.',
    connectBtn: 'Start',
    loadingSession: 'Loading session…',
    generatingAria: 'Generating response',
    generatingText: 'Generating response…',
    spentCredits: 'Credits spent',
    placeholderLocked: 'Waiting for orchestrator response…',
    placeholderOpen: 'Your response to orchestrator…',
  },
}

const MODES = [
  { value: 'ECONOMY', key: 'economy' },
  { value: 'BALANCED', key: 'balanced' },
  { value: 'MAX_POWER', key: 'maxPower' },
]

const SCENARIOS = [
  { value: 'CODE_REVIEW', key: 'codeReview' },
  { value: 'CODE_WRITER', key: 'codeWriter' },
  { value: 'QUICK', key: 'quick' },
  { value: 'LEGAL', key: 'legal' },
  { value: 'INVESTOR', key: 'investor' },
  { value: 'SCIENCE', key: 'science' },
]

function modeLabel(value, copy) {
  const m = MODES.find((x) => x.value === value)
  return m ? copy.modes[m.key] : value || copy.roundMissing
}

function scenarioLabel(value, t) {
  const s = SCENARIOS.find((x) => x.value === value)
  return s ? t(`app.scenario.options.${s.key}`) : value || 'CODE_REVIEW'
}

function PrettySelect({ id, label, value, options, onChange }) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef(null)

  useEffect(() => {
    if (!open) return
    const onDown = (ev) => {
      const el = rootRef.current
      if (!el) return
      if (ev.target instanceof Node && !el.contains(ev.target)) setOpen(false)
    }
    const onKey = (ev) => {
      if (ev.key === 'Escape') setOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const selected = options.find((opt) => opt.value === value) || options[0]

  return (
    <div className="chat-app__fselect" ref={rootRef}>
      <label htmlFor={id}>{label}</label>
      <button
        id={id}
        type="button"
        className="chat-app__fselect-button"
        aria-haspopup="listbox"
        aria-expanded={open ? 'true' : 'false'}
        onClick={() => setOpen((v) => !v)}
      >
        <span>{selected?.label ?? ''}</span>
        <span className={`chat-app__fselect-chevron${open ? ' chat-app__fselect-chevron--open' : ''}`} aria-hidden="true">
          ▼
        </span>
      </button>
      {open ? (
        <div className="chat-app__fselect-menu" role="listbox" aria-labelledby={id}>
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              role="option"
              aria-selected={value === opt.value ? 'true' : 'false'}
              className={`chat-app__fselect-item${value === opt.value ? ' chat-app__fselect-item--active' : ''}`}
              onClick={() => {
                setOpen(false)
                onChange(opt.value)
              }}
            >
              {opt.label}
            </button>
          ))}
    </div>
      ) : null}
    </div>
  )
}

function capitalizeFirst(value) {
  const text = String(value ?? '').trim()
  if (!text) return ''
  return text[0].toUpperCase() + text.slice(1)
}

function visibleSessionTitle(value) {
  const raw = String(value ?? '').trim()
  if (!raw) return ''
  const lowered = raw.toLowerCase()
  // Hide technical placeholders like "Сессия <id>" / "Session <id>".
  if (/^(сессия|сесія|session)\s+[a-z0-9-]{6,}$/i.test(raw)) return ''
  if (lowered === 'сессия' || lowered === 'сесія' || lowered === 'session') return ''
  return capitalizeFirst(raw)
}

function mergeSessionsKeepingMeta(prevList, incomingList) {
  const prev = Array.isArray(prevList) ? prevList : []
  const incoming = Array.isArray(incomingList) ? incomingList : []
  const prevById = new Map(prev.map((s) => [s?.id, s]))
  return incoming.map((next) => {
    const prevItem = prevById.get(next?.id)
    const nextTitle = String(next?.title ?? '').trim()
    const prevTitle = String(prevItem?.title ?? '').trim()
    const visibleNext = visibleSessionTitle(nextTitle)
    const visiblePrev = visibleSessionTitle(prevTitle)
    const nextRoundsRaw = next?.rounds
    const prevRoundsRaw = prevItem?.rounds
    const nextScenarioRaw = String(next?.scenario ?? '').trim()
    const prevScenarioRaw = String(prevItem?.scenario ?? '').trim()
    const nextRounds =
      typeof nextRoundsRaw === 'number' && Number.isFinite(nextRoundsRaw) && nextRoundsRaw > 0
        ? nextRoundsRaw
        : null
    const prevRounds =
      typeof prevRoundsRaw === 'number' && Number.isFinite(prevRoundsRaw) && prevRoundsRaw > 0
        ? prevRoundsRaw
        : null

    const patched = { ...next }
    if (!visibleNext && visiblePrev) patched.title = prevTitle
    if (nextRounds == null && prevRounds != null) patched.rounds = prevRounds
    if (!nextScenarioRaw && prevScenarioRaw) patched.scenario = prevScenarioRaw
    return patched
  })
}

function keepPreviousSessionsOnTransientEmpty(prevList, nextList) {
  const prev = Array.isArray(prevList) ? prevList : []
  const next = Array.isArray(nextList) ? nextList : []
  // Avoid sidebar flicker: if API briefly returns empty while we already have history, keep previous list.
  if (prev.length > 0 && next.length === 0) return prev
  return next
}

function deriveImmediateSessionTitle(value) {
  const raw = String(value ?? '').replace(/\s+/g, ' ').trim()
  if (!raw) return ''
  return raw.slice(0, 90)
}

function formatWhen(ts) {
  const d = new Date(ts)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString(undefined, { month: 'short', day: '2-digit' })
}

function getUserLabel(user, fallbackLabel) {
  if (!user || typeof user !== 'object') return fallbackLabel
  return (
    user.email ||
    user.name ||
    user.full_name ||
    user.display_name ||
    user.given_name ||
    fallbackLabel
  )
}

function getCredits(user) {
  if (!user || typeof user !== 'object') return null
  const candidates = [
    user.credits,
    user.credit_balance,
    user.balance,
    user.remaining_credits,
  ]
  for (const v of candidates) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}

async function readTextFile(file, maxBytes = 400_000) {
  if (file.size > maxBytes) throw new Error('file too large')
  return await file.text()
}

async function readFileAsDataUrl(file, maxBytes = 8_000_000) {
  if (file.size > maxBytes) throw new Error('file too large')
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('file read failed'))
    reader.readAsDataURL(file)
  })
}

function countDocumentsFromHistory(history) {
  if (!Array.isArray(history)) return 0
  let count = 0
  for (const item of history) {
    if (!item || typeof item !== 'object') continue
    const fromFileAmount = Number(item?.file_amount ?? item?.fileAmount ?? 0)
    if (Number.isFinite(fromFileAmount) && fromFileAmount > 0) {
      count = Math.max(count, Math.floor(fromFileAmount))
    }
    if (Array.isArray(item.documents)) {
      count = Math.max(count, item.documents.length)
      continue
    }
    const nested = item.content
    if (nested && typeof nested === 'object' && Array.isArray(nested.documents)) {
      count = Math.max(count, nested.documents.length)
    }
  }
  return count
}

function statusLabel(status, copy) {
  switch (status) {
    case 'connecting':
      return copy.status.connecting
    case 'open':
      return copy.status.open
    case 'closed':
      return copy.status.closed
    default:
      return null
  }
}

function isInsufficientCreditsError(value) {
  const text = String(value ?? '').toLowerCase()
  if (!text) return false
  return (
    text.includes('insufficient') ||
    text.includes('not enough credit') ||
    text.includes('no credits') ||
    text.includes('недостаточно кредит') ||
    text.includes('недостаточно средств') ||
    text.includes('закончились кредиты') ||
    text.includes('credit limit') ||
    text.includes('out of credits')
  )
}

function n(value) {
  const x = Number(value)
  return Number.isFinite(x) ? x : 0
}

function totalTokensFromUsage(usage) {
  const u = usage && typeof usage === 'object' ? usage : {}
  const directTotal = u.total ?? u.total_tokens ?? u.tokens ?? u.totalTokens
  if (directTotal != null) return n(directTotal)
  const promptTokens = u.prompt ?? u.prompt_tokens ?? u.input_tokens
  const completionTokens = u.completion ?? u.completion_tokens ?? u.output_tokens
  return n(promptTokens) + n(completionTokens)
}

function collectNumericDeep(value, keys, out, depth = 0) {
  if (!value || typeof value !== 'object' || depth > 5) return
  if (Array.isArray(value)) {
    value.forEach((item) => collectNumericDeep(item, keys, out, depth + 1))
    return
  }
  for (const [k, v] of Object.entries(value)) {
    if (keys.has(k)) {
      const n = Number(v)
      if (Number.isFinite(n) && n >= 0) out.push(n)
    }
    if (v && typeof v === 'object') collectNumericDeep(v, keys, out, depth + 1)
  }
}

function extractSpentCreditsFromDetail(detail, sessionData, sessionMeta) {
  const d = detail && typeof detail === 'object' ? detail : {}
  const sd = sessionData && typeof sessionData === 'object' ? sessionData : {}
  const sm = sessionMeta && typeof sessionMeta === 'object' ? sessionMeta : {}

  const directTokenCandidates = [
    d.tokens_used,
    d.total_tokens,
    d.tokens,
    sd.tokens_used,
    sd.total_tokens,
    sd.tokens,
    sm.tokens_used,
    sm.total_tokens,
    sm.tokens,
  ]
  const deepTokenCandidates = []
  collectNumericDeep(d, new Set(['tokens_used', 'total_tokens', 'tokens']), deepTokenCandidates)
  collectNumericDeep(sd, new Set(['tokens_used', 'total_tokens', 'tokens']), deepTokenCandidates)
  collectNumericDeep(sm, new Set(['tokens_used', 'total_tokens', 'tokens']), deepTokenCandidates)
  const tokenCandidates = [...directTokenCandidates, ...deepTokenCandidates]
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x) && x >= 0)
  const maxTokens = tokenCandidates.length ? Math.max(...tokenCandidates) : null
  if (maxTokens != null && maxTokens > 0) {
    return Math.floor(maxTokens / 1000)
  }

  const directCreditCandidates = [
    d.burned_credits,
    d.spent_credits,
    sd.burned_credits,
    sd.spent_credits,
    sm.burned_credits,
    sm.spent_credits,
  ]
  const deepCreditCandidates = []
  collectNumericDeep(
    d,
    new Set(['burned_credits', 'spent_credits', 'credits_spent', 'used_credits']),
    deepCreditCandidates
  )
  collectNumericDeep(
    sd,
    new Set(['burned_credits', 'spent_credits', 'credits_spent', 'used_credits']),
    deepCreditCandidates
  )
  collectNumericDeep(
    sm,
    new Set(['burned_credits', 'spent_credits', 'credits_spent', 'used_credits']),
    deepCreditCandidates
  )
  const creditCandidates = [...directCreditCandidates, ...deepCreditCandidates]
    .map((x) => Number(x))
    .filter((x) => Number.isFinite(x) && x >= 0)
  const maxCredits = creditCandidates.length ? Math.max(...creditCandidates) : null
  if (maxCredits != null && maxCredits > 0) {
    return Math.floor(maxCredits)
  }
  return null
}

export default function AppPage() {
  const { i18n, t } = useTranslation()
  const lang = String(i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const c = APP_COPY[lang] || APP_COPY.ru
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sessionFromUrl = searchParams.get('session') || ''
  const { token, user, isAuthenticated, authChecked, loginWithGoogle, logout, refreshUser } =
    useAuth()

  const {
    status,
    messages,
    usageEvents,
    inputLocked,
    lastError,
    connect,
    disconnect,
    sendFollowUp,
    sessionId,
  } = useOrchestratorWs({
    onSessionId: (sid) => {
      const optimisticTitle = deriveImmediateSessionTitle(context)
      const optimisticCreatedAt = new Date().toISOString()
      setSessions((prev) => {
        const list = Array.isArray(prev) ? prev : []
        const existingIndex = list.findIndex((x) => x?.id === sid)
        if (existingIndex >= 0) {
          const existing = list[existingIndex]
          const shouldUseOptimisticTitle =
            !String(existing?.title ?? '').trim() ||
            String(existing?.title ?? '').trim().toLowerCase().startsWith('сессия ')
          if (!shouldUseOptimisticTitle || !optimisticTitle) return list
          const next = list.slice()
          next[existingIndex] = {
            ...existing,
            title: optimisticTitle,
            scenario: existing?.scenario || scenario || 'CODE_REVIEW',
          }
          return next
        }
        return [
          {
            id: sid,
            title: optimisticTitle,
            createdAt: optimisticCreatedAt,
            mode,
            scenario: scenario || 'CODE_REVIEW',
            rounds,
          },
          ...list,
        ]
      })
      navigate(`/app?session=${encodeURIComponent(sid)}`, { replace: true })
    },
  })

  const [code, setCode] = useState('')
  const [context, setContext] = useState('')
  const [rounds, setRounds] = useState(1)
  const [mode, setMode] = useState('ECONOMY')
  const [scenario, setScenario] = useState('CODE_REVIEW')
  const [showSetup, setShowSetup] = useState(true)
  const [authGateError, setAuthGateError] = useState('')

  const [attached, setAttached] = useState([])
  const [attachError, setAttachError] = useState('')
  const [documents, setDocuments] = useState([])
  const [documentsError, setDocumentsError] = useState('')

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [sessionsError, setSessionsError] = useState(null)
  const [sessionLoading, setSessionLoading] = useState(false)
  const [sessionLoadError, setSessionLoadError] = useState(null)
  const [restoredSpentCredits, setRestoredSpentCredits] = useState(null)
  const [showTypingHint, setShowTypingHint] = useState(false)
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  const [profileOpen, setProfileOpen] = useState(false)
  const profileRef = useRef(null)
  const [promoInfo, setPromoInfo] = useState(null)
  const [topUpAmount, setTopUpAmount] = useState('10')
  const [topUpLoading, setTopUpLoading] = useState(false)
  const [topUpError, setTopUpError] = useState('')
  const [dataCollection, setDataCollection] = useState(() => {
    try {
      const raw = localStorage.getItem(DATA_COLLECTION_KEY)
      if (raw == null) return true
      return raw === 'true'
    } catch {
      return true
    }
  })

  const codeRef = useRef(code)
  const modeRef = useRef(mode)
  const scenarioRef = useRef(scenario)
  const contextRef = useRef(context)
  const roundsRef = useRef(rounds)
  const connectRef = useRef(connect)
  const statusRef = useRef(status)
  const sessionIdRef = useRef(sessionId)
  const lastErrorRef = useRef(lastError)
  const sessionLoadErrorRef = useRef(sessionLoadError)
  /** Avoid re-running session load while WS is already connecting/open for the same ?session= */
  const urlSessionConnectRef = useRef('')
  const sessionConnectAttemptsRef = useRef(new Map())
  const blockedReconnectSessionsRef = useRef(new Set())
  /** Prevent stale `?session=` effect right after pressing "Новый чат". */
  const suppressUrlSessionLoadRef = useRef(false)
  const lastNonEmptySessionsRef = useRef([])
  useEffect(() => {
    codeRef.current = code
    modeRef.current = mode
    scenarioRef.current = scenario
    contextRef.current = context
    roundsRef.current = rounds
    connectRef.current = connect
    statusRef.current = status
    sessionIdRef.current = sessionId
    lastErrorRef.current = lastError
    sessionLoadErrorRef.current = sessionLoadError
  })

  useEffect(() => {
    if (Array.isArray(sessions) && sessions.length > 0) {
      lastNonEmptySessionsRef.current = sessions
    }
  }, [sessions])

  const endRef = useRef(null)
  const messagesRef = useRef(null)
  const prevInputLockedRef = useRef(true)
  const prevInputLockedCreditsRef = useRef(true)

  const amountNum = Number(topUpAmount)
  const promoMultiplier =
    Number(promoInfo?.multiplier) > 0 ? Number(promoInfo.multiplier) : 200
  const creditsPreview =
    Number.isFinite(amountNum) && amountNum > 0
      ? Math.floor(amountNum * promoMultiplier)
      : 0

  useEffect(() => {
    const err = searchParams.get('error')
    if (!err) return
    try {
      const decoded = decodeURIComponent(err)
      // eslint-disable-next-line react-hooks/set-state-in-effect -- this is a one-off URL-to-UI sync
      setAuthGateError(decoded === 'auth' ? c.errors.loginFailed : decoded)
    } catch {
      setAuthGateError(c.errors.loginFailed)
    }
    navigate('/app', { replace: true })
  }, [searchParams, navigate, c.errors.loginFailed])

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) disconnect()
  }, [isAuthenticated, disconnect])

  useEffect(() => {
    if (!isAuthenticated || !token) {
      prevInputLockedRef.current = inputLocked
      return
    }
    const wasLocked = prevInputLockedRef.current
    prevInputLockedRef.current = inputLocked
    if (!wasLocked || inputLocked) return
    const timer = window.setTimeout(() => {
      void refreshUser?.()
    }, 250)
    return () => window.clearTimeout(timer)
  }, [inputLocked, isAuthenticated, token, refreshUser])

  useEffect(() => {
    if (!isAuthenticated || !token) {
      prevInputLockedCreditsRef.current = inputLocked
      return
    }
    const activeSessionId = sessionFromUrl || sessionId || ''
    if (!activeSessionId) return
    const wasLocked = prevInputLockedCreditsRef.current
    prevInputLockedCreditsRef.current = inputLocked
    if (!wasLocked || inputLocked) return
    let cancelled = false
    const timer = window.setTimeout(async () => {
      for (let i = 0; i < 3; i += 1) {
        const sessionsRes = await fetchSessionsList()
        const normalizedFromList = sessionsRes.ok
          ? normalizeSessionsFromApi(sessionsRes.sessions)
          : []
        const res = await fetchSessionDetails(activeSessionId)
        if (cancelled) return
        if (res.ok && res.detail) {
          const d = res.detail || {}
          const sd = d.session_data || {}
          const currentSessionMeta = sessionsRes.ok
            ? normalizedFromList.find((s) => s.id === activeSessionId) || null
            : null
          const resumeUsageEvents = buildResumeUsageEventsFromSessionData(sd)
          const restoredFromDetail = extractSpentCreditsFromDetail(d, sd, currentSessionMeta)
          const restoredFromHistory = Math.floor(
            resumeUsageEvents.reduce((sum, e) => sum + totalTokensFromUsage(e?.usage), 0) / 1000
          )
          const nextSpent = Math.max(restoredFromDetail ?? 0, restoredFromHistory)
          setRestoredSpentCredits((prev) => Math.max(prev ?? 0, nextSpent))
        }
        if (i < 2) {
          await new Promise((resolve) => window.setTimeout(resolve, 900))
        }
      }
    }, 350)
    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [inputLocked, isAuthenticated, token, sessionFromUrl, sessionId])

  useEffect(() => {
    if (!isAuthenticated || !token) return
    let cancelled = false
    ;(async () => {
      const r = await apiFetch('/api/promo/status')
      if (cancelled || !r.ok) return
      const data = await r.json().catch(() => null)
      if (!cancelled && data && typeof data === 'object') setPromoInfo(data)
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, token])

  const hydrateSessionsFromDetails = useCallback(async (baseSessions) => {
    const list = Array.isArray(baseSessions) ? baseSessions : []
    const candidates = list
      .filter((s) => s && (!s.title || s.rounds == null))
      .slice(0, 40)
    if (!candidates.length) return list

    const details = await Promise.all(
      candidates.map(async (s) => {
        const res = await fetchSessionDetails(s.id)
        if (!res.ok || !res.detail) return null
        const d = res.detail
        const sd = d.session_data || {}
        return {
          id: s.id,
          title: deriveSessionTitle(d) || deriveSessionTitle(sd) || s.title || '',
          rounds: deriveSessionRounds(d) ?? deriveSessionRounds(sd) ?? s.rounds ?? null,
          mode: (typeof sd.mode === 'string' && sd.mode) || s.mode || '',
          scenario: deriveSessionScenario(d) || deriveSessionScenario(sd) || s.scenario || '',
        }
      })
    )

    const patch = new Map(details.filter(Boolean).map((x) => [x.id, x]))
    if (!patch.size) return list
    return list.map((s) => (patch.has(s.id) ? { ...s, ...patch.get(s.id) } : s))
  }, [])

  useEffect(() => {
    if (!isAuthenticated || !token) return
    let cancelled = false
    ;(async () => {
      setSessionsLoading(true)
      setSessionsError(null)
      const res = await fetchSessionsList()
      if (cancelled) return
      setSessionsLoading(false)
      if (!res.ok) {
      setSessionsError(res.error || c.errors.sessionsLoadFailed)
        return
      }
      const normalized = normalizeSessionsFromApi(res.sessions)
      const enriched = await hydrateSessionsFromDetails(normalized)
      if (!cancelled) {
        const finalList = Array.isArray(enriched) && enriched.length ? enriched : normalized
        setSessions((prev) => {
          const merged = mergeSessionsKeepingMeta(prev, finalList)
          return keepPreviousSessionsOnTransientEmpty(prev, merged)
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, token, hydrateSessionsFromDetails])

  useEffect(() => {
    if (!sessionId || !isAuthenticated) return
    let cancelled = false
    ;(async () => {
      const res = await fetchSessionsList()
      if (cancelled || !res.ok) return
      const normalized = normalizeSessionsFromApi(res.sessions)
      const enriched = await hydrateSessionsFromDetails(normalized)
      if (!cancelled) {
        const finalList = Array.isArray(enriched) && enriched.length ? enriched : normalized
        setSessions((prev) => {
          const merged = mergeSessionsKeepingMeta(prev, finalList)
          return keepPreviousSessionsOnTransientEmpty(prev, merged)
        })
      }
    })()
    return () => {
      cancelled = true
    }
  }, [sessionId, isAuthenticated, hydrateSessionsFromDetails])

  useEffect(() => {
    const el = messagesRef.current
    if (!el) return
    el.scrollTop = el.scrollHeight
  }, [messages])

  const fullCode = useMemo(() => {
    if (!attached.length) return code
    const parts = [code.trimEnd()]
    for (const f of attached) {
      parts.push(
        '',
        `/* FILE: ${f.name} */`,
        String(f.text ?? '').trimEnd(),
        `/* END FILE: ${f.name} */`
      )
    }
    return parts.join('\n')
  }, [code, attached])

  const isCodeReviewScenario = scenario === 'CODE_REVIEW'
  const canChooseRounds = scenario !== 'CODE_WRITER' && scenario !== 'QUICK'
  const setupLeadText = isCodeReviewScenario ? c.setupLead : c.setupLeadNonReview

  useEffect(() => {
    if (isCodeReviewScenario) return
    if (attached.length) setAttached([])
    if (attachError) setAttachError('')
  }, [isCodeReviewScenario, attached.length, attachError])

  useEffect(() => {
    if (!isCodeReviewScenario) return
    if (documents.length) setDocuments([])
    if (documentsError) setDocumentsError('')
  }, [isCodeReviewScenario, documents.length, documentsError])

  useEffect(() => {
    if (!sessionFromUrl) {
      suppressUrlSessionLoadRef.current = false
      urlSessionConnectRef.current = ''
      return
    }
    if (suppressUrlSessionLoadRef.current) return
    if (!token || !isAuthenticated) {
      urlSessionConnectRef.current = ''
      return
    }
    if (sessionIdRef.current === sessionFromUrl && statusRef.current === 'open') return
    if (
      (statusRef.current === 'connecting' || statusRef.current === 'open') &&
      urlSessionConnectRef.current === sessionFromUrl
    ) {
      return
    }
    if (blockedReconnectSessionsRef.current.has(sessionFromUrl)) return

    urlSessionConnectRef.current = sessionFromUrl

    let cancelled = false
    ;(async () => {
      setSessionLoadError(null)
      setSessionLoading(true)
      setShowSetup(false)
      try {
        const res = await fetchSessionDetails(sessionFromUrl)
        if (cancelled) return

        const attemptsMap = sessionConnectAttemptsRef.current
        const attempts = attemptsMap.get(sessionFromUrl) ?? 0
        if (attempts >= MAX_SESSION_CONNECT_ATTEMPTS) {
          blockedReconnectSessionsRef.current.add(sessionFromUrl)
          setSessionLoadError(lastErrorRef.current || c.errors.sessionLoadStopped)
          return
        }
        attemptsMap.set(sessionFromUrl, attempts + 1)

        if (!res.ok) {
          setSessionLoadError(res.error || c.errors.sessionLoadFailed)
          return
        }
        const d = res.detail || {}
        const sd = d.session_data || {}
        const resumeUsageEvents = buildResumeUsageEventsFromSessionData(sd)
        const currentSessionMeta = sessions.find((s) => s.id === sessionFromUrl) || null
        const restoredFromDetail = extractSpentCreditsFromDetail(d, sd, currentSessionMeta)
        const restoredFromHistory = Math.floor(
          resumeUsageEvents.reduce((sum, e) => sum + totalTokensFromUsage(e?.usage), 0) / 1000
        )
        setRestoredSpentCredits(Math.max(restoredFromDetail ?? 0, restoredFromHistory))
        const detailTitle = deriveSessionTitle(d) || deriveSessionTitle(sd)
        const detailRounds = deriveSessionRounds(d) ?? deriveSessionRounds(sd)
        const detailScenario = deriveSessionScenario(d) || deriveSessionScenario(sd)
        const resumeFileAmount = Math.max(
          Number(sd?.file_amount ?? sd?.fileAmount ?? 0) || 0,
          Number(d?.file_amount ?? d?.fileAmount ?? 0) || 0
        )
        const resumeBase = buildResumeMessagesFromSessionData(sd).map((m) =>
          m?.kind === 'task'
            ? {
                ...m,
                scenario: m?.scenario || detailScenario || scenarioRef.current || 'CODE_REVIEW',
                documentsCount: Number(m?.documentsCount) || resumeFileAmount || 0,
              }
            : m
        )
        const hasUserInHistory = resumeBase.some((m) => m?.kind === 'user' || m?.kind === 'task')
        const firstTask = resumeBase.find((m) => m?.kind === 'task')
        const firstTaskTitle =
          typeof firstTask?.context === 'string' && firstTask.context.trim()
            ? firstTask.context.trim().slice(0, 90)
            : ''
        const codeBody =
          (typeof d.final_code === 'string' && d.final_code.length ? d.final_code : '') ||
          (typeof d.original_code === 'string' && d.original_code.length ? d.original_code : '') ||
          (typeof sd.last_code_version === 'string' && sd.last_code_version.length
            ? sd.last_code_version
            : '') ||
          ''
        if (codeBody) setCode(codeBody)
        setAttached([])
        setDocuments([])
        setDocumentsError('')
        const sdMode = sd.mode
        if (typeof sdMode === 'string' && MODES.some((m) => m.value === sdMode)) {
          setMode(sdMode)
        }
        if (SCENARIOS.some((s) => s.value === detailScenario)) {
          setScenario(detailScenario)
        }
        const cr = sd.current_round
        if (typeof cr === 'number' && cr >= 1 && cr <= 3) setRounds(cr)

        const codeForWs = codeBody || codeRef.current
        const modeForWs = (typeof sdMode === 'string' && sdMode ? sdMode : null) || modeRef.current
        const scenarioForWs =
          SCENARIOS.some((s) => s.value === detailScenario) ? detailScenario : scenarioRef.current
        const isResumeCodeReview = scenarioForWs === 'CODE_REVIEW'
        const roundsForWs =
          typeof cr === 'number' && cr >= 1 && cr <= 3 ? cr : roundsRef.current
        const documentsCountFromHistory = Math.max(
          Number(sd?.file_amount ?? sd?.fileAmount ?? 0) || 0,
          Number(d?.file_amount ?? d?.fileAmount ?? 0) || 0,
          countDocumentsFromHistory(sd?.history),
          Number(firstTask?.documentsCount ?? 0) || 0
        )
        const initialContext =
          (typeof sd.context === 'string' && sd.context.trim() ? sd.context.trim() : '') ||
          (typeof d.context === 'string' && d.context.trim() ? d.context.trim() : '') ||
          (typeof sd.prompt === 'string' && sd.prompt.trim() ? sd.prompt.trim() : '') ||
          (typeof d.prompt === 'string' && d.prompt.trim() ? d.prompt.trim() : '') ||
          (typeof sd.user_message === 'string' && sd.user_message.trim()
            ? sd.user_message.trim()
            : '') ||
          (typeof d.user_message === 'string' && d.user_message.trim()
            ? d.user_message.trim()
            : '') ||
          (typeof firstTask?.context === 'string' && firstTask.context.trim()
            ? firstTask.context.trim()
            : '') ||
          contextRef.current
        const originalCodeRaw =
          (typeof d.original_code === 'string' && d.original_code.length ? d.original_code : '') ||
          (typeof sd.original_code === 'string' && sd.original_code.length ? sd.original_code : '') ||
          (typeof firstTask?.code === 'string' && firstTask.code.length ? firstTask.code : '') ||
          codeForWs
        const originalCode = isResumeCodeReview ? originalCodeRaw : ''
        const ctx = initialContext
        const resumeMessages =
          !hasUserInHistory && (initialContext || originalCode || documentsCountFromHistory > 0)
            ? [
                {
                  id: `task-${Date.now()}`,
                  kind: 'task',
                  context: initialContext,
                  code: originalCode,
                  mode: modeForWs,
                  scenario: scenarioForWs,
                  rounds: roundsForWs,
                  documentsCount: !isResumeCodeReview ? documentsCountFromHistory : 0,
                },
                ...resumeBase,
              ]
            : resumeBase

        setSessions((prev) =>
          prev.map((s) =>
            s.id === sessionFromUrl
              ? {
                  ...s,
                  title: detailTitle || firstTaskTitle || s.title,
                  scenario: detailScenario || s.scenario || '',
                  rounds: detailRounds ?? s.rounds ?? null,
                }
              : s
          )
        )

        connectRef.current({
          token,
          sessionId: sessionFromUrl,
          mode: modeForWs,
          scenario: scenarioForWs,
          code: codeForWs,
          context: ctx,
          rounds: roundsForWs,
          ui: {
            context: ctx,
            code: isResumeCodeReview ? codeForWs : '',
            mode: modeForWs,
            scenario: scenarioForWs,
            rounds: roundsForWs,
            documentsCount: !isResumeCodeReview ? documentsCountFromHistory : 0,
          },
          resumeMessages: resumeMessages.length ? resumeMessages : undefined,
          resumeUsageEvents: resumeUsageEvents.length ? resumeUsageEvents : undefined,
        })
      } catch (e) {
        if (!cancelled) setSessionLoadError(e?.message || String(e))
      } finally {
        if (!cancelled) setSessionLoading(false)
      }
    })()

    return () => {
      cancelled = true
    }
    // sessionFromUrl and token/isAuthenticated are the real triggers.
    // connect, status, sessionId, lastError, sessionLoadError are accessed via refs
    // to avoid spurious re-runs that exhaust the attempt counter.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionFromUrl, token, isAuthenticated])

  useEffect(() => {
    const sid = sessionFromUrl || sessionId || ''
    if (!sid || !lastError) return
    if (!isInsufficientCreditsError(lastError)) return
    blockedReconnectSessionsRef.current.add(sid)
    setSessionLoadError(lastError)
  }, [lastError, sessionFromUrl, sessionId])

  const handleStart = useCallback(
    (e) => {
      e.preventDefault()
      if (!token) return
      setProfileOpen(false)
      setRestoredSpentCredits(null)
      setShowTypingHint(true)
      if (sessionFromUrl) {
        blockedReconnectSessionsRef.current.delete(sessionFromUrl)
        sessionConnectAttemptsRef.current.delete(sessionFromUrl)
      }
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      connect({
        token,
        sessionId: sessionFromUrl || null,
        mode,
        scenario,
        code: isCodeReviewScenario ? fullCode : '',
        context,
        rounds: canChooseRounds ? rounds : 1,
        documents: !isCodeReviewScenario
          ? documents.map((doc) => ({ name: doc.name, data: doc.data }))
          : undefined,
        ui: {
          context,
          code: isCodeReviewScenario ? fullCode : '',
          mode,
          scenario,
          rounds: canChooseRounds ? rounds : 1,
          documentsCount: !isCodeReviewScenario ? documents.length : 0,
        },
      })
      setShowSetup(false)
    },
    [
      connect,
      token,
      sessionFromUrl,
      mode,
      scenario,
      fullCode,
      context,
      rounds,
      documents,
      isCodeReviewScenario,
      canChooseRounds,
    ]
  )

  const handleNewSession = useCallback(() => {
    suppressUrlSessionLoadRef.current = true
    urlSessionConnectRef.current = ''
    sessionConnectAttemptsRef.current.clear()
    blockedReconnectSessionsRef.current.clear()
    setMobileSidebarOpen(false)
    disconnect()
    setSessionLoading(false)
    navigate('/app', { replace: true })
    setShowSetup(true)
    setProfileOpen(false)
    setRestoredSpentCredits(null)
    setShowTypingHint(false)
    setSessionLoadError(null)
    setDocuments([])
    setDocumentsError('')
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [disconnect, navigate])

  const handleLogout = useCallback(() => {
    disconnect()
    logout()
    navigate('/', { replace: true })
  }, [disconnect, logout, navigate])

  const handleTopUp = useCallback(async () => {
    const amount = Number(topUpAmount)
    if (!Number.isFinite(amount) || amount < 1) {
      setTopUpError(c.errors.topUpMinAmount)
      return
    }
    setTopUpError('')
    setTopUpLoading(true)
    try {
      const r = await apiFetch('/payments/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount_usd: Math.round(amount) }),
      })
      const data = await r.json().catch(() => null)
      if (!r.ok) {
        throw new Error(data?.detail || c.errors.createPaymentFailed)
      }
      if (!data?.checkout_url) {
        throw new Error(c.errors.checkoutUrlMissing)
      }
      window.location.href = data.checkout_url
    } catch (e) {
      setTopUpError(e?.message || String(e))
    } finally {
      setTopUpLoading(false)
    }
  }, [topUpAmount])

  useEffect(() => {
    try {
      localStorage.setItem(DATA_COLLECTION_KEY, dataCollection ? 'true' : 'false')
    } catch {
      /* ignore */
    }
  }, [dataCollection])

  useEffect(() => {
    const onDown = (ev) => {
      const el = profileRef.current
      if (!el) return
      if (ev.target instanceof Node && !el.contains(ev.target)) setProfileOpen(false)
    }
    const onKey = (ev) => {
      if (ev.key === 'Escape') setProfileOpen(false)
    }
    if (profileOpen) {
      window.addEventListener('mousedown', onDown)
      window.addEventListener('keydown', onKey)
    }
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [profileOpen])

  useEffect(() => {
    if (!mobileSidebarOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (ev) => {
      if (ev.key === 'Escape') setMobileSidebarOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [mobileSidebarOpen])

  const handlePickFiles = useCallback(async (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    setAttachError('')
    try {
      const texts = await Promise.all(
        files.map(async (file) => ({
          name: file.name,
          size: file.size,
          text: await readTextFile(file),
        }))
      )
      setAttached((prev) => {
        const merged = [...prev]
        for (const t of texts) {
          if (merged.some((p) => p.name === t.name && p.size === t.size)) continue
          merged.push(t)
        }
        return merged.slice(0, 10)
      })
    } catch {
      setAttachError(c.errors.fileReadFailed)
    }
  }, [])

  const removeAttachment = useCallback((name, size) => {
    setAttached((prev) => prev.filter((f) => !(f.name === name && f.size === size)))
  }, [])

  const handlePickDocuments = useCallback(
    async (e) => {
      const files = Array.from(e.target.files || [])
      e.target.value = ''
      if (!files.length) return
      setDocumentsError('')
      try {
        const encoded = await Promise.all(
          files.map(async (file) => ({
            name: file.name,
            size: file.size,
            data: await readFileAsDataUrl(file),
          }))
        )
        setDocuments((prev) => {
          const merged = [...prev]
          for (const file of encoded) {
            if (merged.some((p) => p.name === file.name && p.size === file.size)) continue
            merged.push(file)
          }
          return merged.slice(0, 10)
        })
      } catch {
        setDocumentsError(c.errors.fileReadFailed)
      }
    },
    [c.errors.fileReadFailed]
  )

  const removeDocument = useCallback((name, size) => {
    setDocuments((prev) => prev.filter((f) => !(f.name === name && f.size === size)))
  }, [])

  const openHistorySession = useCallback(
    (sid) => {
      setProfileOpen(false)
      setMobileSidebarOpen(false)
      disconnect()
      setShowSetup(false)
      setSessionLoadError(null)
      blockedReconnectSessionsRef.current.delete(sid)
      sessionConnectAttemptsRef.current.delete(sid)
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      navigate(`/app?session=${encodeURIComponent(sid)}`, { replace: true })
    },
    [disconnect, navigate]
  )

  const deleteHistorySession = useCallback(
    async (sid) => {
      try {
        const res = await deleteSession(sid)
        if (!res.ok) throw new Error(res.error || c.errors.deleteSessionFailed)
        setSessions((prev) => prev.filter((x) => x.id !== sid))
        const activeSid = sessionFromUrl || sessionId || ''
        if (activeSid && sid === activeSid) {
          disconnect()
          navigate('/app', { replace: true })
          setShowSetup(true)
        }
      } catch (e) {
        window.alert(e?.message || String(e))
      }
    },
    [disconnect, navigate, sessionFromUrl, sessionId]
  )

  const handleSendMessage = useCallback(
    (text) => {
      const value = String(text ?? '').trim()
      if (!value) return
      setProfileOpen(false)
      setShowTypingHint(true)
      sendFollowUp(value)
    },
    [sendFollowUp]
  )

  const busy = status === 'connecting'
  const statusText = statusLabel(status, c)
  useEffect(() => {
    if (status === 'closed' || status === 'idle') {
      setShowTypingHint(false)
      return
    }
    if (lastError) {
      setShowTypingHint(false)
      return
    }
    // Don't hide instantly on transient unlocks from snapshot updates.
    if (!inputLocked) {
      const timer = window.setTimeout(() => {
        setShowTypingHint(false)
      }, 450)
      return () => window.clearTimeout(timer)
    }
  }, [inputLocked, status, lastError])

  const waitingForAi = status === 'open' && showTypingHint
  const hasFinalVerdict = messages.some((m) => m.kind === 'final')
  const spentCreditsLive = useMemo(() => {
    const totalTokens = usageEvents.reduce((sum, e) => sum + totalTokensFromUsage(e?.usage), 0)
    return Math.floor(totalTokens / 1000)
  }, [usageEvents])
  const sessionsForRender =
    Array.isArray(sessions) && sessions.length > 0 ? sessions : lastNonEmptySessionsRef.current
  const activeSid = sessionFromUrl || sessionId || ''
  const activeSessionMeta = useMemo(
    () => sessionsForRender.find((s) => s.id === activeSid) || null,
    [sessionsForRender, activeSid]
  )
  const spentCreditsFromMeta = useMemo(
    () => extractSpentCreditsFromDetail(null, null, activeSessionMeta) ?? 0,
    [activeSessionMeta]
  )
  const spentCredits = Math.max(restoredSpentCredits ?? 0, spentCreditsLive, spentCreditsFromMeta)
  const renderedMessages = useMemo(
    () => messages.map((msg) => <ChatMessageItem key={msg.id} msg={msg} />),
    [messages]
  )
  const scenarioOptions = useMemo(
    () => SCENARIOS.map((s) => ({ value: s.value, label: t(`app.scenario.options.${s.key}`) })),
    [t]
  )
  const modeOptions = useMemo(
    () => MODES.map((m) => ({ value: m.value, label: c.modes[m.key] })),
    [c.modes]
  )
  const roundsOptions = useMemo(
    () => [
      { value: '1', label: '1' },
      { value: '2', label: '2' },
      { value: '3', label: '3' },
    ],
    []
  )

  if (!authChecked) {
    return (
      <div className="chat-app">
        <div className="chat-app__shell chat-app__shell--loading">
          <p className="chat-app__loading-text">{c.loading}</p>
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
              {c.navHome}
            </Link>
          </header>
          <section className="chat-app__auth">
            <h1 className="chat-app__auth-title">{c.authTitle}</h1>
            <p className="chat-app__auth-lede">
              {c.authLead}
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
              {c.continueGoogle}
            </button>
          </section>
        </div>
      </div>
    )
  }

  return (
    <div className="chat-app">
      <div className="chat-app__shell chat-app__shell--wide">
        <header className="chat-app__header">
          <div className="chat-app__brand">
            <Link to="/" className="chat-app__logo">
              Consensia
            </Link>
            <span className="chat-app__badge">{c.beta}</span>
          </div>
          <div className="chat-app__header-actions">
            {statusText ? <span className="chat-app__meta">{statusText}</span> : null}
            <button
              type="button"
              className={`chat-app__burger${mobileSidebarOpen ? ' chat-app__burger--open' : ''}`}
              aria-label={mobileSidebarOpen ? c.closeHistory : c.openHistory}
              aria-expanded={mobileSidebarOpen ? 'true' : 'false'}
              aria-controls="chat-app-mobile-sidebar"
              onClick={() => setMobileSidebarOpen((v) => !v)}
            >
              <span className="chat-app__burger-line" aria-hidden="true" />
              <span className="chat-app__burger-line" aria-hidden="true" />
              <span className="chat-app__burger-line" aria-hidden="true" />
            </button>
            <button type="button" className="chat-app__btn chat-app__btn--new-chat" onClick={handleNewSession}>
              {c.newChat}
            </button>
            <div className="chat-app__profile" ref={profileRef}>
              <button
                type="button"
                className="chat-app__profile-btn"
                onClick={() => setProfileOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={profileOpen ? 'true' : 'false'}
              >
                <span className="chat-app__profile-avatar" aria-hidden="true">
                  <svg
                    className="chat-app__profile-avatar-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M12 12.25C9.95 12.25 8.25 10.55 8.25 8.5C8.25 6.45 9.95 4.75 12 4.75C14.05 4.75 15.75 6.45 15.75 8.5C15.75 10.55 14.05 12.25 12 12.25Z"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M5.75 18.5C5.75 15.96 8.54 14 12 14C15.46 14 18.25 15.96 18.25 18.5"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              {profileOpen ? (
                <div className="chat-app__profile-pop" role="menu">
                  <div className="chat-app__profile-head">
                    <div className="chat-app__profile-title">{getUserLabel(user, c.profileLabel)}</div>
                    {getCredits(user) != null ? (
                      <div className="chat-app__profile-credits-line">
                        <div className="chat-app__profile-sub">{c.credits.replace('{{count}}', String(getCredits(user)))}</div>
                        <div className="chat-app__topup-inline">
                          <input
                            className="chat-app__topup-input"
                            type="number"
                            min={1}
                            step={1}
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            aria-label={c.topUpAmountAria}
                          />
                          <span className="chat-app__topup-preview">{c.creditsShort.replace('{{count}}', String(creditsPreview))}</span>
                          <button
                            type="button"
                            className="chat-app__topup-btn"
                            onClick={handleTopUp}
                            disabled={topUpLoading}
                            title={c.topUpRate.replace('{{multiplier}}', String(promoMultiplier))}
                          >
                            {topUpLoading ? '...' : c.topUpButton}
                          </button>
                        </div>
                      </div>
                    ) : null}
                    {topUpError ? <div className="chat-app__profile-sub">{topUpError}</div> : null}
                  </div>

                  <div className="chat-app__profile-row">
                    <label className="chat-app__toggle">
                      <input
                        type="checkbox"
                        checked={dataCollection}
                        onChange={(e) => setDataCollection(e.target.checked)}
                      />
                      <span className="chat-app__toggle-ui" aria-hidden="true" />
                      <span>{c.dataCollection}</span>
                    </label>
                  </div>

                  <div className="chat-app__profile-actions">
                    <button type="button" className="chat-app__profile-logout" onClick={handleLogout}>
                      {c.logout}
                    </button>
                    <Link to="/" className="chat-app__profile-link" onClick={() => setProfileOpen(false)}>
                      {c.home}
                    </Link>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        </header>

        <div
          className={`chat-app__sidebar-backdrop${mobileSidebarOpen ? ' chat-app__sidebar-backdrop--visible' : ''}`}
          aria-hidden="true"
          onClick={() => setMobileSidebarOpen(false)}
        />

        <div className="chat-app__layout">
          <aside
            id="chat-app-mobile-sidebar"
            className={`chat-app__sidebar${mobileSidebarOpen ? ' chat-app__sidebar--open' : ''}`}
            aria-label={c.historyAria}
          >
            <div className="chat-app__sidebar-head">
              <div className="chat-app__sidebar-title">{c.historyTitle}</div>
              <button type="button" className="chat-app__sidebar-new" onClick={handleNewSession} title={c.newChat}>
                +
              </button>
              <button
                type="button"
                className="chat-app__sidebar-close"
                onClick={() => setMobileSidebarOpen(false)}
                aria-label={c.closeMenu}
              >
                ×
              </button>
            </div>
            <button
              type="button"
              className="chat-app__sidebar-mobile-new chat-app__sidebar-mobile-new--top"
              onClick={handleNewSession}
            >
              {c.newChat}
            </button>
            <div className="chat-app__sidebar-list" role="list">
              {sessionsLoading && !sessionsForRender.length ? (
                <div className="chat-app__sidebar-empty">{c.sessionsLoading}</div>
              ) : sessionsError ? (
                <div className="chat-app__sidebar-empty" role="alert">
                  {sessionsError}
                </div>
              ) : sessionsForRender.length ? (
                sessionsForRender.map((h) => {
                  const isActive = activeSid && h.id === activeSid
                  const titleText = visibleSessionTitle(h.title)
                  return (
                    <div
                      key={h.id}
                      className={
                        'chat-app__sidebar-item' + (isActive ? ' chat-app__sidebar-item--active' : '')
                      }
                      role="listitem"
                      title={titleText || ''}
                    >
                      <button
                        type="button"
                        className="chat-app__sidebar-open"
                        onClick={() => openHistorySession(h.id)}
                      >
                        <div className="chat-app__sidebar-item-title">
                          {titleText}
                        </div>
                        <div className="chat-app__sidebar-item-meta">
                          <span>{formatWhen(h.createdAt)}</span>
                          <span className="chat-app__sidebar-item-side">
                            {scenarioLabel(h.scenario || 'CODE_REVIEW', t)} · {modeLabel(h.mode, c)}
                          </span>
                        </div>
                      </button>
                      <button
                        type="button"
                        className="chat-app__sidebar-delete"
                        onClick={() => deleteHistorySession(h.id)}
                        aria-label={c.deleteSessionAria}
                        title={c.deleteTitle}
                      >
                        ×
                      </button>
                    </div>
                  )
                })
              ) : (
                <div className="chat-app__sidebar-empty">{c.historyEmpty}</div>
              )}
            </div>
            <div className="chat-app__sidebar-mobile-footer">
              <div className="chat-app__profile chat-app__profile--mobile-drawer">
                <div className="chat-app__profile-pop chat-app__profile-pop--mobile-inline" role="menu">
                    <div className="chat-app__profile-head">
                      <div className="chat-app__profile-title">{getUserLabel(user, c.profileLabel)}</div>
                      {getCredits(user) != null ? (
                        <div className="chat-app__profile-credits-line">
                          <div className="chat-app__profile-sub">{c.credits.replace('{{count}}', String(getCredits(user)))}</div>
                          <div className="chat-app__topup-inline">
                            <input
                              className="chat-app__topup-input"
                              type="number"
                              min={1}
                              step={1}
                              value={topUpAmount}
                              onChange={(e) => setTopUpAmount(e.target.value)}
                              aria-label={c.topUpAmountAria}
                            />
                            <span className="chat-app__topup-preview">{c.creditsShort.replace('{{count}}', String(creditsPreview))}</span>
                            <button
                              type="button"
                              className="chat-app__topup-btn"
                              onClick={handleTopUp}
                              disabled={topUpLoading}
                              title={c.topUpRate.replace('{{multiplier}}', String(promoMultiplier))}
                            >
                              {topUpLoading ? '...' : c.topUpButton}
                            </button>
                          </div>
                        </div>
                      ) : null}
                      {topUpError ? <div className="chat-app__profile-sub">{topUpError}</div> : null}
                    </div>

                    <div className="chat-app__profile-row">
                      <label className="chat-app__toggle">
                        <input
                          type="checkbox"
                          checked={dataCollection}
                          onChange={(e) => setDataCollection(e.target.checked)}
                        />
                        <span className="chat-app__toggle-ui" aria-hidden="true" />
                        <span>{c.dataCollection}</span>
                      </label>
                    </div>

                    <div className="chat-app__profile-actions">
                      <button type="button" className="chat-app__profile-logout" onClick={handleLogout}>
                        {c.logout}
                      </button>
                      <Link
                        to="/"
                        className="chat-app__profile-link"
                        onClick={() => setMobileSidebarOpen(false)}
                      >
                        {c.home}
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          </aside>

          <main className="chat-app__main">
            {showSetup ? (
              <section className="chat-app__setup">
                <form className="chat-app__setup-card" onSubmit={handleStart}>
                  <h2 className="chat-app__setup-title">{c.setupTitle}</h2>
                  <p className="chat-app__setup-lede">
                    {setupLeadText}
                  </p>
                  <div className={`chat-app__row${canChooseRounds ? '' : ' chat-app__row--two'}`}>
                    <PrettySelect
                      id="scenario"
                      label={t('app.scenario.label')}
                      value={scenario}
                      options={scenarioOptions}
                      onChange={setScenario}
                    />
                    <PrettySelect
                      id="mode"
                      label={c.modeLabel}
                      value={mode}
                      options={modeOptions}
                      onChange={setMode}
                    />
                    {canChooseRounds ? (
                      <PrettySelect
                        id="rounds"
                        label={c.roundsLabel}
                        value={String(rounds)}
                        options={roundsOptions}
                        onChange={(next) => setRounds(Number(next))}
                      />
                    ) : null}
                  </div>
                  {isCodeReviewScenario ? (
                    <div className="chat-app__field chat-app__field--code">
                      <label htmlFor="code">{c.codeLabel}</label>
                      <textarea
                        id="code"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        spellCheck={false}
                      />
                      <div className="chat-app__attach">
                        <label className="chat-app__attach-btn">
                          <input
                            type="file"
                            multiple
                            onChange={handlePickFiles}
                            accept=".js,.jsx,.ts,.tsx,.py,.go,.rs,.java,.kt,.cs,.cpp,.c,.h,.hpp,.json,.yml,.yaml,.toml,.md,.txt,.html,.css,.scss,.sql"
                          />
                          {c.attachFiles}
                        </label>
                        {attachError ? (
                          <div className="chat-app__attach-error" role="alert">
                            {attachError}
                          </div>
                        ) : null}
                        {attached.length ? (
                          <div className="chat-app__attach-list" role="list">
                            {attached.map((f) => (
                              <div key={`${f.name}:${f.size}`} className="chat-app__attach-item" role="listitem">
                                <span className="chat-app__attach-name">{f.name}</span>
                                <button
                                  type="button"
                                  className="chat-app__attach-remove"
                                  onClick={() => removeAttachment(f.name, f.size)}
                                  aria-label={c.removeFileAria.replace('{{name}}', String(f.name))}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : null}
                  <div className="chat-app__field chat-app__field--compact">
                    <label htmlFor="ctx">
                      {isCodeReviewScenario ? c.contextLabelOptional : c.contextLabelRequired}
                    </label>
                    {isCodeReviewScenario ? (
                      <input
                        id="ctx"
                        value={context}
                        onChange={(e) => setContext(e.target.value)}
                        placeholder={c.contextPlaceholder}
                        required={false}
                      />
                    ) : (
                      <>
                        <div className="chat-app__context-with-attach">
                          <label
                            className="chat-app__attach-clip-btn"
                            aria-label={c.attachDocuments}
                            title={c.attachDocuments}
                          >
                            <input type="file" multiple onChange={handlePickDocuments} />
                            <svg
                              className="chat-app__attach-clip-icon"
                              viewBox="0 0 24 24"
                              fill="none"
                              aria-hidden="true"
                            >
                              <path
                                d="M21.44 11.05L12.95 19.54C10.8 21.69 7.31 21.69 5.16 19.54C3.01 17.39 3.01 13.9 5.16 11.75L13.64 3.27C15.02 1.89 17.25 1.89 18.63 3.27C20.01 4.64 20.01 6.88 18.63 8.26L10.15 16.74C9.54 17.36 8.54 17.36 7.92 16.74C7.3 16.13 7.3 15.13 7.92 14.51L15.7 6.73"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </label>
                          <input
                            id="ctx"
                            value={context}
                            onChange={(e) => setContext(e.target.value)}
                            placeholder={c.contextPlaceholder}
                            required
                          />
                        </div>
                        {documentsError ? (
                          <div className="chat-app__attach-error" role="alert">
                            {documentsError}
                          </div>
                        ) : null}
                        {documents.length ? (
                          <div className="chat-app__attach-list chat-app__attach-list--documents" role="list">
                            {documents.map((f) => (
                              <div key={`${f.name}:${f.size}`} className="chat-app__attach-item" role="listitem">
                                <span className="chat-app__attach-name">{f.name}</span>
                                <button
                                  type="button"
                                  className="chat-app__attach-remove"
                                  onClick={() => removeDocument(f.name, f.size)}
                                  aria-label={c.removeFileAria.replace('{{name}}', String(f.name))}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </>
                    )}
                  </div>
                  {sessionFromUrl ? (
                    <p className="chat-app__hint">{c.resumeHint}</p>
                  ) : null}
                  <button type="submit" className="chat-app__submit" disabled={busy}>
                    {busy ? c.status.connecting : c.connectBtn}
                  </button>
                </form>
              </section>
            ) : null}

            {!showSetup || messages.length > 0 ? (
              <div className="chat-app__messages-wrap">
                {sessionLoading ? (
                  <p className="chat-app__hint" aria-live="polite">
                    {c.loadingSession}
                  </p>
                ) : null}
                {sessionLoadError ? (
                  <p className="chat-app__hint" role="alert">
                    {sessionLoadError}
                  </p>
                ) : null}
                <div ref={messagesRef} className="chat-app__messages" role="log" aria-live="polite">
                  {renderedMessages}
                  <div ref={endRef} />
                </div>

                <div className="chat-app__composer">
                  {waitingForAi ? (
                    <div className="chat-app__typing" aria-live="polite" aria-label={c.generatingAria}>
                      <span className="chat-app__typing-dot" />
                      <span className="chat-app__typing-dot" />
                      <span className="chat-app__typing-dot" />
                      <span className="chat-app__typing-text">{c.generatingText}</span>
                    </div>
                  ) : null}
                  {hasFinalVerdict && (usageEvents.length > 0 || restoredSpentCredits != null) ? (
                    <div className="chat-app__spent-credits" aria-live="polite">
                      <span className="chat-app__spent-credits-label">{c.spentCredits}</span>
                      <strong className="chat-app__spent-credits-value">{spentCredits}</strong>
                    </div>
                  ) : null}
                  <ChatComposer
                    disabled={inputLocked || status !== 'open'}
                    placeholder={
                      inputLocked ? c.placeholderLocked : c.placeholderOpen
                    }
                    onSend={handleSendMessage}
                  />
                </div>
              </div>
            ) : null}
          </main>
        </div>

        {lastError ? (
          <p className="chat-app__hint" role="alert">
            {lastError}
          </p>
        ) : null}
      </div>
    </div>
  )
}
