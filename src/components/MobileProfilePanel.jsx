import { useTranslation } from 'react-i18next'
import DataCollectionToggle from './DataCollectionToggle.jsx'
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
}) {
  const { t } = useTranslation()
  const credits = getCredits(user)
  const userLabel = getUserLabel(user) || t('home.profile.label')

  if (!user) return null

  return (
    <div className="chat-app__profile-pop chat-app__profile-pop--menu" role="menu">
      <div className="chat-app__profile-head">
        <div className="chat-app__profile-title">{userLabel}</div>
        {credits != null ? (
          <div className="chat-app__profile-sub">
            {t('home.profile.credits', { count: credits })}
          </div>
        ) : null}
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
        <DataCollectionToggle
          checked={dataCollection}
          onChange={onDataCollectionChange}
          label={t('home.profile.dataCollection')}
        />
      </div>
      <div className="chat-app__profile-actions chat-app__profile-actions--solo">
        <button type="button" className="chat-app__profile-logout" onClick={onLogout}>
          {t('home.profile.logout')}
        </button>
      </div>
    </div>
  )
}
