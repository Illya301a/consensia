import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'

const COPY = {
  ru: {
    docTitle: 'Условия использования · Consensia',
    skip: 'Перейти к содержимому',
    title: 'Условия использования',
    updated: 'Обновлено: 5 апреля 2026',
    noticeTitle: 'Черновик / тестовый деплой.',
    noticeText:
      'Страница опубликована в период экспериментальной стадии продукта. Перед публичным запуском рекомендуем юридическую проверку текста под вашу юрисдикцию. Содержимое не является юридической консультацией.',
    lead:
      'Используя Consensia, вы соглашаетесь с этими Условиями использования. Если вы не согласны, пожалуйста, не используйте Сервис.',
    sections: [
      {
        title: '1. Регистрация и аккаунт',
        paragraphs: [
          'Обязательная регистрация: для использования Сервиса (включая бесплатный тариф) требуется аккаунт.',
          'Аутентификация: используется безопасная авторизация через Google OAuth. Вы обязуетесь предоставлять корректные данные и отвечаете за безопасность аккаунта.',
        ],
      },
      {
        title: '2. Тарифы, кредиты и платежи',
        paragraphs: [
          'Новые пользователи могут получать ограниченное количество приветственных кредитов. Лимиты и цены могут меняться.',
          'Кредиты списываются по фактическому использованию моделей (входные/выходные токены и сложность). Баланс доступен в аккаунте.',
          'Купленные кредиты обычно не подлежат возврату после частичного использования, кроме случаев, предусмотренных законом.',
          'Платежи обрабатываются через Stripe. Полные данные банковских карт на наших серверах не хранятся.',
        ],
      },
      {
        title: '3. Допустимое использование',
        intro: 'Вы соглашаетесь не использовать Сервис для:',
        bullets: [
          'Нарушения законодательства, авторских прав или лицензий.',
          'Попыток взлома, DDoS-атак или реверс-инжиниринга систем платформы.',
          'Создания вредоносного ПО, эксплойтов или проведения незаконных кибератак.',
        ],
      },
      {
        title: '4. Отказ от гарантий и ограничение ответственности',
        paragraphs: [
          'Сервис использует сторонние AI API и не гарантирует бесперебойную доступность или абсолютную точность.',
          'Вы несете ответственность за проверку и тестирование результатов перед использованием в продакшене.',
          'Сервис предоставляется «как есть» и «по мере доступности», без гарантий. Мы не несем ответственности за прямые и косвенные убытки, связанные с использованием Сервиса.',
        ],
      },
      {
        title: '5. Интеллектуальная собственность',
        paragraphs: [
          'Ваш код: вы сохраняете права на код, который отправляете в сервис.',
          'Наша платформа: интерфейс, логика оркестрации, бренд и инфраструктура принадлежат Consensia.',
        ],
      },
      {
        title: '6. Прекращение доступа',
        paragraphs: [
          'Мы можем временно ограничить или полностью прекратить доступ к аккаунту при нарушении этих Условий, включая злоупотребления, обход лимитов, спам и мошенничество с платежами.',
        ],
      },
      {
        title: '7. Контакты',
        paragraphs: ['Вопросы по Условиям использования: support@faby.world'],
      },
    ],
  },
  ua: {
    docTitle: 'Умови використання · Consensia',
    skip: 'Перейти до вмісту',
    title: 'Умови використання',
    updated: 'Оновлено: 5 квітня 2026',
    noticeTitle: 'Чернетка / тестовий деплой.',
    noticeText:
      'Сторінка опублікована на етапі експериментального продукту. Перед публічним запуском рекомендуємо юридичну перевірку тексту під вашу юрисдикцію. Вміст не є юридичною консультацією.',
    lead:
      'Користуючись Consensia, ви погоджуєтесь із цими Умовами використання. Якщо ви не згодні, будь ласка, не використовуйте Сервіс.',
    sections: [
      {
        title: '1. Реєстрація та акаунт',
        paragraphs: [
          'Обов’язкова реєстрація: для використання Сервісу (включно з безкоштовним тарифом) потрібен акаунт.',
          'Автентифікація: використовується безпечний вхід через Google OAuth. Ви зобов’язуєтесь надавати коректні дані та відповідати за безпеку акаунта.',
        ],
      },
      {
        title: '2. Тарифи, кредити та платежі',
        paragraphs: [
          'Нові користувачі можуть отримувати обмежену кількість стартових кредитів. Ліміти та ціни можуть змінюватися.',
          'Кредити списуються за фактичним використанням моделей (вхідні/вихідні токени та складність). Баланс доступний в акаунті.',
          'Куплені кредити зазвичай не повертаються після часткового використання, окрім випадків, передбачених законом.',
          'Платежі обробляються через Stripe. Повні дані банківських карт на наших серверах не зберігаються.',
        ],
      },
      {
        title: '3. Допустиме використання',
        intro: 'Ви погоджуєтесь не використовувати Сервіс для:',
        bullets: [
          'Порушення законодавства, авторських прав або ліцензій.',
          'Спроб злому, DDoS-атак або реверс-інжинірингу систем платформи.',
          'Створення шкідливого ПЗ, експлойтів або незаконних кібератак.',
        ],
      },
      {
        title: '4. Відмова від гарантій та обмеження відповідальності',
        paragraphs: [
          'Сервіс використовує сторонні AI API і не гарантує безперервну доступність або абсолютну точність.',
          'Ви несете відповідальність за перевірку й тестування результатів перед використанням у продакшені.',
          'Сервіс надається «як є» і «за наявності», без гарантій. Ми не несемо відповідальності за прямі або непрямі збитки, пов’язані з використанням Сервісу.',
        ],
      },
      {
        title: '5. Інтелектуальна власність',
        paragraphs: [
          'Ваш код: ви зберігаєте права на код, який надсилаєте в сервіс.',
          'Наша платформа: інтерфейс, логіка оркестрації, бренд і інфраструктура належать Consensia.',
        ],
      },
      {
        title: '6. Припинення доступу',
        paragraphs: [
          'Ми можемо тимчасово обмежити або повністю припинити доступ до акаунта у разі порушення цих Умов, включно зі зловживаннями, обходом лімітів, спамом або платіжним шахрайством.',
        ],
      },
      {
        title: '7. Контакти',
        paragraphs: ['Питання щодо Умов використання: support@faby.world'],
      },
    ],
  },
  en: {
    docTitle: 'Terms of Service · Consensia',
    skip: 'Skip to content',
    title: 'Terms of Service',
    updated: 'Last updated: April 5, 2026',
    noticeTitle: 'Draft / test deployment.',
    noticeText:
      'This page is published while the product is experimental. Before public launch, have this text reviewed for your jurisdiction. Nothing here is legal advice.',
    lead:
      'By accessing or using Consensia, you agree to these Terms of Service. If you do not agree, please do not use the Service.',
    sections: [
      {
        title: '1. Registration and Account',
        paragraphs: [
          'Mandatory registration: to use the Service (including free tier), you must create an account.',
          'Authentication: we use secure third-party authentication (Google OAuth). You agree to provide accurate information and are responsible for account security.',
        ],
      },
      {
        title: '2. Pricing, Credits, and Payments',
        paragraphs: [
          'New users may receive limited complimentary credits. Limits and pricing can change.',
          'Credits are consumed based on actual model usage (input/output tokens and complexity). You can monitor the balance in your account.',
          'Purchased credits are generally non-refundable once partially used, except where required by law.',
          'Payments are processed by Stripe. We do not store full card details on our servers.',
        ],
      },
      {
        title: '3. Acceptable Use',
        intro: 'You agree not to use the Service to:',
        bullets: [
          'Violate laws, copyrights, or licenses.',
          'Attempt to hack, DDoS, or reverse-engineer platform systems.',
          'Generate malware, exploits, or perform illegal cyberattacks.',
        ],
      },
      {
        title: '4. Disclaimer and Limitation of Liability',
        paragraphs: [
          'The Service relies on third-party AI APIs and does not guarantee uninterrupted availability or absolute accuracy.',
          'You are responsible for reviewing and testing generated outputs before production use.',
          'The Service is provided "AS IS" and "AS AVAILABLE" without warranties. We are not liable for direct or indirect damages from use of the Service.',
        ],
      },
      {
        title: '5. Intellectual Property',
        paragraphs: [
          'Your Code: you retain ownership of the code you submit.',
          'Our Platform: the interface, orchestration logic, branding, and infrastructure belong to Consensia.',
        ],
      },
      {
        title: '6. Account Termination',
        paragraphs: [
          'We may suspend or terminate accounts for violations of these Terms, including abuse, attempts to bypass limits, spam, or payment fraud.',
        ],
      },
      {
        title: '7. Contact Us',
        paragraphs: ['Questions about these Terms: support@faby.world'],
      },
    ],
  },
}

export default function TermsOfServicePage() {
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
          {c.sections.map((section) => (
            <section key={section.title} className="legal-page__section">
              <h2>{section.title}</h2>
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
              {section.bullets?.length ? (
                <ul>
                  {section.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
