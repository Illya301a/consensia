import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.scss'
import { Reveal } from '../components/Reveal.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { apiFetch } from '../services/http.js'

const ConsensiaScene = lazy(() =>
  import('../components/ConsensiaScene').then((m) => ({ default: m.ConsensiaScene }))
)

const NAV_MOBILE_MAX_PX = 768
const DATA_COLLECTION_KEY = 'consensia_data_collection_v1'

function getUserLabel(user) {
  if (!user || typeof user !== 'object') return 'Профиль'
  return (
    user.email ||
    user.name ||
    user.full_name ||
    user.display_name ||
    user.given_name ||
    'Профиль'
  )
}

function getCredits(user) {
  if (!user || typeof user !== 'object') return null
  const candidates = [user.credits, user.credit_balance, user.balance, user.remaining_credits]
  for (const v of candidates) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}

export default function HomePage() {
  const { isAuthenticated, user, loginWithGoogle, logout } = useAuth()
  const avatarLetter = String(getUserLabel(user)).slice(0, 1).toUpperCase()
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
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

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mq = window.matchMedia(`(min-width: ${NAV_MOBILE_MAX_PX}px)`)
    const closeIfDesktop = () => {
      if (mq.matches) setMobileMenuOpen(false)
    }
    mq.addEventListener('change', closeIfDesktop)
    return () => {
      document.body.style.overflow = prevOverflow
      mq.removeEventListener('change', closeIfDesktop)
    }
  }, [mobileMenuOpen])

  useEffect(() => {
    if (!profileOpen) return
    const onDown = (ev) => {
      const el = profileRef.current
      if (!el) return
      if (ev.target instanceof Node && !el.contains(ev.target)) setProfileOpen(false)
    }
    const onKey = (ev) => {
      if (ev.key === 'Escape') setProfileOpen(false)
    }
    window.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [profileOpen])

  useEffect(() => {
    try {
      localStorage.setItem(DATA_COLLECTION_KEY, dataCollection ? 'true' : 'false')
    } catch {
      /* ignore */
    }
  }, [dataCollection])

  useEffect(() => {
    if (!isAuthenticated) return
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
  }, [isAuthenticated])

  const amountNum = Number(topUpAmount)
  const promoMultiplier =
    Number(promoInfo?.multiplier) > 0 ? Number(promoInfo.multiplier) : 200
  const creditsPreview =
    Number.isFinite(amountNum) && amountNum > 0
      ? Math.floor(amountNum * promoMultiplier)
      : 0

  const handleTopUp = async () => {
    const amount = Number(topUpAmount)
    if (!Number.isFinite(amount) || amount < 1) {
      setTopUpError('Минимальная сумма пополнения — 1$')
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
      if (!r.ok) throw new Error(data?.detail || 'Ошибка создания платежа')
      if (!data?.checkout_url) throw new Error('Stripe checkout URL не получен')
      window.location.href = data.checkout_url
    } catch (e) {
      setTopUpError(e?.message || String(e))
    } finally {
      setTopUpLoading(false)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)
  const mobileProfile = isAuthenticated ? (
    <div className="chat-app__profile-pop chat-app__profile-pop--menu" role="menu">
      <div className="chat-app__profile-head">
        <div className="top__menu-profile-user">
          <span className="chat-app__profile-avatar" aria-hidden="true">
            {avatarLetter}
          </span>
          <div>
            <div className="chat-app__profile-title">{getUserLabel(user)}</div>
            {getCredits(user) != null ? (
              <div className="chat-app__profile-sub">Кредиты: {getCredits(user)}</div>
            ) : null}
          </div>
        </div>
        {getCredits(user) != null ? (
          <div className="chat-app__profile-credits-line">
            <div className="chat-app__topup-inline">
              <input
                className="chat-app__topup-input"
                type="number"
                min={1}
                step={1}
                value={topUpAmount}
                onChange={(e) => setTopUpAmount(e.target.value)}
                aria-label="Сумма пополнения в долларах"
              />
              <span className="chat-app__topup-preview">{creditsPreview} кр.</span>
              <button
                type="button"
                className="chat-app__topup-btn"
                onClick={handleTopUp}
                disabled={topUpLoading}
                title={`Курс: ${promoMultiplier} кредитов за $1`}
              >
                {topUpLoading ? '...' : 'Пополнить'}
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
          <span>Сбор данных</span>
        </label>
      </div>
      <div className="chat-app__profile-actions">
        <button
          type="button"
          className="chat-app__profile-logout"
          onClick={() => {
            logout()
            closeMobileMenu()
          }}
        >
          Выйти
        </button>
      </div>
    </div>
  ) : null

  return (
    <div className="app">
      <section className="hero" aria-label="Главный экран">
        <div className="hero__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <ConsensiaScene animationsEnabled={animationsEnabled} />
          </Suspense>
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <header className="top">
            <span className="logo">Consensia</span>
            <div className="top__end">
              <nav className="top__nav top__nav--desktop" aria-label="Навигация по странице">
                <a href="#how">Как это работает</a>
                <a href="#features">Возможности</a>
                <a href="#cases">Сценарии</a>
                {/* <Link to="/developers">Developers</Link> */}
              </nav>
              {isAuthenticated ? (
                <div className="chat-app__profile" ref={profileRef}>
                  <button
                    type="button"
                    className="chat-app__profile-btn"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen ? 'true' : 'false'}
                    aria-label="Открыть профиль"
                  >
                    <span className="chat-app__profile-avatar" aria-hidden="true">
                      {avatarLetter}
                    </span>
                  </button>
                  {profileOpen ? (
                    <div className="chat-app__profile-pop" role="menu">
                      <div className="chat-app__profile-head">
                        <div className="chat-app__profile-title">{getUserLabel(user)}</div>
                        {getCredits(user) != null ? (
                          <div className="chat-app__profile-credits-line">
                            <div className="chat-app__profile-sub">Кредиты: {getCredits(user)}</div>
                            <div className="chat-app__topup-inline">
                              <input
                                className="chat-app__topup-input"
                                type="number"
                                min={1}
                                step={1}
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                aria-label="Сумма пополнения в долларах"
                              />
                              <span className="chat-app__topup-preview">{creditsPreview} кр.</span>
                              <button
                                type="button"
                                className="chat-app__topup-btn"
                                onClick={handleTopUp}
                                disabled={topUpLoading}
                                title={`Курс: ${promoMultiplier} кредитов за $1`}
                              >
                                {topUpLoading ? '...' : 'Пополнить'}
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
                          <span>Сбор данных</span>
                        </label>
                      </div>
                      <div className="chat-app__profile-actions">
                        <button
                          type="button"
                          className="chat-app__profile-logout"
                          onClick={() => {
                            setProfileOpen(false)
                            logout()
                          }}
                        >
                          Выйти
                        </button>
                      </div> 
                    </div>
                  ) : null}
                </div>
              ) : (
                <button type="button" className="top__cta" onClick={loginWithGoogle}>
                  Войти
                </button>
              )}
              <button
                type="button"
                className="motion-toggle motion-toggle--desktop"
                aria-pressed={animationsEnabled}
                title="Только анимация заднего 3D-слоя, не страница"
                onClick={() => setAnimationsEnabled((v) => !v)}
              >
                {animationsEnabled ? 'Остановить фон' : 'Анимировать фон'}
              </button>
              <button
                type="button"
                className={`top__burger${mobileMenuOpen ? ' top__burger--open' : ''}`}
                aria-expanded={mobileMenuOpen}
                aria-controls="top-mobile-menu"
                aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                <span className="top__burger-line" aria-hidden="true" />
                <span className="top__burger-line" aria-hidden="true" />
                <span className="top__burger-line" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            className={`top__menu-backdrop${mobileMenuOpen ? ' top__menu-backdrop--visible' : ''}`}
            aria-hidden="true"
            onClick={closeMobileMenu}
          />

          <div
            id="top-mobile-menu"
            className={`top__menu-panel${mobileMenuOpen ? ' top__menu-panel--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
          >
            <div className="top__menu-main">
              <nav className="top__menu-nav" aria-label="Навигация по странице">
                <a href="#how" onClick={closeMobileMenu}>
                  Как это работает
                </a>
                <a href="#features" onClick={closeMobileMenu}>
                  Возможности
                </a>
                <a href="#cases" onClick={closeMobileMenu}>
                  Сценарии
                </a>
                {/* <Link to="/developers" onClick={closeMobileMenu}>
                  Developers
                </Link> */}
              </nav>
              {!isAuthenticated ? (
                <button
                  type="button"
                  className="top__cta top__cta--menu"
                  onClick={() => {
                    loginWithGoogle()
                    closeMobileMenu()
                  }}
                >
                  Войти
                </button>
              ) : null}
            </div>
            <button
              type="button"
              className="motion-toggle motion-toggle--menu"
              aria-pressed={animationsEnabled}
              title="Только анимация заднего 3D-слоя, не страница"
              onClick={() => setAnimationsEnabled((v) => !v)}
            >
              {animationsEnabled ? 'Остановить фон' : 'Анимировать фон'}
            </button>
            {isAuthenticated ? <div className="top__menu-profile">{mobileProfile}</div> : null}
          </div>

          <div className="hero__main">
            <p className="eyebrow">Мульти-модельный интеллект</p>
            <h1 className="title">
              Один ответ
              <span className="title__line">из согласия нейросетей</span>
            </h1>
            <p className="lede">
              Несколько моделей обсуждают задачу и сходятся к лучшему решению —
              вы получаете ответ, собранный и проверенный в Consensia.
            </p>
            <div className="cta">
              <a className="btn btn--primary" href="/app">
                Начать
              </a>
              <a className="btn btn--ghost" href="#how">
                Как это работает
              </a>
            </div>
            <ul className="hero__tags" aria-label="Ключевые особенности">
              <li>Несколько моделей</li>
              <li>Внутренний диалог</li>
              <li>Один согласованный ответ</li>
            </ul>
          </div>

          <p className="scroll-hint">Листайте вниз</p>
        </div>
      </section>

      <section className="section section--strip" aria-label="В двух словах">
        <Reveal>
          <div className="section__inner">
            <div className="strip">
              <div className="strip__item">
                <span className="strip__label">Идея</span>
                <p className="strip__text">
                  Одна задача — разные «взгляды» моделей, затем сведение к общему выводу.
                </p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">Отличие</span>
                <p className="strip__text">
                  Не голосование по кнопке, а обмен аргументами и уточнениями между нейросетями.
                </p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">Результат</span>
                <p className="strip__text">
                  Меньше случайных ошибок и «уверенных» неточностей одной модели.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how" className="section section--how">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Как это работает</h2>
            <p className="section__lead">
              Три шага от запроса до ответа, который прошёл внутреннюю проверку.
            </p>
            <ol className="steps">
              <li>
                <span className="steps__num">01</span>
                <h3>Запрос</h3>
                <p>Вы формулируете задачу — как обычному ассистенту.</p>
              </li>
              <li>
                <span className="steps__num">02</span>
                <h3>Диалог моделей</h3>
                <p>
                  Несколько нейросетей обмениваются выводами и уточняют друг друга.
                </p>
              </li>
              <li>
                <span className="steps__num">03</span>
                <h3>Итог</h3>
                <p>Consensia отдаёт один согласованный, проверенный ответ.</p>
              </li>
            </ol>
          </div>
        </Reveal>
      </section>

      <section id="features" className="section section--features">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Возможности</h2>
            <p className="section__lead">
              Всё, что нужно, чтобы доверять ответу — не только его тексту, но и пути к нему.
            </p>
            <div className="cards">
              <article className="card">
                <h3>Глубина</h3>
                <p>Слабые места одной модели компенсируются сильными сторонами другой.</p>
              </article>
              <article className="card">
                <h3>Прозрачность</h3>
                <p>Видно, как пришли к итогу — не «чёрный ящик», а совместный разбор.</p>
              </article>
              <article className="card">
                <h3>Качество</h3>
                <p>Фокус на одном лучшем ответе, а не на потоке несогласованных версий.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="cases" className="section section--cases">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Где это пригодится</h2>
            <p className="section__lead">
              Любая задача, где важны точность, разные углы зрения и аккуратные формулировки.
            </p>
            <div className="case-grid">
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Код и архитектура</h3>
                <p>Ревью идеи, поиск краевых случаев, согласование стиля и ограничений стека.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Тексты и коммуникации</h3>
                <p>Письма, документы, тон голоса — когда важно не перегнуть и не упустить нюанс.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Аналитика и решения</h3>
                <p>Разбор вариантов, проверка допущений, более ровный и обоснованный итог.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Обучение и идеи</h3>
                <p>Разложить тему по полочкам, увидеть пробелы и собрать цельную картину.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <aside className="quote-block" aria-label="Позиционирование продукта">
        <Reveal>
          <blockquote className="quote-block__inner">
            <p>
              Мы не гонимся за самым «креативным» ответом любой ценой — мы нацелены на{' '}
              <strong>согласованный</strong> и <strong>проверяемый</strong> результат.
            </p>
          </blockquote>
        </Reveal>
      </aside>

      <section className="cta-band" id="start" aria-label="Призыв к действию">
        <Reveal>
          <div className="cta-band__inner">
            <div className="cta-band__copy">
              <h2 className="cta-band__title">Готовы к Consensia?</h2>
              <p className="cta-band__sub">
                Подставьте свой код или формулировку — так проще всего увидеть результат на практике.
              </p>
            </div>
            <a className="btn btn--primary btn--lg" href="/app">
              Открыть приложение
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
