import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import TopBurgerMenu from './TopBurgerMenu.jsx'
import MobileProfilePanel from './MobileProfilePanel.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { apiFetch } from '../services/http.js'
const DATA_COLLECTION_KEY = 'consensia_data_collection_v1'

export default function SiteHeader() {
  const { t } = useTranslation()
  const { isAuthenticated, user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
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
  const promoMultiplier = Number(promoInfo?.multiplier) > 0 ? Number(promoInfo.multiplier) : 200
  const creditsPreview =
    Number.isFinite(amountNum) && amountNum > 0 ? Math.floor(amountNum * promoMultiplier) : 0

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

  return (
    <>
      <header className="site-header">
        <Link to="/" className="logo site-header__logo">
          {t('common.brand')}
        </Link>
        <div className="site-header__row">
          <nav className="site-header__nav" aria-label={t('a11y.mainNav')}>
            <NavLink to="/about" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
              {t('nav.about')}
            </NavLink>
            <NavLink to="/models" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
              {t('nav.models')}
            </NavLink>
            <NavLink to="/developers" className={({ isActive }) => `site-header__nav-link${isActive ? ' site-header__nav-link--active' : ''}`}>
              {t('nav.developers')}
            </NavLink>
          </nav>
        </div>
        <TopBurgerMenu
          isOpen={menuOpen}
          onToggle={() => setMenuOpen((v) => !v)}
          onClose={() => setMenuOpen(false)}
          menuId="site-header-mobile-menu"
          openAriaLabel={t('home.menu.open')}
          closeAriaLabel={t('home.menu.close')}
          menuAriaLabel={t('home.menu.label')}
          main={
            <nav className="top__menu-nav" aria-label={t('a11y.mainNav')}>
              <NavLink
                to="/about"
                className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
              >
                {t('nav.about')}
              </NavLink>
              <NavLink
                to="/models"
                className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
              >
                {t('nav.models')}
              </NavLink>
              <NavLink
                to="/developers"
                className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
              >
                {t('nav.developers')}
              </NavLink>
              <NavLink
                to="/app"
                className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
              >
                {t('nav.app')}
              </NavLink>
              <NavLink
                to="/github-actions"
                className={({ isActive }) => `top__menu-link${isActive ? ' top__menu-link--active' : ''}`}
              >
                {t('nav.githubActions')}
              </NavLink>
            </nav>
          }
        >
          <LanguageSwitcher className="top__lang top__lang--menu" />
          {isAuthenticated ? (
            <div className="top__menu-profile">
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
                  setMenuOpen(false)
                }}
              />
            </div>
          ) : null}
        </TopBurgerMenu>
      </header>
    </>
  )
}
