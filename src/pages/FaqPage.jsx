import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import PageAurora from '../components/PageAurora.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import { deleteMyAccount } from '../services/githubActionsApi.js'

export default function FaqPage() {
  const { t } = useTranslation()
  const { isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const c = t('faqPage', { returnObjects: true })
  const [deletingAccount, setDeletingAccount] = useState(false)

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  const handleDeleteAccount = async () => {
    if (!window.confirm(c.deleteAccount.confirm)) return
    setDeletingAccount(true)
    try {
      const result = await deleteMyAccount()
      if (!result.ok) throw new Error(result.error || c.deleteAccount.error)
      logout()
      navigate('/')
    } catch (e) {
      window.alert(e?.message || String(e))
    } finally {
      setDeletingAccount(false)
    }
  }

  return (
    <div className="app legal-page">
      <PageAurora />
      <a href="#faq-main" className="legal-page__skip">
        {c.skip}
      </a>
      <SiteHeader />

      <main id="faq-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">{c.title}</h1>
          <p className="legal-page__meta">{c.updated}</p>
          <p className="legal-page__lead">{c.lead}</p>
          {c.items.map((item, idx) => (
            <section key={`${idx}-${item.q}`} className="legal-page__section">
              <h2>{item.q}</h2>
              <p>{item.a}</p>
            </section>
          ))}
          <section className="legal-page__section faq-page__delete">
            <h2>{c.deleteAccount.q}</h2>
            <p>{c.deleteAccount.a}</p>
            {isAuthenticated ? (
              <button
                type="button"
                className="faq-page__delete-btn"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? '...' : c.deleteAccount.button}
              </button>
            ) : (
              <p className="legal-page__meta">{c.deleteAccount.loginHint}</p>
            )}
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
