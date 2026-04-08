import { Link } from 'react-router-dom'
import { Reveal } from './Reveal.jsx'

export default function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footer__sheen" aria-hidden="true" />
      <Reveal>
        <div className="footer__inner">
          <div className="footer__grid">
            <div className="footer__brand">
              <span className="footer__logo">Consensia</span>
              <p className="footer__tagline">
                Коллективный разум моделей — в одном интерфейсе.
              </p>
              <span className="footer__badge">Beta версия</span>
            </div>
            <nav className="footer__col" aria-label="Разделы продукта">
              <span className="footer__col-title">Продукт</span>
              <Link to="/faq">FAQ</Link>
              <Link to="/terms">Terms of Service</Link>
              <Link to="/privacy">Privacy Policy</Link>
            </nav>
            <div className="footer__col footer__col--panel" id="docs">
              <span className="footer__col-title">Сессии</span>
              <p className="footer__panel-text">
                Разборы можно продолжать позже — история сохраняется в вашем аккаунте.
              </p>
            </div>
          </div>
        </div>
        
      </Reveal>
      <div className="footer__bar">
        <p className="footer__copy">
          © {new Date().getFullYear()} Consensia · Made with 💗 by Ukrainians
        </p>
      </div>
    </footer>
  )
}
