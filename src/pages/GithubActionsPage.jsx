import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import './GithubActionsPage.scss'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { useAuth } from '../services/AuthContext.jsx'
import {
  createCliPassCheckout,
  generateCliApiKey,
  saveOpenRouterApiKey,
} from '../services/githubActionsApi.js'

export default function GithubActionsPage() {
  const { t } = useTranslation()
  const c = t('githubActionsPage', { returnObjects: true })
  const { isAuthenticated, loginWithGoogle } = useAuth()
  const [openRouterKey, setOpenRouterKey] = useState('')
  const [generatedCliKey, setGeneratedCliKey] = useState('')
  const [savingOpenRouter, setSavingOpenRouter] = useState(false)
  const [generatingCliKey, setGeneratingCliKey] = useState(false)
  const [openingCheckout, setOpeningCheckout] = useState(false)
  const [actionsError, setActionsError] = useState('')
  const [actionsSuccess, setActionsSuccess] = useState('')

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  const requireAuth = () => {
    if (isAuthenticated) return true
    loginWithGoogle()
    return false
  }

  const handleGenerateCliKey = async () => {
    if (!requireAuth()) return
    setActionsError('')
    setActionsSuccess('')
    setGeneratingCliKey(true)
    try {
      const result = await generateCliApiKey()
      if (!result.ok) throw new Error(result.error || 'Failed to generate CLI key')
      setGeneratedCliKey(result.cliApiKey || '')
      setActionsSuccess(c.controls.generateSuccess || result.message || 'CLI key generated')
      if (result.cliApiKey && navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(result.cliApiKey).catch(() => null)
      }
    } catch (e) {
      setActionsError(e?.message || String(e))
    } finally {
      setGeneratingCliKey(false)
    }
  }

  const handleSaveOpenRouterKey = async () => {
    if (!requireAuth()) return
    const key = String(openRouterKey || '').trim()
    if (!key) {
      setActionsError(c.controls.openRouterRequired || 'OpenRouter API key is required')
      setActionsSuccess('')
      return
    }
    setActionsError('')
    setActionsSuccess('')
    setSavingOpenRouter(true)
    try {
      const result = await saveOpenRouterApiKey(key)
      if (!result.ok) throw new Error(result.error || 'Failed to save OpenRouter key')
      setActionsSuccess(c.controls.saveSuccess || result.message || 'OpenRouter key saved')
    } catch (e) {
      setActionsError(e?.message || String(e))
    } finally {
      setSavingOpenRouter(false)
    }
  }

  const handleSubscribeCliPass = async () => {
    if (!requireAuth()) return
    setActionsError('')
    setActionsSuccess('')
    setOpeningCheckout(true)
    try {
      const result = await createCliPassCheckout()
      if (!result.ok) throw new Error(result.error || 'Failed to create checkout')
      if (!result.checkoutUrl) throw new Error('Stripe checkout URL is missing')
      window.location.href = result.checkoutUrl
    } catch (e) {
      setActionsError(e?.message || String(e))
    } finally {
      setOpeningCheckout(false)
    }
  }

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
              <div className="cli-guide-actions">
                <button
                  type="button"
                  className="cli-guide-page__btn"
                  onClick={handleGenerateCliKey}
                  disabled={generatingCliKey}
                >
                  {generatingCliKey ? '...' : c.controls.generateButton}
                </button>
                <div className="cli-guide-openrouter-inline">
                  <label className="cli-guide-openrouter-field" htmlFor="openrouter-key">
                    <input
                      id="openrouter-key"
                      type="password"
                      placeholder={c.controls.openRouterPlaceholder}
                      value={openRouterKey}
                      onChange={(e) => setOpenRouterKey(e.target.value)}
                    />
                  </label>
                  <button
                    type="button"
                    className="cli-guide-page__btn cli-guide-page__btn--ghost cli-guide-page__btn--inline"
                    onClick={handleSaveOpenRouterKey}
                    disabled={savingOpenRouter}
                  >
                    {savingOpenRouter ? '...' : c.controls.saveKeyButton}
                  </button>
                </div>
                <button
                  type="button"
                  className="cli-guide-page__btn cli-guide-page__btn--ghost"
                  onClick={handleSubscribeCliPass}
                  disabled={openingCheckout}
                >
                  {openingCheckout ? '...' : c.controls.subscribeButton}
                </button>
              </div>
              <div className="cli-guide-feedback">
                {generatedCliKey ? (
                  <p className="cli-guide-card__mono">
                    {c.controls.generatedKeyLabel || 'CLI key'}: {generatedCliKey}
                  </p>
                ) : null}
                {actionsSuccess ? (
                  <p className="cli-guide-card__notice cli-guide-card__notice--success">{actionsSuccess}</p>
                ) : null}
                {actionsError ? (
                  <p className="cli-guide-card__notice cli-guide-card__notice--error">{actionsError}</p>
                ) : null}
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
