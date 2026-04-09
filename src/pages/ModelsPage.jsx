import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'
import './ModelsPage.scss'

const COPY = {
  ru: {
    docTitle: 'Модели · Consensia',
    eyebrow: 'Multi-Agent Review Pipeline',
    title: 'Модели',
    lead: 'В этом чате у каждой модели есть четкая специализация. Ниже показано, кто что проверяет и как формируется финальный вердикт.',
    expertsAria: 'Карточки экспертов',
    systemAria: 'Judge и Router',
    labels: {
      role: 'Роль',
      task: 'Задача',
      weight: 'Вес',
      temperature: 'Температура',
      focus: 'Фокус на',
      output: 'Формат ответа',
      mindset: 'Тип мышления',
    },
    experts: [
      {
        name: 'Security Expert',
        modelId: 'openai/o3-mini',
        role: 'Senior Security Engineer',
        task: 'Строгий аудит',
        focus: ['SQLi', 'XSS', 'Auth/Authz', 'Insecure API', 'Hardcoded Secrets', 'Unsafe Deserialization'],
        output: ['Фрагмент', 'Уязвимость', 'Эксплойт', 'Исправление'],
        constraint: 'Параноидальное мышление.',
        weight: 1.0,
        temperature: 'auto',
      },
      {
        name: 'Performance Architect',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Principal Performance Architect',
        task: 'Анализ узких мест',
        focus: ['Big-O', 'Память', 'Аллокации', 'I/O blocking', 'Масштабируемость'],
        output: ['Код', 'Сложность', 'Неэффективность', 'Оптимизация'],
        constraint: 'Математическая точность. Без общих советов.',
        weight: 0.8,
        temperature: 0.1,
      },
      {
        name: 'Clean Code Advocate',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Staff Software Engineer',
        task: 'Контроль качества',
        focus: ['SOLID', 'DRY', 'Именование', 'God-functions', 'Читаемость'],
        output: ['Проблемный код', 'Нарушенный принцип', 'Рефакторинг'],
        constraint: 'Строгая критика. Без комплиментов.',
        weight: 0.7,
        temperature: 0.2,
      },
      {
        name: 'Edge-Case Hunter',
        modelId: 'x-ai/grok-4.20-multi-agent',
        role: 'Lead QA (Breaking Systems)',
        task: 'Поиск edge cases',
        focus: ['Null/None', 'Пустые значения', 'Нагрузка', 'Race conditions', 'Часовые пояса', 'Границы'],
        output: ['Тестовый ввод', 'Причина сбоя', 'Защита/фикс'],
        constraint: 'Мышление злонамеренного тестировщика.',
        weight: 0.9,
        temperature: 0.7,
      },
    ],
    arbiter: {
      id: 'anthropic/claude-haiku-4.5,openai/gpt-4o',
      role: 'Финальный арбитр решений',
      purpose:
        'Judge — это финальный арбитр между экспертами. Он собирает их выводы в единый, согласованный вердикт с понятными приоритетами исправлений.',
      workflow: [
        {
          title: 'Как он анализирует',
          points: [
            'Сопоставляет выводы всех экспертов и проверяет, где аргументы реально подтверждены кодом.',
            'Отсеивает дубли, слабые гипотезы и советы без практической ценности.',
            'Разрешает конфликты между рекомендациями и выбирает наиболее безопасный и эффективный путь.',
          ],
        },
        {
          title: 'Что отдает в финале',
          points: [
            'Список критичных исправлений с приоритетом выполнения.',
            'Список улучшений, которые повышают качество.',
            'Единый итоговый вердикт.',
          ],
        },
      ],
    },
    router: {
      model: 'openai/gpt-4o-mini',
      role: 'Tech Lead Router',
      mission:
        'Router подбирает состав экспертов под конкретный фрагмент кода, чтобы проверка была полезной и без воды.',
      rules: [
        {
          title: 'Security Expert',
          text: 'Подключается, когда в коде есть ввод пользователя, API, база данных, авторизация или внешние интеграции.',
        },
        {
          title: 'Performance Architect',
          text: 'Подключается, если есть циклы, рекурсия, большие объемы данных или потенциальные риски масштабирования.',
        },
        {
          title: 'Clean Code Advocate',
          text: 'Подключается, когда код перегружен, сложно читается или требует улучшения структуры и именования.',
        },
        {
          title: 'Edge-Case Hunter',
          text: 'Подключается при рисках нестандартных входных данных, сложных ветвлений или конкурентных сценариев.',
        },
      ],
    },
  },
  uk: {
    docTitle: 'Моделі · Consensia',
    eyebrow: 'Multi-Agent Review Pipeline',
    title: 'Моделі',
    lead: 'У цьому чаті кожна модель має чітку спеціалізацію. Нижче показано, хто що перевіряє і як формується фінальний вердикт.',
    expertsAria: 'Картки експертів',
    systemAria: 'Judge і Router',
    labels: {
      role: 'Роль',
      task: 'Завдання',
      weight: 'Вага',
      temperature: 'Температура',
      focus: 'Фокус на',
      output: 'Формат відповіді',
      mindset: 'Тип мислення',
    },
    experts: [
      {
        name: 'Security Expert',
        modelId: 'openai/o3-mini',
        role: 'Senior Security Engineer',
        task: 'Суворий аудит',
        focus: ['SQLi', 'XSS', 'Auth/Authz', 'Insecure API', 'Hardcoded Secrets', 'Unsafe Deserialization'],
        output: ['Фрагмент', 'Вразливість', 'Експлойт', 'Виправлення'],
        constraint: 'Параноїдальне мислення.',
        weight: 1.0,
        temperature: 'auto',
      },
      {
        name: 'Performance Architect',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Principal Performance Architect',
        task: 'Аналіз вузьких місць',
        focus: ['Big-O', "Пам'ять", 'Алокації', 'I/O blocking', 'Масштабованість'],
        output: ['Код', 'Складність', 'Неефективність', 'Оптимізація'],
        constraint: 'Математична точність. Без загальних порад.',
        weight: 0.8,
        temperature: 0.1,
      },
      {
        name: 'Clean Code Advocate',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Staff Software Engineer',
        task: 'Контроль якості',
        focus: ['SOLID', 'DRY', 'Найменування', 'God-functions', 'Читабельність'],
        output: ['Проблемний код', 'Порушений принцип', 'Рефакторинг'],
        constraint: 'Сувора критика. Без компліментів.',
        weight: 0.7,
        temperature: 0.2,
      },
      {
        name: 'Edge-Case Hunter',
        modelId: 'x-ai/grok-4.20-multi-agent',
        role: 'Lead QA (Breaking Systems)',
        task: 'Пошук edge cases',
        focus: ['Null/None', 'Порожні значення', 'Навантаження', 'Race conditions', 'Часові пояси', 'Межі'],
        output: ['Тестовий ввід', 'Причина збою', 'Захист/фікс'],
        constraint: 'Мислення зловмисного тестувальника.',
        weight: 0.9,
        temperature: 0.7,
      },
    ],
    arbiter: {
      id: 'anthropic/claude-haiku-4.5,openai/gpt-4o',
      role: 'Фінальний арбітр рішень',
      purpose:
        'Judge — це фінальний арбітр між експертами. Він збирає їхні висновки в єдиний узгоджений вердикт із зрозумілими пріоритетами виправлень.',
      workflow: [
        {
          title: 'Як він аналізує',
          points: [
            'Зіставляє висновки всіх експертів і перевіряє, де аргументи реально підтверджені кодом.',
            'Відсіює дублікати, слабкі гіпотези та поради без практичної цінності.',
            'Розв’язує конфлікти між рекомендаціями і обирає найбезпечніший та найефективніший шлях.',
          ],
        },
        {
          title: 'Що видає у фіналі',
          points: [
            'Список критичних виправлень із пріоритетом виконання.',
            'Список покращень, що підвищують якість.',
            'Єдиний фінальний вердикт.',
          ],
        },
      ],
    },
    router: {
      model: 'openai/gpt-4o-mini',
      role: 'Tech Lead Router',
      mission:
        'Router підбирає склад експертів під конкретний фрагмент коду, щоб перевірка була корисною і без води.',
      rules: [
        {
          title: 'Security Expert',
          text: 'Підключається, коли в коді є введення користувача, API, база даних, авторизація або зовнішні інтеграції.',
        },
        {
          title: 'Performance Architect',
          text: 'Підключається, якщо є цикли, рекурсія, великі обсяги даних або потенційні ризики масштабування.',
        },
        {
          title: 'Clean Code Advocate',
          text: 'Підключається, коли код перевантажений, складно читається або потребує покращення структури та найменувань.',
        },
        {
          title: 'Edge-Case Hunter',
          text: 'Підключається за ризиків нестандартних вхідних даних, складних розгалужень або конкурентних сценаріїв.',
        },
      ],
    },
  },
  en: {
    docTitle: 'Models · Consensia',
    eyebrow: 'Multi-Agent Review Pipeline',
    title: 'Models',
    lead: 'Each model in this chat has a clear specialization. Below you can see who checks what and how the final verdict is formed.',
    expertsAria: 'Expert cards',
    systemAria: 'Judge and Router',
    labels: {
      role: 'Role',
      task: 'Task',
      weight: 'Weight',
      temperature: 'Temperature',
      focus: 'Focus on',
      output: 'Output format',
      mindset: 'Mindset',
    },
    experts: [
      {
        name: 'Security Expert',
        modelId: 'openai/o3-mini',
        role: 'Senior Security Engineer',
        task: 'Strict Audit',
        focus: ['SQLi', 'XSS', 'Auth/Authz', 'Insecure API', 'Hardcoded Secrets', 'Unsafe Deserialization'],
        output: ['Snippet', 'Vulnerability', 'Exploit', 'Fix'],
        constraint: 'Paranoid mindset.',
        weight: 1.0,
        temperature: 'auto',
      },
      {
        name: 'Performance Architect',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Principal Performance Architect',
        task: 'Bottleneck Analysis',
        focus: ['Big-O', 'Memory', 'Allocations', 'I/O blocking', 'Scalability'],
        output: ['Code', 'Complexity', 'Inefficiency', 'Optimization'],
        constraint: 'Mathematical precision. No generic advice.',
        weight: 0.8,
        temperature: 0.1,
      },
      {
        name: 'Clean Code Advocate',
        modelId: 'meta-llama/llama-4-maverick',
        role: 'Staff Software Engineer',
        task: 'Quality Enforcement',
        focus: ['SOLID', 'DRY', 'Naming', 'God-functions', 'Readability'],
        output: ['Problematic Code', 'Violated Principle', 'Refactored Code'],
        constraint: 'Strict critique. No compliments.',
        weight: 0.7,
        temperature: 0.2,
      },
      {
        name: 'Edge-Case Hunter',
        modelId: 'x-ai/grok-4.20-multi-agent',
        role: 'Lead QA (Breaking Systems)',
        task: 'Find Edge Cases',
        focus: ['Null/None', 'Empty', 'Stress', 'Race conditions', 'Timezones', 'Boundaries'],
        output: ['Test Input', 'Failure Reason', 'Guard/Fix Suggestion'],
        constraint: 'Malicious tester mindset.',
        weight: 0.9,
        temperature: 0.7,
      },
    ],
    arbiter: {
      id: 'anthropic/claude-haiku-4.5,openai/gpt-4o',
      role: 'Final Decision Arbiter',
      purpose:
        'Judge is the final arbiter between experts. It consolidates their findings into one aligned verdict with clear fix priorities.',
      workflow: [
        {
          title: 'How it analyzes',
          points: [
            'Compares findings from all experts and checks where arguments are truly supported by code.',
            'Filters duplicates, weak hypotheses, and advice with low practical value.',
            'Resolves conflicts between recommendations and picks the safest and most effective path.',
          ],
        },
        {
          title: 'What it returns',
          points: [
            'A prioritized list of critical fixes.',
            'A list of quality improvements.',
            'One unified final verdict.',
          ],
        },
      ],
    },
    router: {
      model: 'openai/gpt-4o-mini',
      role: 'Tech Lead Router',
      mission:
        'Router selects the expert set for each code fragment so that the review stays useful and concise.',
      rules: [
        {
          title: 'Security Expert',
          text: 'Activated when code includes user input, APIs, databases, authorization, or external integrations.',
        },
        {
          title: 'Performance Architect',
          text: 'Activated when there are loops, recursion, large data volumes, or scaling risks.',
        },
        {
          title: 'Clean Code Advocate',
          text: 'Activated when code is overloaded, hard to read, or needs better structure and naming.',
        },
        {
          title: 'Edge-Case Hunter',
          text: 'Activated for non-standard inputs, complex branching, or concurrent scenarios.',
        },
      ],
    },
  },
}

