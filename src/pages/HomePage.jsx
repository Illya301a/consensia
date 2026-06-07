import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import '../App.scss'
import { Reveal } from '../components/Reveal.jsx'
import LanguageSwitcher from '../components/LanguageSwitcher.jsx'
import ThemeSwitcher from '../components/ThemeSwitcher.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import TopBurgerMenu from '../components/TopBurgerMenu.jsx'
import BurgerMenuNav from '../components/BurgerMenuNav.jsx'
import ProfilePanel from '../components/ProfilePanel.jsx'
import MobileProfilePanel from '../components/MobileProfilePanel.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { apiFetch } from '../services/http.js'
import { useTopIslandScroll } from '../hooks/useTopIslandScroll.js'

const ConsensiaScene = lazy(() =>
  import('../components/ConsensiaScene').then((m) => ({ default: m.ConsensiaScene }))
)

const QUOTE_TRANS_COMPONENTS = {
  strong: <strong />,
  w: <span className="home-closing__conj" />,
}

const DATA_COLLECTION_KEY = 'consensia_data_collection_v1'
const PROFILE_POP_ANIMATION_MS = 180

export default function HomePage() {
  const { t } = useTranslation()
  const { isAuthenticated, user, loginWithGoogle, logout, switchAccount } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [profilePopRendered, setProfilePopRendered] = useState(false)
  const [profilePopClosing, setProfilePopClosing] = useState(false)
  const profileRef = useRef(null)
  const topRef = useRef(null)
  const { topIsland, topSlotHeight } = useTopIslandScroll(topRef)
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
    if (profileOpen) {
      setProfilePopRendered(true)
      setProfilePopClosing(false)
      return undefined
    }

    if (!profilePopRendered) return undefined

    setProfilePopClosing(true)
    const timeout = window.setTimeout(() => {
      setProfilePopRendered(false)
      setProfilePopClosing(false)
    }, PROFILE_POP_ANIMATION_MS)

    return () => {
      window.clearTimeout(timeout)
    }
  }, [profileOpen, profilePopRendered])

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
      onSwitchAccount={() => {
        closeMobileMenu()
        switchAccount()
      }}
      onNavigate={closeMobileMenu}
    />
  ) : null

  return (
    <div className="app app--home">
      <section className="hero" aria-label={t('home.a11y.hero')}>
        <div className="hero__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <ConsensiaScene />
          </Suspense>
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <div
            className={`top-slot${topSlotHeight > 0 ? ' top-slot--reserved' : ''}`}
            style={topSlotHeight > 0 ? { height: topSlotHeight } : undefined}
          >
            <header ref={topRef} className={`top${topIsland ? ' top--island' : ''}`}>
            <nav className="top__nav top__nav--desktop" aria-label={t('home.a11y.pageNav')}>
              <Link to="/about">{t('nav.about')}</Link>
              <Link to="/models">{t('nav.models')}</Link>
              <Link to="/developers">{t('nav.developers')}</Link>
            </nav>
            <span className="logo">{t('common.brand')}</span>
            <div className="top__end">
              <ThemeSwitcher className="top__theme top__theme--desktop" />
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
                  {profilePopRendered ? (
                    <ProfilePanel
                      className={profilePopClosing ? 'chat-app__profile-pop--closing' : ''}
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
                        setProfileOpen(false)
                        logout()
                      }}
                      onSwitchAccount={() => {
                        setProfileOpen(false)
                        switchAccount()
                      }}
                      onNavigate={() => setProfileOpen(false)}
                    />
                  ) : null}
                </div>
              ) : (
                <button type="button" className="top__cta" onClick={loginWithGoogle}>
                  {t('home.auth.login')}
                </button>
              )}
              <TopBurgerMenu
                isOpen={mobileMenuOpen}
                onToggle={() => setMobileMenuOpen((o) => !o)}
                onClose={closeMobileMenu}
                menuId="top-mobile-menu"
                openAriaLabel={t('home.menu.open')}
                closeAriaLabel={t('home.menu.close')}
                menuAriaLabel={t('home.menu.label')}
                main={
                  <BurgerMenuNav
                    ariaLabel={t('home.a11y.pageNav')}
                    onNavigate={closeMobileMenu}
                  />
                }
              >
                <LanguageSwitcher className="top__lang top__lang--menu" />
                <ThemeSwitcher className="top__theme top__theme--menu" />
                {!isAuthenticated ? (
                  <button
                    type="button"
                    className="top__cta top__cta--menu"
                    onClick={() => {
                      loginWithGoogle()
                      closeMobileMenu()
                    }}
                  >
                    {t('home.auth.login')}
                  </button>
                ) : null}
                {isAuthenticated ? <div className="top__menu-profile">{mobileProfile}</div> : null}
              </TopBurgerMenu>
            </div>
            </header>
          </div>

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
              <a className="btn btn--ghost" href="/ai-agent">{t('nav.aiAgent')}</a>
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

      <section className="home-closing" aria-label={t('home.quote.a11y')}>
        <Reveal>
          <div className="home-closing__grid">
            <figure className="home-closing__card">
              <blockquote className="home-closing__quote">
                <p>
                  <Trans
                    i18nKey="home.quote.illia.text"
                    components={QUOTE_TRANS_COMPONENTS}
                  />
                </p>
              </blockquote>
              <figcaption className="home-closing__cite">
                <span className="home-closing__cite-name">{t('home.quote.illia.author')}</span>
                <span className="home-closing__cite-role">{t('home.quote.illia.role')}</span>
              </figcaption>
            </figure>

            <figure className="home-closing__card">
              <blockquote className="home-closing__quote">
                <p>
                  <Trans
                    i18nKey="home.quote.andrii.text"
                    components={QUOTE_TRANS_COMPONENTS}
                  />
                </p>
              </blockquote>
              <figcaption className="home-closing__cite">
                <span className="home-closing__cite-name">{t('home.quote.andrii.author')}</span>
                <span className="home-closing__cite-role">{t('home.quote.andrii.role')}</span>
              </figcaption>
            </figure>
          </div>
        </Reveal>
      </section>

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
