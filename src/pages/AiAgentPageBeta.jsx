import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import './AiAgentPageBeta.scss'
import SiteHeader from '../components/SiteHeader.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { Reveal } from '../components/Reveal.jsx'
import { apiFetch } from '../services/http.js'

function filenameFromContentDisposition(header) {
  if (!header) return 'consensia-agent.zip'
  const m =
    /filename\*=UTF-8''([^;\n]+)|filename="([^"]+)"|filename=([^;\n]+)/i.exec(
      header,
    )
  const raw = m?.[1] ?? m?.[2] ?? m?.[3]
  if (!raw) return 'consensia-agent.zip'
  try {
    return decodeURIComponent(raw.trim())
  } catch {
    return raw.trim() || 'consensia-agent.zip'
  }
}

async function readJsonErrorDetail(res) {
  const ct = res.headers.get('content-type') ?? ''
  if (!ct.includes('application/json')) return null
  try {
    const data = await res.json()
    if (data?.detail == null) return null
    return typeof data.detail === 'string' ? data.detail : String(data.detail)
  } catch {
    return null
  }
}

function AiAgentPageBeta() {
  const { t } = useTranslation()
  const c = t('aiAgentPageBeta', { returnObjects: true })
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState(null)

  const handleDownloadAgent = useCallback(async () => {
    const fallbackErr = t('aiAgentPageBeta.cta.downloadError')
    setDownloadError(null)
    setDownloading(true)
    try {
      const res = await apiFetch('/api/cli/download-agent')
      if (!res.ok) {
        const detail = await readJsonErrorDetail(res)
        throw new Error(detail || fallbackErr)
      }
      const blob = await res.blob()
      const name = filenameFromContentDisposition(
        res.headers.get('Content-Disposition'),
      )
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = name
      a.rel = 'noopener'
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (e) {
      setDownloadError(e instanceof Error ? e.message : fallbackErr)
    } finally {
      setDownloading(false)
    }
  }, [t])

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
              <button
                type="button"
                className="ai-agent-page__btn"
                disabled={downloading}
                aria-busy={downloading}
                onClick={handleDownloadAgent}
              >
                {downloading
                  ? t('aiAgentPageBeta.cta.downloading')
                  : c.cta.downloadButton}
              </button>
              {downloadError ? (
                <p className="ai-agent-card__note ai-agent-card__note--error" role="alert">
                  {downloadError}
                </p>
              ) : null}
              <p className="ai-agent-card__note">{c.cta.note}</p>
            </section>
          </Reveal>
        </article>
      </main>
      <SiteFooter />
    </div>
  )
}

export default AiAgentPageBeta