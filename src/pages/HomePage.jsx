import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import '../App.scss'
import { Reveal } from '../components/Reveal.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import TopBurgerMenu from '../components/TopBurgerMenu.jsx'
import MobileProfilePanel from '../components/MobileProfilePanel.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { apiFetch } from '../services/http.js'
import { getCredits, getUserLabel } from '../services/profileUtils.js'

const ConsensiaScene = lazy(() =>
  import('../components/ConsensiaScene').then((m) => ({ default: m.ConsensiaScene }))
)

const NAV_MOBILE_MAX_PX = 768
const DATA_COLLECTION_KEY = 'consensia_data_collection_v1'

export default function HomePage() {
  const { t } = useTranslation()
  const { isAuthenticated, user, loginWithGoogle, logout } = useAuth()
  const profileLabel = t('home.profile.label')
  const userLabel = getUserLabel(user) || profileLabel
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
    const mq = window.matchMedia(`(min-width: ${NAV_MOBILE_MAX_PX}px)`)
    const closeIfDesktop = () => {
      if (mq.matches) setMobileMenuOpen(false)
    }
    mq.addEventListener('change', closeIfDesktop)
    return () => {
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
      setTopUpError(t('home.profile.topUp.minAmount'))
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
      if (!r.ok) throw new Error(data?.detail || t('home.profile.topUp.createPaymentError'))
      if (!data?.checkout_url) throw new Error(t('home.profile.topUp.checkoutUrlError'))
      window.location.href = data.checkout_url
    } catch (e) {
      setTopUpError(e?.message || String(e))
    } finally {
      setTopUpLoading(false)
    }
  }

  const closeMobileMenu = () => setMobileMenuOpen(false)
  const mobileProfile = isAuthenticated ? (
    <MobileProfilePanel
      user={user}
      topUpAmount={topUpAmount}
      onTopUpAmountChange={setTopUpAmount}
      creditsPreview={creditsPreview}
      onTopUp={handleTopUp}
      topUpLoading={topUpLoading}
      promoMultiplier={promoMultiplier}
      topUpError={topUpError}
      dataCollection={dataCollection}
      onDataCollectionChange={setDataCollection}
      onLogout={() => {
        logout()
        closeMobileMenu()
      }}
    />
  ) : null

  return (
    <div className="app">
      <section className="hero" aria-label={t('home.a11y.hero')}>
        <div className="hero__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <ConsensiaScene animationsEnabled={animationsEnabled} />
          </Suspense>
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <header className="top">
            <span className="logo">{t('common.brand')}</span>
            <div className="top__end">
              <nav className="top__nav top__nav--desktop" aria-label={t('home.a11y.pageNav')}>
                <Link to="/about">{t('nav.about')}</Link>
                <Link to="/models">{t('nav.models')}</Link>
                <Link to="/developers">{t('nav.developers')}</Link>
              </nav>
              <LanguageSwitcher className="top__lang top__lang--desktop" />
              {isAuthenticated ? (
                <div className="chat-app__profile" ref={profileRef}>
                  <button
                    type="button"
                    className="chat-app__profile-btn"
                    onClick={() => setProfileOpen((v) => !v)}
                    aria-haspopup="menu"
                    aria-expanded={profileOpen ? 'true' : 'false'}
                    aria-label={t('home.profile.open')}
                  >
                    <span className="chat-app__profile-avatar" aria-hidden="true">
                      <svg className="chat-app__profile-avatar-icon" viewBox="0 0 24 24" fill="none">
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
                        <div className="chat-app__profile-title">{userLabel}</div>
                        {getCredits(user) != null ? (
                          <div className="chat-app__profile-credits-line">
                            <div className="chat-app__profile-sub">
                              {t('home.profile.credits', { count: getCredits(user) })}
                            </div>
                            <div className="chat-app__topup-inline">
                              <input
                                className="chat-app__topup-input"
                                type="number"
                                min={1}
                                step={1}
                                value={topUpAmount}
                                onChange={(e) => setTopUpAmount(e.target.value)}
                                aria-label={t('home.profile.topUp.amountAria')}
                              />
                              <span className="chat-app__topup-preview">
                                {t('home.profile.topUp.preview', { count: creditsPreview })}
                              </span>
                              <button
                                type="button"
                                className="chat-app__topup-btn"
                                onClick={handleTopUp}
                                disabled={topUpLoading}
                                title={t('home.profile.topUp.rateTitle', { multiplier: promoMultiplier })}
                              >
                                {topUpLoading ? '...' : t('home.profile.topUp.button')}
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
                          <span>{t('home.profile.dataCollection')}</span>
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
                          {t('home.profile.logout')}
                        </button>
                      </div> 
                    </div>
                  ) : null}
                </div>
              ) : (
                <button type="button" className="top__cta" onClick={loginWithGoogle}>
                  {t('home.auth.login')}
                </button>
              )}
              <button
                type="button"
                className="motion-toggle motion-toggle--desktop"
                aria-pressed={animationsEnabled}
                title={t('home.hero.motionToggleTitle')}
                onClick={() => setAnimationsEnabled((v) => !v)}
              >
                {animationsEnabled ? t('home.hero.stopBackground') : t('home.hero.animateBackground')}
              </button>
              <TopBurgerMenu
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen((o) => !o)}
                onClose={closeMobileMenu}
                menuId="top-mobile-menu"
                openAriaLabel={t('home.menu.open')}
                closeAriaLabel={t('home.menu.close')}
                menuAriaLabel={t('home.menu.label')}
                main={
                  <>
                    <nav className="top__menu-nav" aria-label={t('home.a11y.pageNav')}>
                      <Link to="/about" onClick={closeMobileMenu}>
                        {t('nav.about')}
                      </Link>
                      <Link to="/models" onClick={closeMobileMenu}>
                        {t('nav.models')}
                      </Link>
                      <Link to="/developers" onClick={closeMobileMenu}>
                        {t('nav.developers')}
                      </Link>
                    </nav>
                    {!isAuthenticated ? (
                      <button
                        type="button"
                        className="motion-toggle motion-toggle--menu"
                        onClick={() => {
                          loginWithGoogle()
                          closeMobileMenu()
                        }}
                      >
                        {t('home.auth.login')}
                      </button>
                    ) : null}
                  </>
                }
              >
                <LanguageSwitcher className="top__lang top__lang--menu" />
                <button
                  type="button"
                  className={`motion-toggle motion-toggle--menu${isAuthenticated ? ' motion-toggle--menu-with-profile' : ''}`}
                  aria-pressed={animationsEnabled}
                  title={t('home.hero.motionToggleTitle')}
                  onClick={() => setAnimationsEnabled((v) => !v)}
                >
                  {animationsEnabled ? t('home.hero.stopBackground') : t('home.hero.animateBackground')}
                </button>
                {isAuthenticated ? <div className="top__menu-profile">{mobileProfile}</div> : null}
              </TopBurgerMenu>
            </div>
          </header>

          <div className="hero__main">
            <p className="eyebrow">{t('home.hero.eyebrow')}</p>
            <h1 className="title">
              {t('home.hero.titleLine1')}
              <span className="title__line">{t('home.hero.titleLine2')}</span>
            </h1>
            <p className="lede">{t('home.hero.lede')}</p>
            <div className="cta">
              <a className="btn btn--primary" href="/app">
                {t('home.hero.start')}
              </a>
              <a className="btn btn--ghost" href="/github-actions">
                {t('home.hero.howItWorks')}
              </a>
            </div>
            <ul className="hero__tags" aria-label={t('home.a11y.keyFeatures')}>
              <li>{t('home.hero.tags.models')}</li>
              <li>{t('home.hero.tags.dialog')}</li>
              <li>{t('home.hero.tags.consensus')}</li>
            </ul>
          </div>

          <p className="scroll-hint">{t('home.hero.scrollHint')}</p>
        </div>
      </section>

      <section className="section section--strip" aria-label={t('home.strip.a11y')}>
        <Reveal>
          <div className="section__inner">
            <div className="strip">
              <div className="strip__item">
                <span className="strip__label">{t('home.strip.idea.label')}</span>
                <p className="strip__text">{t('home.strip.idea.text')}</p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">{t('home.strip.difference.label')}</span>
                <p className="strip__text">{t('home.strip.difference.text')}</p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">{t('home.strip.result.label')}</span>
                <p className="strip__text">{t('home.strip.result.text')}</p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how" className="section section--how">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">{t('home.how.title')}</h2>
            <p className="section__lead">{t('home.how.lead')}</p>
            <ol className="steps">
              <li>
                <span className="steps__num">01</span>
                <h3>{t('home.how.steps.request.title')}</h3>
                <p>{t('home.how.steps.request.text')}</p>
              </li>
              <li>
                <span className="steps__num">02</span>
                <h3>{t('home.how.steps.dialog.title')}</h3>
                <p>{t('home.how.steps.dialog.text')}</p>
              </li>
              <li>
                <span className="steps__num">03</span>
                <h3>{t('home.how.steps.result.title')}</h3>
                <p>{t('home.how.steps.result.text')}</p>
              </li>
            </ol>
          </div>
        </Reveal>
      </section>

      <section id="features" className="section section--features">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">{t('home.features.title')}</h2>
            <p className="section__lead">{t('home.features.lead')}</p>
            <div className="cards">
              <article className="card">
                <h3>{t('home.features.cards.depth.title')}</h3>
                <p>{t('home.features.cards.depth.text')}</p>
              </article>
              <article className="card">
                <h3>{t('home.features.cards.transparency.title')}</h3>
                <p>{t('home.features.cards.transparency.text')}</p>
              </article>
              <article className="card">
                <h3>{t('home.features.cards.quality.title')}</h3>
                <p>{t('home.features.cards.quality.text')}</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="cases" className="section section--cases">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">{t('home.cases.title')}</h2>
            <p className="section__lead">{t('home.cases.lead')}</p>
            <div className="case-grid">
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>{t('home.cases.items.code.title')}</h3>
                <p>{t('home.cases.items.code.text')}</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>{t('home.cases.items.writing.title')}</h3>
                <p>{t('home.cases.items.writing.text')}</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>{t('home.cases.items.analytics.title')}</h3>
                <p>{t('home.cases.items.analytics.text')}</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>{t('home.cases.items.learning.title')}</h3>
                <p>{t('home.cases.items.learning.text')}</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <aside className="quote-block" aria-label={t('home.quote.a11y')}>
        <Reveal>
          <blockquote className="quote-block__inner">
            <p>
              <Trans i18nKey="home.quote.text" components={{ strong: <strong /> }} />
            </p>
          </blockquote>
        </Reveal>
      </aside>

      <section className="cta-band" id="start" aria-label={t('home.cta.a11y')}>
        <Reveal>
          <div className="cta-band__inner">
            <div className="cta-band__copy">
              <h2 className="cta-band__title">{t('home.cta.title')}</h2>
              <p className="cta-band__sub">{t('home.cta.sub')}</p>
            </div>
            <a className="btn btn--primary btn--lg" href="/app">
              {t('home.cta.openApp')}
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