function prettyModelName(modelId) {
  const id = String(modelId ?? '').trim()
  if (!id) return ''
  const map = {
    'openai/o3-mini': 'OpenAI o3-mini',
    'meta-llama/llama-4-maverick': 'Meta Llama 4 Maverick',
    'x-ai/grok-4.20-multi-agent': 'xAI Grok 4.20 Multi-Agent',
    'anthropic/claude-haiku-4.5': 'Anthropic Claude Haiku 4.5',
    'openai/gpt-4o': 'OpenAI GPT-4o',
    'openai/gpt-4o-mini': 'OpenAI GPT-4o mini',
  }
  return map[id] || id
}

function prettyModelList(value) {
  return String(value ?? '')
    .split(',')
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => prettyModelName(x))
    .join(' + ')
}

function ExpertCard({ expert, labels }) {
  return (
    <article className="experts-page__card">
      <header className="experts-page__card-head">
        <h2>{expert.name}</h2>
        <code title={expert.modelId}>{prettyModelName(expert.modelId)}</code>
      </header>
      <p className="experts-page__meta">
        <strong>{labels.role}:</strong> {expert.role}
      </p>
      <p className="experts-page__meta">
        <strong>{labels.task}:</strong> {expert.task}
      </p>
      <p className="experts-page__meta">
        <strong>{labels.weight}:</strong> {expert.weight} <strong>{labels.temperature}:</strong>{' '}
        {expert.temperature}
      </p>

      <div className="experts-page__block">
        <h3>{labels.focus}</h3>
        <div className="experts-page__chips">
          {expert.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="experts-page__block">
        <h3>{labels.output}</h3>
        <ol>
          {expert.output.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="experts-page__constraint">
        <strong>{labels.mindset}:</strong> {expert.constraint}
      </p>
    </article>
  )
}

export default function ModelsPage() {
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
    <main className="experts-page">
      <SiteHeader />

      <Reveal>
        <section className="experts-page__hero">
          <p className="experts-page__eyebrow">{c.eyebrow}</p>
          <h1>{c.title}</h1>
          <p>{c.lead}</p>
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__grid" aria-label={c.expertsAria}>
          {c.experts.map((expert) => (
            <ExpertCard key={expert.name} expert={expert} labels={c.labels} />
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__system" aria-label={c.systemAria}>
          <article className="experts-page__panel">
            <header className="experts-page__panel-head">
              <h2>Judge / Arbiter</h2>
              <code title={c.arbiter.id}>{prettyModelList(c.arbiter.id)}</code>
            </header>
            <p>
              <strong>{c.labels.role}:</strong> {c.arbiter.role}
            </p>
            <p className="experts-page__arbiter-lead">{c.arbiter.purpose}</p>
            <div className="experts-page__arbiter-grid">
              {c.arbiter.workflow.map((section) => (
                <section key={section.title} className="experts-page__arbiter-block">
                  <h3>{section.title}</h3>
                  <ul>
                    {section.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </article>

          <article className="experts-page__panel">
            <header className="experts-page__panel-head">
              <h2>Router</h2>
              <code title={c.router.model}>{prettyModelName(c.router.model)}</code>
            </header>
            <p>
              <strong>{c.labels.role}:</strong> {c.router.role}
            </p>
            <p className="experts-page__router-lead">{c.router.mission}</p>
            <div className="experts-page__router-grid">
              {c.router.rules.map((rule) => (
                <section key={rule.title} className="experts-page__router-rule">
                  <h3>{rule.title}</h3>
                  <p>{rule.text}</p>
                </section>
              ))}
            </div>
          </article>
        </section>
      </Reveal>

      <SiteFooter />
    </main>
  )
}
