import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Reveal } from './Reveal.jsx'

export default function SiteFooter() {
  const { t } = useTranslation()
  return (
    <footer className="footer">
      <div className="footer__sheen" aria-hidden="true" />
      <Reveal>
        <div className="footer__inner">
          <div className="footer__grid">
            <div className="footer__brand">
              <span className="footer__logo">Consensia</span>
              <p className="footer__tagline">{t('footer.tagline')}</p>
              <span className="footer__badge">{t('footer.badge')}</span>
            </div>
            <nav className="footer__col" aria-label={t('footer.productAria')}>
              <span className="footer__col-title">{t('footer.product')}</span>
              <Link to="/faq">FAQ</Link>
              <Link to="/terms">{t('footer.terms')}</Link>
              <Link to="/privacy">{t('footer.privacy')}</Link>
            </nav>
            <div className="footer__col footer__col--panel" id="docs">
              <span className="footer__col-title">{t('footer.sessions')}</span>
              <p className="footer__panel-text">{t('footer.sessionsText')}</p>
            </div>
          </div>
        </div>
        
      </Reveal>
      <div className="footer__bar">
        <p className="footer__copy">
          © {new Date().getFullYear()} Consensia · {t('footer.rights')}
        </p>
      </div>
    </footer>
  )
}
