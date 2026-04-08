import { useEffect } from 'react'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'
import SiteHeader from '../components/SiteHeader.jsx'
import { Reveal } from '../components/Reveal.jsx'
import './ModelsPage.scss'

const TITLE = 'Модели · Consensia'

const EXPERTS = [
  {
    name: 'Security Expert',
    modelId: 'openai/o3-mini',
    role: 'Senior Security Engineer',
    task: 'Strict Audit',
    focus: ['SQLi', 'XSS', 'Auth/Authz', 'Insecure API', 'Hardcoded Secrets', 'Unsafe Deserialization'],
    output: ['Snippet', 'Vulnerability', 'Exploit', 'Fix'],
    constraint: "Paranoid mindset.",
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
]

const ARBITER = {
  name: 'Judge',
  id: 'anthropic/claude-haiku-4.5,openai/gpt-4o',
  role: 'Final Decision Arbiter',
  purpose:
    'Judge — это финальный арбитр между экспертами. Он собирает их выводы в единый, согласованный вердикт с понятными приоритетами исправлений.',
  workflow: [
    {
      title: 'Как он анализирует',
      points: [
        'Сопоставляет выводы всех экспертов и проверяет, где аргументы реально подтверждены кодом.',
        'Отсеивает дубли, слабые гипотезы и советы без практической ценности.',
        'Разрешает конфликты между рекомендациями и выбирает наиболее безопасный/эффективный путь.',
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
}

const ROUTER = {
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

function ExpertCard({ expert }) {
  return (
    <article className="experts-page__card">
      <header className="experts-page__card-head">
        <h2>{expert.name}</h2>
        <code title={expert.modelId}>{prettyModelName(expert.modelId)}</code>
      </header>
      <p className="experts-page__meta">
        <strong>Роль:</strong> {expert.role}
      </p>
      <p className="experts-page__meta">
        <strong>Задача:</strong> {expert.task}
      </p>
      <p className="experts-page__meta">
        <strong>Weight:</strong> {expert.weight} <strong>Temperature:</strong> {expert.temperature}
      </p>

      <div className="experts-page__block">
        <h3>Фокус на</h3>
        <div className="experts-page__chips">
          {expert.focus.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>

      <div className="experts-page__block">
        <h3>Формат ответа</h3>
        <ol>
          {expert.output.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ol>
      </div>

      <p className="experts-page__constraint">
        <strong>Тип мышления:</strong> {expert.constraint}
      </p>
    </article>
  )
}

export default function ModelsPage() {
  useEffect(() => {
    const prev = document.title
    document.title = TITLE
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <main className="experts-page">
      <SiteHeader />

      <Reveal>
        <section className="experts-page__hero">
          <p className="experts-page__eyebrow">Multi-Agent Review Pipeline</p>
          <h1>Модели</h1>
          <p>
            В этом чате у каждой модели есть четкая специализация. Ниже показано, кто что
            проверяет и как формируется финальный вердикт.
          </p>
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__grid" aria-label="Карточки экспертов">
          {EXPERTS.map((expert) => (
            <ExpertCard key={expert.name} expert={expert} />
          ))}
        </section>
      </Reveal>

      <Reveal>
        <section className="experts-page__system" aria-label="Judge и Router">
          <article className="experts-page__panel">
            <header className="experts-page__panel-head">
              <h2>Judge / Arbiter</h2>
              <code title={ARBITER.id}>{prettyModelList(ARBITER.id)}</code>
            </header>
            <p>
              <strong>Роль:</strong> {ARBITER.role}
            </p>
            <p className="experts-page__arbiter-lead">{ARBITER.purpose}</p>
            <div className="experts-page__arbiter-grid">
              {ARBITER.workflow.map((section) => (
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
              <code title={ROUTER.model}>{prettyModelName(ROUTER.model)}</code>
            </header>
            <p>
              <strong>Роль:</strong> {ROUTER.role}
            </p>
            <p className="experts-page__router-lead">{ROUTER.mission}</p>
            <div className="experts-page__router-grid">
              {ROUTER.rules.map((rule) => (
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
