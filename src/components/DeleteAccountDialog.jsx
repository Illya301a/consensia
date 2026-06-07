import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'
import { emailsMatch } from '../services/profileUtils.js'

export default function DeleteAccountDialog({
  open,
  onClose,
  onConfirm,
  userEmail = '',
  deleting = false,
}) {
  const { t } = useTranslation()
  const c = t('deleteAccountFlow', { returnObjects: true })
  const titleId = useId()
  const emailInputRef = useRef(null)
  const [step, setStep] = useState('warning')
  const [emailInput, setEmailInput] = useState('')
  const [emailError, setEmailError] = useState('')

  useEffect(() => {
    if (!open) {
      setStep('warning')
      setEmailInput('')
      setEmailError('')
      return undefined
    }

    const prevOverflow = document.body.style.overflow
    const onKey = (ev) => {
      if (ev.key === 'Escape' && !deleting) onClose?.()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKey)

    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, deleting])

  useEffect(() => {
    if (!open || step !== 'email') return undefined
    const timeout = window.setTimeout(() => emailInputRef.current?.focus(), 0)
    return () => window.clearTimeout(timeout)
  }, [open, step])

  if (!open) return null

  const handleContinue = () => {
    setEmailError('')
    setStep('email')
  }

  const handleDelete = async (ev) => {
    ev.preventDefault()
    if (deleting) return
    if (!emailsMatch(emailInput, userEmail)) {
      setEmailError(c.emailMismatch)
      return
    }
    setEmailError('')
    await onConfirm?.()
  }

  return createPortal(
    <>
      <div
        className="delete-account-dialog__backdrop"
        aria-hidden="true"
        onClick={deleting ? undefined : onClose}
      />
      <div
        className="delete-account-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-label={c.ariaLabel}
      >
        <h2 id={titleId} className="delete-account-dialog__title">
          {c.title}
        </h2>

        {step === 'warning' ? (
          <>
            <p className="delete-account-dialog__text">{c.warning}</p>
            <div className="delete-account-dialog__actions">
              <button
                type="button"
                className="delete-account-dialog__btn delete-account-dialog__btn--ghost"
                onClick={onClose}
              >
                {c.cancel}
              </button>
              <button
                type="button"
                className="delete-account-dialog__btn delete-account-dialog__btn--primary"
                onClick={handleContinue}
              >
                {c.continue}
              </button>
            </div>
          </>
        ) : (
          <form className="delete-account-dialog__form" onSubmit={handleDelete}>
            <p className="delete-account-dialog__text">{c.emailPrompt}</p>
            <label className="delete-account-dialog__field">
              <span className="delete-account-dialog__sr-only">{c.emailPlaceholder}</span>
              <input
                ref={emailInputRef}
                type="email"
                name="email"
                autoComplete="email"
                className="delete-account-dialog__input"
                placeholder={c.emailPlaceholder}
                value={emailInput}
                onChange={(ev) => {
                  setEmailInput(ev.target.value)
                  if (emailError) setEmailError('')
                }}
                disabled={deleting}
                required
              />
            </label>
            {emailError ? (
              <p className="delete-account-dialog__error" role="alert">
                {emailError}
              </p>
            ) : null}
            <div className="delete-account-dialog__actions">
              <button
                type="button"
                className="delete-account-dialog__btn delete-account-dialog__btn--ghost"
                onClick={onClose}
                disabled={deleting}
              >
                {c.cancel}
              </button>
              <button
                type="submit"
                className="delete-account-dialog__btn delete-account-dialog__btn--danger"
                disabled={deleting}
              >
                {deleting ? '...' : c.delete}
              </button>
            </div>
          </form>
        )}
      </div>
    </>,
    document.body
  )
}
