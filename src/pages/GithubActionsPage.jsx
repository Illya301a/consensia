import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import './GithubActionsPage.scss'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { Reveal } from '../components/Reveal.jsx'

export default function GithubActionsPage() {
  const { t } = useTranslation()
  const c = t('githubActionsPage', { returnObjects: true })
  const [openRouterKey, setOpenRouterKey] = useState('')

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app cli-guide-page">
      <SiteHeader />
      <main className="cli-guide-page__main">
        <article className="cli-guide-page__article">
          <Reveal>
            <header className="cli-guide-page__hero">
              <h1 className="cli-guide-page__title">{c.title}</h1>
              <p className="cli-guide-page__lead">{c.lead}</p>
            </header>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.quickStart.title}</h2>
              <p>{c.quickStart.lead}</p>
              <ol>
                {c.quickStart.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.controls.title}</h2>
              <p>{c.controls.lead}</p>
              <div className="cli-guide-cta-row">
                <a className="cli-guide-page__btn" href="/app">
                  {c.controls.generateButton}
                </a>
                <label className="cli-guide-openrouter-field" htmlFor="openrouter-key">
                  <input
                    id="openrouter-key"
                    type="password"
                    placeholder={c.controls.openRouterPlaceholder}
                    value={openRouterKey}
                    onChange={(e) => setOpenRouterKey(e.target.value)}
                  />
                </label>
                <a className="cli-guide-page__btn cli-guide-page__btn--ghost" href="/app">
                  {c.controls.subscribeButton}
                </a>
              </div>
              <p className="cli-guide-card__tip">{c.controls.tip}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.steps.secret.title}</h2>
              <p>{c.steps.secret.lead}</p>
              <ol>
                {c.steps.secret.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.steps.permissions.title}</h2>
              <p>{c.steps.permissions.lead}</p>
              <ol>
                {c.steps.permissions.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ol>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.steps.workflow.title}</h2>
              <p>{c.steps.workflow.lead}</p>
              <p className="cli-guide-card__mono">{c.steps.workflow.path}</p>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.scenarios.pr.title}</h2>
              <p>{c.scenarios.pr.lead}</p>
              <p className="cli-guide-card__mono">{c.scenarios.pr.note}</p>
              <pre className="cli-guide-code">
                <code>{c.scenarios.pr.yaml}</code>
              </pre>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.scenarios.commit.title}</h2>
              <p>{c.scenarios.commit.lead}</p>
              <p className="cli-guide-card__mono">{c.scenarios.commit.note}</p>
              <pre className="cli-guide-code">
                <code>{c.scenarios.commit.yaml}</code>
              </pre>
            </section>
          </Reveal>

          <Reveal>
            <section className="cli-guide-card">
              <h2>{c.result.title}</h2>
              <p>{c.result.lead}</p>
              <ul>
                {c.result.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          </Reveal>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}
