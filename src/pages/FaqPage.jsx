import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

const COPY = {
  ru: {
    docTitle: 'FAQ · Consensia',
    skip: 'Перейти к содержимому',
    title: 'FAQ',
    updated: 'Обновлено: 7 апреля 2026',
    lead: 'Короткие ответы на частые вопросы о работе Consensia, сессиях и кредитах.',
    items: [
      {
        q: '1. Что делает Consensia?',
        a: 'Consensia запускает несколько моделей, собирает их аргументы и формирует один согласованный ответ.',
      },
      {
        q: '2. Сохраняются ли мои чаты?',
        a: 'Да. История сессий сохраняется на сервере в вашем аккаунте и доступна в разделе истории.',
      },
      {
        q: '3. Можно ли продолжить старый чат?',
        a: 'Да. Откройте нужную сессию из истории: контекст восстановится, и диалог можно продолжить.',
      },
      {
        q: '4. Как работают кредиты?',
        a: 'Кредиты списываются по фактическому использованию моделей (объем входа/выхода, количество шагов и сложность задачи).',
      },
      {
        q: '5. Что делает переключатель «Сбор данных»?',
        a: 'Он сохраняет ваше предпочтение в интерфейсе. Для деталей по обработке данных см. страницу условий и приватности.',
      },
    ],
  },
  ua: {
    docTitle: 'FAQ · Consensia',
    skip: 'Перейти до вмісту',
    title: 'FAQ',
    updated: 'Оновлено: 7 квітня 2026',
    lead: 'Короткі відповіді на часті запитання про роботу Consensia, сесії та кредити.',
    items: [
      {
        q: '1. Що робить Consensia?',
        a: 'Consensia запускає кілька моделей, збирає їхні аргументи та формує одну узгоджену відповідь.',
      },
      {
        q: '2. Чи зберігаються мої чати?',
        a: 'Так. Історія сесій зберігається на сервері у вашому акаунті й доступна в розділі історії.',
      },
      {
        q: '3. Чи можна продовжити старий чат?',
        a: 'Так. Відкрийте потрібну сесію з історії: контекст відновиться, і діалог можна продовжити.',
      },
      {
        q: '4. Як працюють кредити?',
        a: 'Кредити списуються за фактичним використанням моделей (обсяг вхідних/вихідних даних, кількість кроків і складність задачі).',
      },
      {
        q: '5. Що робить перемикач «Збір даних»?',
        a: 'Він зберігає ваш вибір в інтерфейсі. Деталі обробки даних дивіться на сторінках умов і приватності.',
      },
    ],
  },
  en: {
    docTitle: 'FAQ · Consensia',
    skip: 'Skip to content',
    title: 'FAQ',
    updated: 'Last updated: April 7, 2026',
    lead: 'Short answers to common questions about Consensia, sessions, and credits.',
    items: [
      {
        q: '1. What does Consensia do?',
        a: 'Consensia runs multiple models, aggregates their arguments, and returns one aligned answer.',
      },
      {
        q: '2. Are my chats saved?',
        a: 'Yes. Session history is stored on the server in your account and available in the history section.',
      },
      {
        q: '3. Can I continue an old chat?',
        a: 'Yes. Open the needed session from history: context is restored and the dialogue can continue.',
      },
      {
        q: '4. How do credits work?',
        a: 'Credits are charged by actual model usage (input/output volume, number of steps, and task complexity).',
      },
      {
        q: '5. What does the "Data collection" switch do?',
        a: 'It stores your preference in the interface. For data-processing details, see the terms and privacy pages.',
      },
    ],
  },
}

export default function FaqPage() {
  const { i18n } = useTranslation()
  const lang = String(i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const c = COPY[lang] || COPY.ru

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app legal-page">
      <a href="#faq-main" className="legal-page__skip">
        {c.skip}
      </a>
      <SiteHeader />

      <main id="faq-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">{c.title}</h1>
          <p className="legal-page__meta">{c.updated}</p>
          <p className="legal-page__lead">{c.lead}</p>
          {c.items.map((item) => (
            <section key={item.q} className="legal-page__section">
              <h2>{item.q}</h2>
              <p>{item.a}</p>
            </section>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
