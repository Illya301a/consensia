import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

export default function FaqPage() {
  const { t } = useTranslation()
  const c = t('faqPage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app legal-page">
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
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
