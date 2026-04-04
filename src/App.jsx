import { lazy, Suspense, useState } from 'react'
import './App.scss'
import { Reveal } from './components/Reveal.jsx'

const ConsensusScene = lazy(() =>
  import('./components/ConsensusScene').then((m) => ({ default: m.ConsensusScene }))
)

function App() {
  const [animationsEnabled, setAnimationsEnabled] = useState(true)

  return (
    <div className="app">
      <section className="hero" aria-label="Главный экран">
        <div className="hero__canvas" aria-hidden="true">
          <Suspense fallback={null}>
            <ConsensusScene animationsEnabled={animationsEnabled} />
          </Suspense>
        </div>
        <div className="hero__gradient" aria-hidden="true" />
        <div className="hero__content">
          <header className="top">
            <span className="logo">Consensus AI</span>
            <div className="top__end">
              <nav className="top__nav" aria-label="Навигация по странице">
                <a href="#how">Как это работает</a>
                <a href="#features">Возможности</a>
                <a href="#cases">Сценарии</a>
              </nav>
              <button
                type="button"
                className="motion-toggle"
                aria-pressed={animationsEnabled}
                title="Только анимация заднего 3D-слоя, не страница"
                onClick={() => setAnimationsEnabled((v) => !v)}
              >
                {animationsEnabled ? 'Остановить фон' : 'Анимировать фон'}
              </button>
            </div>
          </header>

          <div className="hero__main">
            <p className="eyebrow">Мульти-модельный интеллект</p>
            <h1 className="title">
              Один ответ
              <span className="title__line">из согласия нейросетей</span>
            </h1>
            <p className="lede">
              Несколько моделей обсуждают задачу и сходятся к лучшему решению —
              вы получаете ответ, усиленный коллективным «консенсусом».
            </p>
            <div className="cta">
              <a className="btn btn--primary" href="#start">
                Попробовать
              </a>
              <a className="btn btn--ghost" href="#docs">
                Документация
              </a>
            </div>
            <ul className="hero__tags" aria-label="Ключевые особенности">
              <li>Несколько моделей</li>
              <li>Внутренний диалог</li>
              <li>Один согласованный ответ</li>
              <li>Прозрачный процесс</li>
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
              <h3>Консенсус</h3>
              <p>Система собирает согласованный, проверенный ответ.</p>
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
            <h2 className="cta-band__title">Готовы собрать свой консенсус?</h2>
            <p className="cta-band__sub">
              Интерфейс и API появятся здесь, как только бэкенд будет готов — загляните позже или
              оставьте контакт команде.
            </p>
          </div>
          <a className="btn btn--primary btn--lg" href="#docs">
            Узнать о запуске
          </a>
        </div>
        </Reveal>
      </section>

      <footer className="footer">
        <Reveal>
        <div className="footer__inner footer__grid">
          <div className="footer__brand">
            <strong>Consensus AI</strong>
            <p className="footer__tagline">Коллективный разум моделей — в одном интерфейсе.</p>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Продукт</span>
            <a href="#how">Как это работает</a>
            <a href="#features">Возможности</a>
            <a href="#cases">Сценарии</a>
          </div>
          <div className="footer__col">
            <span className="footer__col-title">Сейчас</span>
            <span className="footer__muted" id="docs">
              Бэкенд и API подключаются по мере готовности.
            </span>
          </div>
        </div>
        </Reveal>
        <p className="footer__copy">
          © {new Date().getFullYear()} Consensus AI · В разработке
        </p>
      </footer>
    </div>
  )
}

export default App
