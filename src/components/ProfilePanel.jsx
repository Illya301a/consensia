import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import DataCollectionToggle from './DataCollectionToggle.jsx'
import { FAQ_DELETE_ACCOUNT_HREF } from '../constants/profile.js'
import { getCredits, getUserLabel } from '../services/profileUtils.js'

function ProfileToggleChevron({ direction = 'down' }) {
  const path = direction === 'up' ? 'M6 15L12 9L18 15' : 'M6 9L12 15L18 9'

  return (
    <svg className="chat-app__profile-toggle-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ProfileAvatarIcon() {
  return (
    <svg className="chat-app__profile-identity-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
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
  )
}

function ProfileIdentity({ userLabel, credits, creditsLabel }) {
  return (
    <div className="chat-app__profile-identity">
      <span className="chat-app__profile-identity-avatar" aria-hidden="true">
        <ProfileAvatarIcon />
      </span>
      <div className="chat-app__profile-identity-body">
        <div className="chat-app__profile-title">{userLabel}</div>
        {credits != null ? <span className="chat-app__profile-badge">{creditsLabel}</span> : null}
      </div>
    </div>
  )
}

function ProfileHeaderToggle({ userLabel, credits, creditsLabel, expanded, onToggle, expandLabel, collapseLabel }) {
  return (
    <button
      type="button"
      className={`chat-app__profile-summary${expanded ? ' chat-app__profile-summary--expanded' : ''}`}
      onClick={onToggle}
      aria-expanded={expanded ? 'true' : 'false'}
      aria-label={expanded ? collapseLabel : expandLabel}
    >
      <span className="chat-app__profile-identity-avatar" aria-hidden="true">
        <ProfileAvatarIcon />
      </span>
      <span className="chat-app__profile-summary-body">
        <span className="chat-app__profile-title">{userLabel}</span>
        {credits != null ? <span className="chat-app__profile-badge">{creditsLabel}</span> : null}
      </span>
      <span className="chat-app__profile-summary-chevron" aria-hidden="true">
        <ProfileToggleChevron direction={expanded ? 'up' : 'down'} />
      </span>
    </button>
  )
}

export default function ProfilePanel({
  user,
  topUpAmount,
  onTopUpAmountChange,
  creditsPreview,
  onTopUp,
  topUpLoading,
  promoMultiplier,
  topUpError,
  dataCollection,
  onDataCollectionChange,
  onLogout,
  onSwitchAccount,
  onNavigate,
  showDeleteLink = true,
  collapsible = false,
  className = '',
}) {
  const { t } = useTranslation()
  const [expanded, setExpanded] = useState(!collapsible)
  const credits = getCredits(user)
  const userLabel = getUserLabel(user) || t('home.profile.label')
  const creditsLabel = credits != null ? t('home.profile.credits', { count: credits }) : ''
  const sections = t('profilePanel', { returnObjects: true })

  if (!user) return null

  const handleNavigate = () => {
    onNavigate?.()
  }

  const handleSwitchAccount = () => {
    onNavigate?.()
    onSwitchAccount?.()
  }

  const toggleExpanded = () => {
    setExpanded((value) => !value)
  }

  const rootClassName = [
    'chat-app__profile-pop',
    className,
    collapsible ? 'chat-app__profile-pop--collapsible' : '',
    collapsible && expanded ? 'chat-app__profile-pop--expanded' : '',
    collapsible && !expanded ? 'chat-app__profile-pop--collapsed' : '',
  ]
    .filter(Boolean)
    .join(' ')

  if (collapsible && !expanded) {
    return (
      <div className={rootClassName}>
        <ProfileHeaderToggle
          userLabel={userLabel}
          credits={credits}
          creditsLabel={creditsLabel}
          expanded={false}
          onToggle={toggleExpanded}
          expandLabel={sections.expand}
          collapseLabel={sections.collapse}
        />
      </div>
    )
  }

  return (
    <div className={rootClassName} role="menu">
      {collapsible ? (
        <ProfileHeaderToggle
          userLabel={userLabel}
          credits={credits}
          creditsLabel={creditsLabel}
          expanded
          onToggle={toggleExpanded}
          expandLabel={sections.expand}
          collapseLabel={sections.collapse}
        />
      ) : (
        <ProfileIdentity userLabel={userLabel} credits={credits} creditsLabel={creditsLabel} />
      )}

      {credits != null ? (
            <section className="chat-app__profile-section">
              <h3 className="chat-app__profile-section-title">{sections.balance}</h3>
              <div className="chat-app__profile-billing">
                <div className="chat-app__topup-inline">
                  <input
                    className="chat-app__topup-input"
                    type="number"
                    min={1}
                    step={1}
                    value={topUpAmount}
                    onChange={(e) => onTopUpAmountChange?.(e.target.value)}
                    aria-label={t('home.profile.topUp.amountAria')}
                  />
                  <span className="chat-app__topup-preview">
                    {t('home.profile.topUp.preview', { count: creditsPreview })}
                  </span>
                  <button
                    type="button"
                    className="chat-app__topup-btn"
                    onClick={onTopUp}
                    disabled={topUpLoading}
                    title={t('home.profile.topUp.rateTitle', { multiplier: promoMultiplier })}
                  >
                    {topUpLoading ? '...' : t('home.profile.topUp.button')}
                  </button>
                </div>
                {topUpError ? <p className="chat-app__profile-error">{topUpError}</p> : null}
              </div>
            </section>
          ) : null}

          <section className="chat-app__profile-section chat-app__profile-section--settings">
            <h3 className="chat-app__profile-section-title">{sections.settings}</h3>
            <DataCollectionToggle
              checked={dataCollection}
              onChange={onDataCollectionChange}
              label={t('home.profile.dataCollection')}
            />
          </section>

          <section className="chat-app__profile-section chat-app__profile-section--account">
            <h3 className="chat-app__profile-section-title">{sections.account}</h3>
            <div className="chat-app__profile-account-actions">
              <button type="button" className="chat-app__profile-menu-btn" onClick={onLogout}>
                {t('home.profile.logout')}
              </button>
              <button type="button" className="chat-app__profile-menu-btn" onClick={handleSwitchAccount}>
                {t('home.profile.switchAccount')}
              </button>
              {showDeleteLink ? (
                <Link
                  to={FAQ_DELETE_ACCOUNT_HREF}
                  className="chat-app__profile-menu-link chat-app__profile-menu-link--danger"
                  onClick={handleNavigate}
                >
                  {t('home.profile.deleteAccount')}
                </Link>
          ) : null}
        </div>
      </section>
    </div>
  )
}
