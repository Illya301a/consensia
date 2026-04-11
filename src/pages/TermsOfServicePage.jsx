import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

export default function TermsOfServicePage() {
  const { t } = useTranslation()
  const c = t('termsOfServicePage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app legal-page">
      <a href="#legal-main" className="legal-page__skip">
        {c.skip}
      </a>
      <SiteHeader />

      <main id="legal-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">{c.title}</h1>
          <p className="legal-page__meta">{c.updated}</p>

          <aside className="legal-page__notice" role="note">
            <strong>{c.noticeTitle}</strong> {c.noticeText}
          </aside>

          <p className="legal-page__lead">{c.lead}</p>
          {c.sections.map((section, idx) => (
            <section key={`${idx}-${section.title}`} className="legal-page__section">
              <h2>{section.title}</h2>
              {section.intro ? <p>{section.intro}</p> : null}
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
              {section.paragraphs?.map((p) => (
                <p key={p}>
                  {String(p).includes('support@faby.world') ? (
                    <>
                      {String(p).replace('support@faby.world', '')}
                      <a href="mailto:support@faby.world">support@faby.world</a>
                    </>
                  ) : (
                    p
                  )}
                </p>
              ))}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
