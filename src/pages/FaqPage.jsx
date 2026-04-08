import { useEffect } from 'react'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

const TITLE = 'FAQ · Consensia'

export default function FaqPage() {
  useEffect(() => {
    const prev = document.title
    document.title = TITLE
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="app legal-page">
      <a href="#faq-main" className="legal-page__skip">
        Skip to content
      </a>
      <SiteHeader />

      <main id="faq-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">FAQ</h1>
          <p className="legal-page__meta">Last updated: April 7, 2026</p>
          <p className="legal-page__lead">
            Короткие ответы на частые вопросы о работе Consensia, сессиях и кредитах.
          </p>

          <section className="legal-page__section">
            <h2>1. Что делает Consensia?</h2>
            <p>
              Consensia запускает несколько моделей, собирает их аргументы и формирует один
              согласованный ответ.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. Сохраняются ли мои чаты?</h2>
            <p>
              Да. История сессий сохраняется на сервере в вашем аккаунте и доступна в разделе
              истории.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>3. Можно ли продолжить старый чат?</h2>
            <p>
              Да. Откройте нужную сессию из истории: контекст восстановится, и диалог можно
              продолжить.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>4. Как работают кредиты?</h2>
            <p>
              Кредиты списываются по фактическому использованию моделей (объем входа/выхода,
              количество шагов и сложность задачи).
            </p>
          </section>

          <section className="legal-page__section">
            <h2>5. Что делает переключатель «Сбор данных»?</h2>
            <p>
              Он сохраняет ваше предпочтение в интерфейсе. Для деталей по обработке данных см.
              страницу условий и приватности.
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
