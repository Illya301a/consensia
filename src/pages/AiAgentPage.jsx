import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import './AiAgentPage.scss'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { Reveal } from '../components/Reveal.jsx'

function AiAgentPage() {
  const { t } = useTranslation()
  const c = t('aiAgentPage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app ai-agent-page">
      <SiteHeader />
      <main className="ai-agent-page__main">
        <article className="ai-agent-page__article">
          <Reveal>
            <header className="ai-agent-page__hero">
              <h1 className="ai-agent-page__title">{c.title}</h1>
              <p className="ai-agent-page__lead">{c.lead}</p>
            </header>
          </Reveal>

          <Reveal>
            <section className="ai-agent-card">
              <h2>{c.coreInnovation.title}</h2>
              <p>{c.coreInnovation.lead}</p>
              <div className="ai-agent-grid">
                {c.coreInnovation.items.map((item) => (
                  <article className="ai-agent-card ai-agent-card--nested" key={item.title}>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </article>
                ))}
              </div>
            </section>
          </Reveal>

          <Reveal>
            <section className="ai-agent-card">
              <h2>{c.architecture.title}</h2>
              <ul>
                {c.architecture.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </Reveal>

          <Reveal>
            <section className="ai-agent-card ai-agent-card--cta">
              <p className="ai-agent-card__tagline">{c.cta.tagline}</p>
              <button type="button" className="ai-agent-page__btn" disabled>
                {c.cta.downloadButton}
              </button>
              <p className="ai-agent-card__note">{c.cta.note}</p>
            </section>
          </Reveal>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}

export default AiAgentPage