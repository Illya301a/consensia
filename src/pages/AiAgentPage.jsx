import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import './AiAgentPage.scss'

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
      <main className="ai-agent-page__main">
        <article className="ai-agent-page__card">
          <p className="ai-agent-page__emoticon" aria-hidden="true">
            {c.emoticon}
          </p>
          <h1 className="ai-agent-page__title">{c.title}</h1>
          <p className="ai-agent-page__lead">{c.lead}</p>
          <Link className="btn btn--primary ai-agent-page__back" to="/">
            {c.backHome}
          </Link>
        </article>
      </main>
    </div>
  )
}

export default AiAgentPage
