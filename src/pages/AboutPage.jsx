import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'

export default function AboutPage() {
  const { t } = useTranslation()
  const c = t('aboutPage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app legal-page">
      <SiteHeader />

      <main className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <Reveal>
            <h1 className="legal-page__title">{c.title}</h1>
            <p className="legal-page__lead">{c.lead}</p>
          </Reveal>

          {c.sections.map((section, idx) => (
            <Reveal key={section.title}>
              <section className="legal-page__section">
                <h2>{section.title}</h2>
                {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {section.link ? (
                  <p>
                    {section.link.before}{' '}
                    <a href={section.link.href}>{section.link.label}</a>.
                  </p>
                ) : null}
                {section.legalLinks ? (
                  <p>
                    {section.legalLinks.before} <a href="/privacy">{section.legalLinks.privacyLabel}</a> /{' '}
                    <a href="/terms">{section.legalLinks.termsLabel}</a>.
                  </p>
                ) : null}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={`${idx}-${b}`}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            </Reveal>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
