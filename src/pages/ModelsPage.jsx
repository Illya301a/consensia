import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'
import './ModelsPage.scss'

function prettyModelName(modelId) {
  const id = String(modelId ?? '').trim()
  if (!id) return ''
  const map = {
    'openai/gpt-5-codex': 'OpenAI GPT-5 Codex',
    'qwen/qwen3.6-plus': 'Qwen 3.6 Plus',
    'google/gemini-3-flash-preview': 'Google Gemini 3 Flash Preview',
    'z-ai/glm-5-turbo': 'Z.AI GLM-5 Turbo',
    'google/gemini-3.1-pro-preview': 'Google Gemini 3.1 Pro Preview',
    'google/gemini-2.5-flash-lite': 'Google Gemini 2.5 Flash Lite',
  }
  return map[id] || id
}

function prettyModelList(value) {
  return String(value ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => prettyModelName(x))
    .join(' + ')
}

function ExpertCard({ expert, labels }) {
  return (
    <article className="experts-page__card">
      <header className="experts-page__card-head">
        <h2>{expert.name}</h2>
        <code title={expert.modelId}>{prettyModelName(expert.modelId)}</code>
      </header>
      <p className="experts-page__meta">
        <strong>{labels.role}:</strong> {expert.role}
      </p>
      <p className="experts-page__meta">
        <strong>{labels.task}:</strong> {expert.task}
      </p>
      <p className="experts-page__meta">
        <strong>{labels.weight}:</strong> {expert.weight} <strong>{labels.temperature}:</strong>{' '}
        {expert.temperature}
      </p>

      <div className="experts-page__block">
        <h3>{labels.focus}</h3>
        <div className="experts-page__chips">
          {expert.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="experts-page__block">
        <h3>{labels.output}</h3>
        <ol>
          {expert.output.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="experts-page__constraint">
        <strong>{labels.mindset}:</strong> {expert.constraint}
      </p>
    </article>
  )
}

export default function ModelsPage() {
  const { t } = useTranslation()
  const c = t('modelsPage', { returnObjects: true })

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <main className="experts-page">
      <SiteHeader />

      <Reveal>
        <section className="experts-page__hero">
          <p className="experts-page__eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__grid" aria-label={c.expertsAria}>
          {c.experts.map((expert) => (
            <ExpertCard key={expert.name} expert={expert} labels={c.labels} />
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__system" aria-label={c.systemAria}>
          <article className="experts-page__panel">
            <header className="experts-page__panel-head">
              <h2>{c.panel.judgeTitle}</h2>
              <code title={c.arbiter.id}>{prettyModelList(c.arbiter.id)}</code>
            </header>
            <p>
              <strong>{c.labels.role}:</strong> {c.arbiter.role}
            </p>
            <p className="experts-page__arbiter-lead">{c.arbiter.purpose}</p>
            <div className="experts-page__arbiter-grid">
              {c.arbiter.workflow.map((section) => (
                <section key={section.title} className="experts-page__arbiter-block">
                  <h3>{section.title}</h3>
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>

          <article className="experts-page__panel">
            <header className="experts-page__panel-head">
              <h2>{c.panel.routerTitle}</h2>
              <code title={c.router.model}>{prettyModelName(c.router.model)}</code>
            </header>
            <p>
              <strong>{c.labels.role}:</strong> {c.router.role}
            </p>
            <p className="experts-page__router-lead">{c.router.mission}</p>
            <div className="experts-page__router-grid">
              {c.router.rules.map((rule) => (
                <section key={rule.title} className="experts-page__router-rule">
                  <h3>{rule.title}</h3>
                  <p>{rule.text}</p>
                </section>
              ))}
            </div>
          </article>
        </section>
      </Reveal>

      <SiteFooter />
    </main>
  )
}
