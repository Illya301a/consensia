import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

const COPY = {
  ru: {
    docTitle: 'Политика конфиденциальности · Consensia',
    skip: 'Перейти к содержимому',
    title: 'Политика конфиденциальности',
    updated: 'Обновлено: 5 апреля 2026',
    noticeTitle: 'Черновик / тестовый деплой.',
    noticeText:
      'Документ опубликован для экспериментальной версии продукта. Перед публичным запуском рекомендуем юридическую проверку под вашу юрисдикцию (например, GDPR и местное право). Этот текст не является юридической консультацией.',
    lead:
      'Эта Политика объясняет, какие данные мы собираем, как их используем и какие права у вас есть при работе с Consensia.',
    partTitle: 'Политика конфиденциальности',
    partIntro:
      'Мы серьезно относимся к приватности. Ниже описано, какие данные собираются, как они используются и как реализуются ваши права.',
    sections: [
      {
        title: '1. Какие данные мы собираем',
        paragraphs: [
          'Профильные данные (через Google OAuth): email и имя. Используются только для идентификации и аутентификации аккаунта.',
          'Данные использования: история чатов, отправленные фрагменты кода и системные логи, необходимые для стабильности сессий.',
          'Платежная информация: статус подписки и Customer ID (безопасно обрабатываются Stripe).',
        ],
      },
      {
        title: '2. Обработка через сторонние AI API',
        paragraphs: [
          'Поскольку мы используем внешние AI-модели для анализа кода, тексты запросов (промпты и фрагменты кода) передаются через API нашим партнерам (например, OpenRouter, Google). Эти провайдеры обрабатывают данные только для генерации ответа. Мы выбираем партнеров с высоким уровнем безопасности, но не контролируем их внутренние алгоритмы.',
        ],
      },
      {
        title: '3. Использование данных для обучения и opt-out',
        paragraphs: [
          'Помимо передачи запросов в API для работы в реальном времени, мы храним историю чатов на наших серверах. Это может использоваться для последующего улучшения собственных алгоритмов оркестрации и моделей.',
          'Строгая анонимизация: данные для аналитики или будущего обучения обезличиваются и не связываются с вашим именем, email или платежными реквизитами.',
          'Как отказаться: вы можете в любой момент запретить использование данных для этих целей, отключив соответствующий переключатель в настройках аккаунта.',
        ],
      },
      {
        title: '4. Передача данных третьим сторонам',
        intro: 'Мы не продаем персональные данные рекламодателям. Передача выполняется только доверенным провайдерам для работы платформы:',
        bullets: [
          'AI API провайдеры: для генерации ответов на ваши запросы.',
          'Инфраструктурные провайдеры: для хостинга платформы и баз данных.',
          'Платежные провайдеры: Stripe для обработки транзакций.',
        ],
      },
      {
        title: '5. Cookies и tracking-технологии',
        paragraphs: [
          'Мы используем только необходимые cookies для базовой функциональности платформы (например, авторизация и безопасность сессии). Сторонние маркетинговые трекеры для таргетированной рекламы без явного согласия не используются.',
        ],
      },
      {
        title: '6. Ваши права (GDPR и CCPA)',
        intro: 'В зависимости от юрисдикции вы можете иметь право на:',
        bullets: [
          'Доступ: запросить копию персональных данных, которые мы храним.',
          'Исправление: запросить корректировку неточных данных.',
          'Удаление ("право быть забытым"): запросить полное удаление аккаунта и связанных данных.',
        ],
        paragraphs: [
          'Чтобы воспользоваться этими правами, свяжитесь с нами по email ниже или используйте опцию удаления аккаунта в профиле.',
        ],
      },
      {
        title: '7. Сроки хранения данных',
        paragraphs: [
          'Мы храним данные только пока аккаунт активен или это требуется для предоставления Сервиса и выполнения юридических обязательств. После удаления аккаунта персональные данные удаляются из активных баз обычно в течение 30 дней.',
        ],
      },
      {
        title: '8. Данные детей',
        paragraphs: [
          'Сервис не предназначен для лиц младше 16 лет. Мы не собираем персональные данные детей сознательно. Если такие данные были получены без согласия родителей, они удаляются.',
        ],
      },
      {
        title: '9. Изменения в политике',
        paragraphs: [
          'Мы можем периодически обновлять документ. О существенных изменениях (например, в правилах использования данных или ценовой модели) сообщаем по email или заметным уведомлением в сервисе.',
        ],
        hasPrivacyLink: true,
      },
      {
        title: '10. Контакты',
        paragraphs: ['Если у вас есть вопросы по этой Политике, напишите нам: support@faby.world'],
      },
    ],
  },
  ua: {
    docTitle: 'Політика конфіденційності · Consensia',
    skip: 'Перейти до вмісту',
    title: 'Політика конфіденційності',
    updated: 'Оновлено: 5 квітня 2026',
    noticeTitle: 'Чернетка / тестовий деплой.',
    noticeText:
      'Документ опубліковано для експериментальної версії продукту. Перед публічним запуском рекомендуємо юридичну перевірку під вашу юрисдикцію (наприклад, GDPR та місцеве право). Текст не є юридичною консультацією.',
    lead:
      'Ця Політика пояснює, які дані ми збираємо, як їх використовуємо та які права ви маєте під час використання Consensia.',
    partTitle: 'Політика конфіденційності',
    partIntro:
      'Ми серйозно ставимося до приватності. Нижче описано, які дані збираються, як вони використовуються та як реалізуються ваші права.',
    sections: [
      {
        title: '1. Які дані ми збираємо',
        paragraphs: [
          'Профільні дані (через Google OAuth): email і ім’я. Використовуються лише для ідентифікації та автентифікації акаунта.',
          'Дані використання: історія чатів, надіслані фрагменти коду та системні логи, необхідні для стабільності сесій.',
          'Платіжна інформація: статус підписки та Customer ID (безпечно обробляються Stripe).',
        ],
      },
      {
        title: '2. Обробка через сторонні AI API',
        paragraphs: [
          'Оскільки ми використовуємо зовнішні AI-моделі для аналізу коду, тексти запитів (промпти та фрагменти коду) передаються через API нашим партнерам (наприклад, OpenRouter, Google). Ці провайдери обробляють дані лише для генерації відповіді. Ми обираємо партнерів із високими стандартами безпеки, але не контролюємо їх внутрішні алгоритми.',
        ],
      },
      {
        title: '3. Використання даних для навчання та opt-out',
        paragraphs: [
          'Окрім надсилання запитів до API для роботи в реальному часі, ми зберігаємо історію чатів на наших серверах. Це може використовуватись для покращення власних алгоритмів оркестрації та моделей.',
          'Сувора анонімізація: дані для аналітики або майбутнього навчання знеособлюються і не пов’язуються з вашим ім’ям, email або платіжними реквізитами.',
          'Як відмовитися: ви можете в будь-який момент заборонити таке використання, вимкнувши відповідний перемикач у налаштуваннях акаунта.',
        ],
      },
      {
        title: '4. Передача даних третім сторонам',
        intro: 'Ми не продаємо персональні дані рекламодавцям. Передача виконується лише довіреним провайдерам для роботи платформи:',
        bullets: [
          'AI API провайдери: для генерації відповідей на ваші запити.',
          'Інфраструктурні провайдери: для хостингу платформи та баз даних.',
          'Платіжні провайдери: Stripe для обробки транзакцій.',
        ],
      },
      {
        title: '5. Cookies і tracking-технології',
        paragraphs: [
          'Ми використовуємо лише необхідні cookies для базової функціональності платформи (наприклад, авторизація та безпека сесії). Сторонні маркетингові трекери для таргетованої реклами без явної згоди не використовуються.',
        ],
      },
      {
        title: '6. Ваші права (GDPR і CCPA)',
        intro: 'Залежно від юрисдикції ви можете мати право на:',
        bullets: [
          'Доступ: запросити копію персональних даних, які ми зберігаємо.',
          'Виправлення: запросити корекцію неточних даних.',
          'Видалення ("право бути забутим"): запросити повне видалення акаунта і пов’язаних даних.',
        ],
        paragraphs: [
          'Щоб скористатися цими правами, зверніться на email нижче або використайте опцію видалення акаунта в профілі.',
        ],
      },
      {
        title: '7. Строки зберігання даних',
        paragraphs: [
          'Ми зберігаємо дані лише поки акаунт активний або це потрібно для надання Сервісу та виконання юридичних зобов’язань. Після видалення акаунта персональні дані зазвичай видаляються з активних баз протягом 30 днів.',
        ],
      },
      {
        title: '8. Дані дітей',
        paragraphs: [
          'Сервіс не призначений для осіб молодше 16 років. Ми не збираємо персональні дані дітей свідомо. Якщо такі дані були отримані без згоди батьків, вони видаляються.',
        ],
      },
      {
        title: '9. Зміни в політиці',
        paragraphs: [
          'Ми можемо періодично оновлювати документ. Про суттєві зміни (наприклад, у правилах використання даних або ціновій моделі) повідомляємо через email або помітне повідомлення в сервісі.',
        ],
        hasPrivacyLink: true,
      },
      {
        title: '10. Контакти',
        paragraphs: ['Якщо у вас є запитання щодо цієї Політики, напишіть нам: support@faby.world'],
      },
    ],
  },
  en: {
    docTitle: 'Privacy Policy · Consensia',
    skip: 'Skip to content',
    title: 'Privacy Policy',
    updated: 'Last updated: April 5, 2026',
    noticeTitle: 'Draft / test deployment.',
    noticeText:
      'This page describes the intended product and is published while the site is experimental. Before public launch, have the text reviewed for your jurisdiction. Nothing here is legal advice.',
    lead:
      'This Privacy Policy explains what data we collect, how we use it, and what rights you have regarding your data when using Consensia.',
    partTitle: 'Privacy Policy',
    partIntro:
      'We take your privacy seriously. This section explains what data we collect, how we use it, and your rights.',
    sections: [
      {
        title: '1. Data We Collect',
        paragraphs: [
          'Profile Data (via Google OAuth): your email address and name. This is used exclusively for account identification and authentication.',
          'Usage Data: your chat history, submitted code snippets, and system logs necessary to maintain session stability.',
          'Payment Information: your subscription status and Customer ID (processed securely by Stripe).',
        ],
      },
      {
        title: '2. Third-Party AI API Processing',
        paragraphs: [
          'Because we use external AI models to analyze your code, the text of your queries (prompts and code snippets) is transmitted via API to our partners (e.g., OpenRouter, Google). These providers process your data solely to generate a response. We select partners with high security standards, but we do not control their internal algorithms.',
        ],
      },
      {
        title: '3. Data Collection for Training and Opt-Out',
        paragraphs: [
          'In addition to sending requests to APIs for real-time operation, we store your chat histories on our servers. We do this to potentially improve our own future orchestration algorithms and models.',
          'Strict anonymization: any data we use for analytics or future training is anonymized and stripped of links to your name, email, or payment details.',
          'How to opt out: you can forbid this use at any time by turning off the relevant data-sharing option in your account settings.',
        ],
      },
      {
        title: '4. Data Sharing with Third Parties',
        intro: 'We do not sell your personal data to advertisers. We only share necessary data with trusted providers to operate our platform:',
        bullets: [
          'AI API providers: to generate responses to your queries.',
          'Infrastructure providers: to host platform services and databases.',
          'Payment gateways: Stripe, to process transactions.',
        ],
      },
      {
        title: '5. Cookies and Tracking Technologies',
        paragraphs: [
          'We use essential cookies strictly for core platform functionality (such as keeping you logged in and securing your session). We do not use third-party marketing trackers for targeted advertising without your explicit consent.',
        ],
      },
      {
        title: '6. Your Data Rights (GDPR and CCPA)',
        intro: 'Depending on your location, you may have the right to:',
        bullets: [
          'Access: request a copy of the personal data we hold about you.',
          'Correction: request correction of inaccurate data.',
          'Deletion ("right to be forgotten"): request complete deletion of your account and associated data.',
        ],
        paragraphs: [
          'To exercise these rights, contact us at the email below or use the account deletion option in your profile settings.',
        ],
      },
      {
        title: '7. Data Retention',
        paragraphs: [
          'We retain your information only as long as your account is active or as needed to provide the Service and comply with legal obligations. If you delete your account, personal data is removed from active databases, typically within 30 days.',
        ],
      },
      {
        title: "8. Children's Privacy",
        paragraphs: [
          'Our Service is not intended for individuals under 16. We do not knowingly collect personal data from children. If we discover such data without parental consent, we delete it.',
        ],
      },
      {
        title: '9. Changes to this Policy',
        paragraphs: [
          'We may update this document periodically. If we make significant changes (such as updates to data-usage rules or pricing models), we will notify you via email or a prominent notice within the service.',
        ],
        hasPrivacyLink: true,
      },
      {
        title: '10. Contact Us',
        paragraphs: ['If you have questions about this Privacy Policy, contact us at: support@faby.world'],
      },
    ],
  },
}

