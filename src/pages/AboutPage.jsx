import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'

const COPY = {
  ru: {
    docTitle: 'О нас · Consensia',
    title: 'О нас',
    lead:
      'Consensia - это multi-agent платформа для анализа кода: несколько AI-экспертов последовательно проверяют задачу с разных сторон, а затем арбитр формирует единый итоговый вердикт. Наша цель - чтобы вы получали не случайный ответ, а согласованное решение с понятной структурой и приоритетами.',
    sections: [
      {
        title: 'Что происходит после нажатия «Запустить»',
        bullets: [
          'Вы отправляете код, контекст задачи, режим и число раундов обсуждения (1-3).',
          'Клиент открывает WebSocket-соединение с оркестратором и передает параметры сессии.',
          'Эксперты публикуют отчеты по раундам, затем формируется финальный вердикт и финальный код.',
          'После завершения раундов чат не закрывается: можно задавать follow-up вопросы в этой же сессии.',
        ],
      },
      {
        title: 'Почему multi-agent подход лучше одиночного ответа',
        paragraphs: [
          'Один ответ модели может быть быстрым, но часто зависит от случайности формулировки и угла зрения. В Consensia задача проходит через несколько ролей: безопасность, производительность, читаемость, edge-cases. Это снижает риск уверенно неверных рекомендаций и улучшает качество финального результата.',
        ],
        bullets: [
          'Параллельная экспертиза по разным направлениям.',
          'Арбитраж конфликтующих рекомендаций.',
          'Единая финальная версия с приоритетами исправлений.',
        ],
      },
      {
        title: 'Роли в пайплайне',
        paragraphs: [
          'На практике пайплайн разделен на две части: эксперты и управляющий слой. Эксперты дают узкоспециализированные замечания, Judge / Arbiter синтезирует финальный вывод, а Router определяет, каких экспертов подключать к конкретной задаче.',
        ],
        link: {
          before: 'Подробный состав ролей и используемых моделей доступен на странице',
          label: '«Модели»',
          href: '/models',
        },
      },
      {
        title: 'Режимы работы',
        paragraphs: [
          'В интерфейсе доступны три режима: «Экономия», «Баланс» и «Максимум». Они позволяют выбрать предпочтение между стоимостью и глубиной анализа.',
          'На фронтенде режим передается как параметр запуска сессии; фактическая стратегия выбора моделей и интенсивность оркестрации определяются серверной частью.',
        ],
      },
      {
        title: 'История сессий и восстановление контекста',
        paragraphs: [
          'Каждая сессия сохраняется на сервере и доступна из боковой истории. При повторном открытии мы восстанавливаем порядок сообщений так, чтобы он оставался логичным: постановка задачи -> блок экспертного анализа и финального вердикта -> дальнейший follow-up чат.',
        ],
        bullets: [
          'Сессии можно открывать, продолжать и удалять.',
          'Заголовок истории берется из вашей исходной постановки задачи.',
          'Финальный вердикт закрепляется в исходной позиции диалога и не прыгает вниз.',
        ],
      },
      {
        title: 'Кредиты и прозрачность расхода',
        paragraphs: [
          'Расход отображается в кредитах с простой формулой: примерно 1000 токенов = 1 кредит. Значение обновляется в процессе диалога и корректно восстанавливается при открытии прошлых сессий.',
        ],
        bullets: [
          'В профиле видно текущий баланс.',
          'В области композера видно «Кредитов потрачено» по активной сессии.',
          'Для пополнения используется Stripe Checkout.',
        ],
      },
      {
        title: 'Работа с кодом и вложениями',
        paragraphs: [
          'В сессию можно передавать не только основной фрагмент кода, но и дополнительные файлы. Это помогает анализировать задачу целиком, а не в отрыве от контекста.',
        ],
        bullets: [
          'Поддерживается загрузка нескольких файлов за один запуск.',
          'Текст файлов добавляется в общий контекст анализа.',
          'После старта можно продолжать диалог в этой же сессии без потери контекста.',
        ],
      },
      {
        title: 'Качество вывода и удобство чтения',
        paragraphs: [
          'Мы уделяем много внимания не только качеству ответа, но и его форме: длинные блоки можно сворачивать, код подсвечивается, markdown форматируется, а артефакты поточного вывода нормализуются для читаемости.',
        ],
        bullets: [
          'Сворачиваемые секции для экспертных ответов, вердикта, diff и кода.',
          'Поддержка markdown с корректным отображением списков и блоков кода.',
          'Мобильный интерфейс с выдвижной историей и адаптивным composer.',
        ],
      },
      {
        title: 'Безопасность доступа и аккаунт',
        paragraphs: [
          'Вход в продукт реализован через Google OAuth. После авторизации пользователь получает доступ к личным сессиям, профилю и кредитному балансу.',
          'Клиент использует access token и механизм обновления сессии на API-уровне, чтобы минимизировать разрывы авторизации в процессе работы.',
        ],
      },
      {
        title: 'Данные и приватность',
        paragraphs: ['В интерфейсе есть переключатель «Сбор данных», а юридические условия обработки данных вынесены в отдельные документы.'],
        legalLinks: {
          before: 'Для деталей по хранению, обработке и правам пользователя используйте страницы',
          privacyLabel: 'Privacy Policy',
          termsLabel: 'Terms of Service',
        },
      },
      {
        title: 'Для кого Consensia',
        bullets: [
          'Для разработчиков, которым нужен быстрый multi-angle code review.',
          'Для команд, где важна объяснимость рекомендаций, а не магический ответ.',
          'Для задач, где нужно одновременно держать в фокусе безопасность, качество и производительность.',
        ],
      },
      {
        title: 'Команда',
        paragraphs: ['Мы развиваем продукт на стыке UX, фронтенд-инженерии, backend-оркестрации и AI pipeline-дизайна.'],
        link: {
          before: 'Подробнее о разработчиках - на странице',
          label: '«Разработчики»',
          href: '/developers',
        },
      },
    ],
  },
  uk: {
    docTitle: 'Про нас · Consensia',
    title: 'Про нас',
    lead:
      'Consensia — це multi-agent платформа для аналізу коду: кілька AI-експертів послідовно перевіряють задачу з різних боків, а потім арбітр формує єдиний підсумковий вердикт. Наша мета — щоб ви отримували не випадкову відповідь, а узгоджене рішення зі зрозумілою структурою і пріоритетами.',
    sections: [
      {
        title: 'Що відбувається після натискання «Запустити»',
        bullets: [
          'Ви надсилаєте код, контекст задачі, режим і кількість раундів обговорення (1-3).',
          'Клієнт відкриває WebSocket-з’єднання з оркестратором і передає параметри сесії.',
          'Експерти публікують звіти по раундах, після чого формується фінальний вердикт і фінальний код.',
          'Після завершення раундів чат не закривається: можна ставити follow-up запитання в цій самій сесії.',
        ],
      },
      {
        title: 'Чому multi-agent підхід кращий за одиничну відповідь',
        paragraphs: [
          'Одна відповідь моделі може бути швидкою, але часто залежить від випадковості формулювання й кута зору. У Consensia задача проходить через кілька ролей: безпека, продуктивність, читабельність, edge-cases. Це знижує ризик упевнено помилкових рекомендацій і покращує якість фінального результату.',
        ],
        bullets: [
          'Паралельна експертиза за різними напрямами.',
          'Арбітраж конфліктних рекомендацій.',
          'Єдина фінальна версія з пріоритетами виправлень.',
        ],
      },
      {
        title: 'Ролі в пайплайні',
        paragraphs: [
          'На практиці пайплайн поділено на дві частини: експерти та керуючий шар. Експерти дають вузькоспеціалізовані зауваження, Judge / Arbiter синтезує фінальний висновок, а Router визначає, яких експертів підключати до конкретної задачі.',
        ],
        link: {
          before: 'Детальний склад ролей і моделей доступний на сторінці',
          label: '«Моделі»',
          href: '/models',
        },
      },
      {
        title: 'Режими роботи',
        paragraphs: [
          'В інтерфейсі доступні три режими: «Економія», «Баланс» і «Максимум». Вони дозволяють вибрати баланс між вартістю та глибиною аналізу.',
          'На фронтенді режим передається як параметр запуску сесії; фактична стратегія вибору моделей та інтенсивність оркестрації визначаються серверною частиною.',
        ],
      },
      {
        title: 'Історія сесій і відновлення контексту',
        paragraphs: [
          'Кожна сесія зберігається на сервері та доступна з бічної історії. При повторному відкритті ми відновлюємо порядок повідомлень так, щоб він залишався логічним: постановка задачі -> блок експертного аналізу і фінального вердикту -> подальший follow-up чат.',
        ],
        bullets: [
          'Сесії можна відкривати, продовжувати та видаляти.',
          'Заголовок історії береться з вашої початкової постановки задачі.',
          'Фінальний вердикт закріплюється у вихідній позиції діалогу і не стрибає вниз.',
        ],
      },
      {
        title: 'Кредити й прозорість витрат',
        paragraphs: [
          'Витрати відображаються в кредитах за простою формулою: приблизно 1000 токенів = 1 кредит. Значення оновлюється під час діалогу й коректно відновлюється при відкритті минулих сесій.',
        ],
        bullets: [
          'У профілі видно поточний баланс.',
          'В області композера видно «Кредитів витрачено» для активної сесії.',
          'Для поповнення використовується Stripe Checkout.',
        ],
      },
      {
        title: 'Робота з кодом і вкладеннями',
        paragraphs: [
          'У сесію можна передавати не лише основний фрагмент коду, а й додаткові файли. Це допомагає аналізувати задачу цілісно, а не без контексту.',
        ],
        bullets: [
          'Підтримується завантаження кількох файлів за один запуск.',
          'Текст файлів додається у спільний контекст аналізу.',
          'Після старту можна продовжувати діалог у цій самій сесії без втрати контексту.',
        ],
      },
      {
        title: 'Якість виводу й зручність читання',
        paragraphs: [
          'Ми приділяємо багато уваги не лише якості відповіді, а й її формі: довгі блоки можна згортати, код підсвічується, markdown форматується, а артефакти потокового виводу нормалізуються для читабельності.',
        ],
        bullets: [
          'Згортані секції для експертних відповідей, вердикту, diff і коду.',
          'Підтримка markdown з коректним відображенням списків і блоків коду.',
          'Мобільний інтерфейс із висувною історією та адаптивним composer.',
        ],
      },
      {
        title: 'Безпека доступу й акаунт',
        paragraphs: [
          'Вхід у продукт реалізований через Google OAuth. Після авторизації користувач отримує доступ до особистих сесій, профілю та кредитного балансу.',
          'Клієнт використовує access token і механізм оновлення сесії на рівні API, щоб мінімізувати розриви авторизації під час роботи.',
        ],
      },
      {
        title: 'Дані й приватність',
        paragraphs: ['В інтерфейсі є перемикач «Збір даних», а юридичні умови обробки даних винесені в окремі документи.'],
        legalLinks: {
          before: 'Для деталей щодо зберігання, обробки та прав користувача використовуйте сторінки',
          privacyLabel: 'Privacy Policy',
          termsLabel: 'Terms of Service',
        },
      },
      {
        title: 'Для кого Consensia',
        bullets: [
          'Для розробників, яким потрібен швидкий multi-angle code review.',
          'Для команд, де важлива пояснюваність рекомендацій, а не магічна відповідь.',
          'Для задач, де треба одночасно тримати у фокусі безпеку, якість і продуктивність.',
        ],
      },
      {
        title: 'Команда',
        paragraphs: ['Ми розвиваємо продукт на стику UX, фронтенд-інженерії, backend-оркестрації та AI pipeline-дизайну.'],
        link: {
          before: 'Детальніше про розробників — на сторінці',
          label: '«Розробники»',
          href: '/developers',
        },
      },
    ],
  },
  en: {
    docTitle: 'About · Consensia',
    title: 'About',
    lead:
      'Consensia is a multi-agent platform for code analysis: multiple AI experts review the task from different angles, and then an arbiter produces one final verdict. Our goal is to provide not a random answer, but an aligned solution with clear structure and priorities.',
    sections: [
      {
        title: 'What happens after pressing "Run"',
        bullets: [
          'You submit code, task context, mode, and number of discussion rounds (1-3).',
          'The client opens a WebSocket connection to the orchestrator and sends session parameters.',
          'Experts publish round reports, then a final verdict and final code are generated.',
          'After rounds finish, the chat stays open: you can ask follow-up questions in the same session.',
        ],
      },
      {
        title: 'Why a multi-agent approach is better than a single answer',
        paragraphs: [
          'A single model answer can be fast, but it often depends on prompt randomness and perspective. In Consensia, a task goes through multiple roles: security, performance, readability, and edge cases. This lowers the risk of confidently wrong recommendations and improves final quality.',
        ],
        bullets: [
          'Parallel expertise across different domains.',
          'Arbitration for conflicting recommendations.',
          'One final version with fix priorities.',
        ],
      },
      {
        title: 'Pipeline roles',
        paragraphs: [
          'In practice, the pipeline is split into two parts: experts and control layer. Experts provide focused feedback, Judge / Arbiter synthesizes the final conclusion, and Router decides which experts to involve for each task.',
        ],
        link: {
          before: 'Detailed role and model composition is available on the',
          label: '“Models”',
          href: '/models',
        },
      },
      {
        title: 'Working modes',
        paragraphs: [
          'The interface provides three modes: "Economy", "Balance", and "Maximum". They let you choose between cost and analysis depth.',
          'On the frontend, mode is sent as a session-start parameter; actual model-selection strategy and orchestration intensity are defined on the server side.',
        ],
      },
      {
        title: 'Session history and context restoration',
        paragraphs: [
          'Each session is stored on the server and available in side history. On reopen, we restore message order so it stays logical: task statement -> expert analysis and final verdict -> follow-up chat.',
        ],
        bullets: [
          'Sessions can be opened, continued, and deleted.',
          'History title is taken from your original task statement.',
          'The final verdict stays anchored in its original dialog position.',
        ],
      },
      {
        title: 'Credits and transparent usage',
        paragraphs: [
          'Usage is shown in credits with a simple formula: roughly 1000 tokens = 1 credit. Values update during the dialogue and restore correctly for past sessions.',
        ],
        bullets: [
          'Current balance is visible in profile.',
          'Composer shows "Credits spent" for the active session.',
          'Top-ups are processed through Stripe Checkout.',
        ],
      },
      {
        title: 'Working with code and attachments',
        paragraphs: [
          'A session can include not only the main code snippet but also additional files. This helps analyze the task in full context.',
        ],
        bullets: [
          'Multiple files can be uploaded in one run.',
          'File text is added to shared analysis context.',
          'After start, you can continue in the same session without context loss.',
        ],
      },
      {
        title: 'Output quality and readability',
        paragraphs: [
          'We focus not only on answer quality, but also on format: long blocks can be collapsed, code is highlighted, markdown is formatted, and streaming artifacts are normalized for readability.',
        ],
        bullets: [
          'Collapsible sections for expert responses, verdict, diff, and code.',
          'Markdown support with proper list and code block rendering.',
          'Mobile interface with slide-out history and adaptive composer.',
        ],
      },
      {
        title: 'Access security and account',
        paragraphs: [
          'Product login is implemented via Google OAuth. After authorization, users get access to personal sessions, profile, and credit balance.',
          'The client uses an access token and session-refresh mechanisms at API level to minimize authorization interruptions.',
        ],
      },
      {
        title: 'Data and privacy',
        paragraphs: ['The interface includes a "Data collection" toggle, while legal data-processing terms are published in separate documents.'],
        legalLinks: {
          before: 'For details on storage, processing, and user rights, see',
          privacyLabel: 'Privacy Policy',
          termsLabel: 'Terms of Service',
        },
      },
      {
        title: 'Who Consensia is for',
        bullets: [
          'Developers who need fast multi-angle code review.',
          'Teams that value explainability over a magical answer.',
          'Tasks that require balancing security, quality, and performance.',
        ],
      },
      {
        title: 'Team',
        paragraphs: ['We build the product at the intersection of UX, frontend engineering, backend orchestration, and AI pipeline design.'],
        link: {
          before: 'More about the team is on the',
          label: '“Developers”',
          href: '/developers',
        },
      },
    ],
  },
}

export default function AboutPage() {
  const { i18n } = useTranslation()
  const lang = String(i18n.resolvedLanguage || i18n.language || 'ru').split('-')[0]
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
      <SiteHeader />

      <main className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <Reveal>
            <h1 className="legal-page__title">{c.title}</h1>
            <p className="legal-page__lead">{c.lead}</p>
          </Reveal>

          {c.sections.map((section) => (
            <Reveal key={section.title}>
              <section className="legal-page__section">
                <h2>{section.title}</h2>
                {section.paragraphs?.map((p) => <p key={p}>{p}</p>)}
                {section.link ? (
                  <p>
                    {section.link.before}{' '}
                    <a href={section.link.href}>{section.link.label}</a>.
                  </p>
                ) : null}
                {section.legalLinks ? (
                  <p>
                    {section.legalLinks.before} <a href="/privacy">{section.legalLinks.privacyLabel}</a> /{' '}
                    <a href="/terms">{section.legalLinks.termsLabel}</a>.
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
            </Reveal>
          ))}
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
