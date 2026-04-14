import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../App.scss'

export default function PaymentSuccessPage() {
  const { t } = useTranslation()
  const c = t('paymentSuccessPage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app payment-page">
      <main className="payment-page__main">
        <article className="payment-page__card">
          <h1 className="legal-page__title">{c.title}</h1>
          <p className="legal-page__lead">{c.lead}</p>
          <div className="payment-page__actions">
            <Link className="btn btn--primary" to="/app">
              {c.openApp}
            </Link>
            <Link className="btn btn--ghost" to="/">
              {c.backHome}
            </Link>
          </div>
        </article>
      </main>
    </div>
  )
}
