import { lazy, Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import '../App.scss'
import { Reveal } from '../components/Reveal.jsx'
import SiteFooter from '../components/SiteFooter.jsx'
import { useAuth } from '../services/AuthContext.jsx'

const ConsensiaScene = lazy(() =>
  import('../components/ConsensiaScene').then((m) => ({ default: m.ConsensiaScene }))
)

const NAV_MOBILE_MAX_PX = 768

export default function HomePage() {
  const { isAuthenticated, loginWithGoogle } = useAuth()
  const [animationsEnabled, setAnimationsEnabled] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!mobileMenuOpen) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const mq = window.matchMedia(`(min-width: ${NAV_MOBILE_MAX_PX}px)`)
    const closeIfDesktop = () => {
      if (mq.matches) setMobileMenuOpen(false)
    }
    mq.addEventListener('change', closeIfDesktop)
    return () => {
      document.body.style.overflow = prevOverflow
      mq.removeEventListener('change', closeIfDesktop)
    }
  }, [mobileMenuOpen])

  const closeMobileMenu = () => setMobileMenuOpen(false)

  return (
    <div className="app">
      <section className="hero" aria-label="Главный экран">
        <div className="hero__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <ConsensiaScene animationsEnabled={animationsEnabled} />
          </Suspense>
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <header className="top">
            <span className="logo">Consensia</span>
            <div className="top__end">
              <nav className="top__nav top__nav--desktop" aria-label="Навигация по странице">
                <a href="#how">Как это работает</a>
                <a href="#features">Возможности</a>
                <a href="#cases">Сценарии</a>
              </nav>
              {isAuthenticated ? (
                <Link className="top__cta top__cta--solid" to="/app">
                  Открыть
                </Link>
              ) : (
                <button type="button" className="top__cta" onClick={loginWithGoogle}>
                  Войти
                </button>
              )}
              <button
                type="button"
                className="motion-toggle motion-toggle--desktop"
                aria-pressed={animationsEnabled}
                title="Только анимация заднего 3D-слоя, не страница"
                onClick={() => setAnimationsEnabled((v) => !v)}
              >
                {animationsEnabled ? 'Остановить фон' : 'Анимировать фон'}
              </button>
              <button
                type="button"
                className={`top__burger${mobileMenuOpen ? ' top__burger--open' : ''}`}
                aria-expanded={mobileMenuOpen}
                aria-controls="top-mobile-menu"
                aria-label={mobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
                onClick={() => setMobileMenuOpen((o) => !o)}
              >
                <span className="top__burger-line" aria-hidden="true" />
                <span className="top__burger-line" aria-hidden="true" />
                <span className="top__burger-line" aria-hidden="true" />
              </button>
            </div>
          </header>

          <div
            className={`top__menu-backdrop${mobileMenuOpen ? ' top__menu-backdrop--visible' : ''}`}
            aria-hidden="true"
            onClick={closeMobileMenu}
          />

          <div
            id="top-mobile-menu"
            className={`top__menu-panel${mobileMenuOpen ? ' top__menu-panel--open' : ''}`}
            role="dialog"
            aria-modal="true"
            aria-label="Меню"
          >
            <nav className="top__menu-nav" aria-label="Навигация по странице">
              <a href="#how" onClick={closeMobileMenu}>
                Как это работает
              </a>
              <a href="#features" onClick={closeMobileMenu}>
                Возможности
              </a>
              <a href="#cases" onClick={closeMobileMenu}>
                Сценарии
              </a>
            </nav>
            {isAuthenticated ? (
              <Link className="top__cta top__cta--solid top__cta--menu" to="/app" onClick={closeMobileMenu}>
                Открыть
              </Link>
            ) : (
              <button
                type="button"
                className="top__cta top__cta--menu"
                onClick={() => {
                  loginWithGoogle()
                  closeMobileMenu()
                }}
              >
                Войти
              </button>
            )}
            <button
              type="button"
              className="motion-toggle motion-toggle--menu"
              aria-pressed={animationsEnabled}
              title="Только анимация заднего 3D-слоя, не страница"
              onClick={() => setAnimationsEnabled((v) => !v)}
            >
              {animationsEnabled ? 'Остановить фон' : 'Анимировать фон'}
            </button>
          </div>

          <div className="hero__main">
            <p className="eyebrow">Мульти-модельный интеллект</p>
            <h1 className="title">
              Один ответ
              <span className="title__line">из согласия нейросетей</span>
            </h1>
            <p className="lede">
              Несколько моделей обсуждают задачу и сходятся к лучшему решению —
              вы получаете ответ, собранный и проверенный в Consensia.
            </p>
            <div className="cta">
              <a className="btn btn--primary" href="/app">
                Начать
              </a>
              <a className="btn btn--ghost" href="#how">
                Как это работает
              </a>
            </div>
            <ul className="hero__tags" aria-label="Ключевые особенности">
              <li>Несколько моделей</li>
              <li>Внутренний диалог</li>
              <li>Один согласованный ответ</li>
            </ul>
          </div>

          <p className="scroll-hint">Листайте вниз</p>
        </div>
      </section>

      <section className="section section--strip" aria-label="В двух словах">
        <Reveal>
          <div className="section__inner">
            <div className="strip">
              <div className="strip__item">
                <span className="strip__label">Идея</span>
                <p className="strip__text">
                  Одна задача — разные «взгляды» моделей, затем сведение к общему выводу.
                </p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">Отличие</span>
                <p className="strip__text">
                  Не голосование по кнопке, а обмен аргументами и уточнениями между нейросетями.
                </p>
              </div>
              <div className="strip__divider" aria-hidden="true" />
              <div className="strip__item">
                <span className="strip__label">Результат</span>
                <p className="strip__text">
                  Меньше случайных ошибок и «уверенных» неточностей одной модели.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="how" className="section section--how">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Как это работает</h2>
            <p className="section__lead">
              Три шага от запроса до ответа, который прошёл внутреннюю проверку.
            </p>
            <ol className="steps">
              <li>
                <span className="steps__num">01</span>
                <h3>Запрос</h3>
                <p>Вы формулируете задачу — как обычному ассистенту.</p>
              </li>
              <li>
                <span className="steps__num">02</span>
                <h3>Диалог моделей</h3>
                <p>
                  Несколько нейросетей обмениваются выводами и уточняют друг друга.
                </p>
              </li>
              <li>
                <span className="steps__num">03</span>
                <h3>Итог</h3>
                <p>Consensia отдаёт один согласованный, проверенный ответ.</p>
              </li>
            </ol>
          </div>
        </Reveal>
      </section>

      <section id="features" className="section section--features">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Возможности</h2>
            <p className="section__lead">
              Всё, что нужно, чтобы доверять ответу — не только его тексту, но и пути к нему.
            </p>
            <div className="cards">
              <article className="card">
                <h3>Глубина</h3>
                <p>Слабые места одной модели компенсируются сильными сторонами другой.</p>
              </article>
              <article className="card">
                <h3>Прозрачность</h3>
                <p>Видно, как пришли к итогу — не «чёрный ящик», а совместный разбор.</p>
              </article>
              <article className="card">
                <h3>Качество</h3>
                <p>Фокус на одном лучшем ответе, а не на потоке несогласованных версий.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <section id="cases" className="section section--cases">
        <Reveal>
          <div className="section__inner">
            <h2 className="section__title">Где это пригодится</h2>
            <p className="section__lead">
              Любая задача, где важны точность, разные углы зрения и аккуратные формулировки.
            </p>
            <div className="case-grid">
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Код и архитектура</h3>
                <p>Ревью идеи, поиск краевых случаев, согласование стиля и ограничений стека.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Тексты и коммуникации</h3>
                <p>Письма, документы, тон голоса — когда важно не перегнуть и не упустить нюанс.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Аналитика и решения</h3>
                <p>Разбор вариантов, проверка допущений, более ровный и обоснованный итог.</p>
              </article>
              <article className="case-card">
                <span className="case-card__icon" aria-hidden="true">
                  ◇
                </span>
                <h3>Обучение и идеи</h3>
                <p>Разложить тему по полочкам, увидеть пробелы и собрать цельную картину.</p>
              </article>
            </div>
          </div>
        </Reveal>
      </section>

      <aside className="quote-block" aria-label="Позиционирование продукта">
        <Reveal>
          <blockquote className="quote-block__inner">
            <p>
              Мы не гонимся за самым «креативным» ответом любой ценой — мы нацелены на{' '}
              <strong>согласованный</strong> и <strong>проверяемый</strong> результат.
            </p>
          </blockquote>
        </Reveal>
      </aside>

      <section className="cta-band" id="start" aria-label="Призыв к действию">
        <Reveal>
          <div className="cta-band__inner">
            <div className="cta-band__copy">
              <h2 className="cta-band__title">Готовы к Consensia?</h2>
              <p className="cta-band__sub">
                Подставьте свой код или формулировку — так проще всего увидеть результат на практике.
              </p>
            </div>
            <a className="btn btn--primary btn--lg" href="/app">
              Открыть приложение
            </a>
          </div>
        </Reveal>
      </section>

      <SiteFooter />
    </div>
  )
}
