import { useTranslation } from 'react-i18next'
import { getCredits, getUserLabel } from '../services/profileUtils.js'

export default function MobileProfilePanel({
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
  onDeleteAccount,
  deletingAccount = false,
}) {
  const { t } = useTranslation()
  const credits = getCredits(user)
  const userLabel = getUserLabel(user) || t('home.profile.label')

  if (!user) return null

  return (
    <div className="chat-app__profile-pop chat-app__profile-pop--menu" role="menu">
      <div className="chat-app__profile-head">
        <div className="top__menu-profile-user">
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
          <div>
            <div className="chat-app__profile-title">{userLabel}</div>
            {credits != null ? (
              <div className="chat-app__profile-sub">
                {t('home.profile.credits', { count: credits })}
              </div>
            ) : null}
          </div>
        </div>
        {credits != null ? (
          <div className="chat-app__profile-credits-line">
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
          </div>
        ) : null}
        {topUpError ? <div className="chat-app__profile-sub">{topUpError}</div> : null}
      </div>
      <div className="chat-app__profile-row">
        <label className="chat-app__toggle">
          <input
            type="checkbox"
            checked={dataCollection}
            onChange={(e) => onDataCollectionChange?.(e.target.checked)}
          />
          <span className="chat-app__toggle-ui" aria-hidden="true" />
          <span>{t('home.profile.dataCollection')}</span>
        </label>
      </div>
      <div className="chat-app__profile-actions">
        <button type="button" className="chat-app__profile-logout" onClick={onLogout}>
          {t('home.profile.logout')}
        </button>
        <button
          type="button"
          className="chat-app__profile-logout"
          onClick={onDeleteAccount}
          disabled={deletingAccount}
        >
          {deletingAccount ? '...' : t('home.profile.deleteAccount')}
        </button>
      </div>
    </div>
  )
}