export default function PrivacyPolicyPage() {
  const { i18n } = useTranslation()
  const lang = String(i18n.resolvedLanguage || i18n.language || 'en').split('-')[0]
  const c = COPY[lang] || COPY.ru

  useEffect(() => {
    const prev = document.title
    document.title = c.docTitle
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => {
      document.title = prev
    }
  }, [c.docTitle])

  return (
    <div className="app legal-page">
      <a href="#legal-main" className="legal-page__skip">
        {c.skip}
      </a>
      <SiteHeader />

      <main id="legal-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">{c.title}</h1>
          <p className="legal-page__meta">{c.updated}</p>

          <aside className="legal-page__notice" role="note">
            <strong>{c.noticeTitle}</strong> {c.noticeText}
          </aside>

          <p className="legal-page__lead">{c.lead}</p>

          <section className="legal-page__part">
            <h2 className="legal-page__part-title">{c.partTitle}</h2>
            <p className="legal-page__section-intro">{c.partIntro}</p>
            {c.sections.map((section) => (
              <section key={section.title} className="legal-page__section">
                <h3>{section.title}</h3>
                {section.intro ? <p>{section.intro}</p> : null}
                {section.paragraphs?.map((p) => (
                  <p key={p}>
                    {p.includes('support@faby.world') ? (
                      <>
                        {p.replace('support@faby.world', '')}
                        <a href="mailto:support@faby.world">support@faby.world</a>
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
                {section.hasPrivacyLink ? (
                  <p>
                    <Link to="/privacy">/privacy</Link>
                  </p>
                ) : null}
                {section.bullets?.length ? (
                  <ul>
                    {section.bullets.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            ))}
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
