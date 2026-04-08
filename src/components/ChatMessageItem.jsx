import { memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function shouldFold(text, threshold = 420) {
  if (!text) return false
  return String(text).length > threshold
}

function Fold({ title, defaultOpen, children, closedTitle, openTitle }) {
  const hasStatefulTitle = Boolean(closedTitle || openTitle)
  return (
    <details className="chat-msg__fold" open={defaultOpen}>
      <summary className="chat-msg__fold-summary">
        {hasStatefulTitle ? (
          <>
            <span className="chat-msg__fold-when-closed">{closedTitle || title}</span>
            <span className="chat-msg__fold-when-open">{openTitle || title}</span>
          </>
        ) : (
          title
        )}
      </summary>
      <div className="chat-msg__fold-body">{children}</div>
    </details>
  )
}

function Markdown({ children }) {
  let text = children == null ? '' : String(children)
  // If backend double-escaped newlines, make Markdown readable.
  if (text.includes('\\n') && !text.includes('\n')) {
    text = text.replaceAll('\\n', '\n')
  }
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        p({ children: pChildren }) {
          return <div className="md-p">{pChildren}</div>
        },
        h1({ children: hChildren }) {
          return <div className="md-h md-h1">{hChildren}</div>
        },
        h2({ children: hChildren }) {
          return <div className="md-h md-h2">{hChildren}</div>
        },
        h3({ children: hChildren }) {
          return <div className="md-h md-h3">{hChildren}</div>
        },
        h4({ children: hChildren }) {
          return <div className="md-h md-h4">{hChildren}</div>
        },
        ul({ children: listChildren }) {
          return <div className="md-list md-ul">{listChildren}</div>
        },
        ol({ children: listChildren }) {
          return <div className="md-list md-ol">{listChildren}</div>
        },
        li({ children: liChildren }) {
          return <div className="md-li">{liChildren}</div>
        },
        blockquote({ children: bqChildren }) {
          return <div className="md-quote">{bqChildren}</div>
        },
        img({ src, alt }) {
          const href = src ? String(src) : ''
          if (!href) return null
          const label = alt ? String(alt) : 'image'
          // Avoid broken inline images rendering as plain "image.png" text.
          return (
            <a className="md-img" href={href} target="_blank" rel="noreferrer">
              {label}
            </a>
          )
        },
        code({ inline, className, children: codeChildren, ...props }) {
          const match = /language-(\w+)/.exec(className || '')
          const lang = match?.[1]
          const code = String(codeChildren ?? '').replace(/\n$/, '')
          if (inline) {
            return (
              <code className={className} {...props}>
                {code}
              </code>
            )
          }
          return (
            <SyntaxHighlighter
              language={lang || 'text'}
              style={oneLight}
              showLineNumbers={false}
              wrapLongLines
              PreTag="div"
              customStyle={{
                background: 'rgba(255, 255, 255, 0.92)',
                border: '1px solid rgba(244, 114, 182, 0.22)',
                borderRadius: '10px',
                fontSize: '0.78rem',
                marginTop: '0.5rem',
                overflowX: 'hidden',
              }}
            >
              {code}
            </SyntaxHighlighter>
          )
        },
      }}
    >
      {text}
    </ReactMarkdown>
  )
}

function extractFencedCode(value) {
  const raw = value == null ? '' : String(value)
  const m = raw.match(/```(\w+)?\s*([\s\S]*?)\s*```/m)
  if (!m) return { lang: null, code: raw }
  const lang = m[1] ? String(m[1]).toLowerCase() : null
  return { lang, code: m[2] ?? '' }
}

function CodeBlock({ value, defaultLanguage = 'text' }) {
  const { lang, code } = extractFencedCode(value)
  return (
    <SyntaxHighlighter
      language={lang || defaultLanguage}
      style={oneLight}
      showLineNumbers={false}
      wrapLongLines
      PreTag="div"
      customStyle={{
        background: 'rgba(255, 255, 255, 0.92)',
        border: '1px solid rgba(244, 114, 182, 0.22)',
        borderRadius: '10px',
        fontSize: '0.78rem',
        marginTop: '0.5rem',
        overflowX: 'hidden',
      }}
    >
      {String(code ?? '')}
    </SyntaxHighlighter>
  )
}

function n(value) {
  const x = Number(value)
  return Number.isFinite(x) ? x : 0
}

function totalTokensFromUsage(usage) {
  const u = usage || {}
  const directTotal = u.total ?? u.total_tokens ?? u.tokens ?? u.totalTokens
  if (directTotal != null) return n(directTotal)
  return (
    n(u.prompt) +
    n(u.prompt_tokens) +
    n(u.completion) +
    n(u.completion_tokens) +
    n(u.cached) +
    n(u.cached_tokens) +
    n(u.input_tokens) +
    n(u.output_tokens) +
    n(u.cached_input_tokens)
  )
}

function creditsFromTokens(tokens) {
  return Math.floor(n(tokens) / 1000)
}

export const ChatMessageItem = memo(function ChatMessageItem({ msg }) {
  switch (msg.kind) {
    case 'system':
      return null
    case 'user':
      return (
        <div className="chat-msg chat-msg--user">
          <div className="chat-msg__md">
            <Markdown>{msg.text}</Markdown>
          </div>
        </div>
      )
    case 'task': {
      const context = msg.context || ''
      const code = msg.code || ''
      return (
        <div className="chat-msg chat-msg--user chat-msg--task">
          <div className="chat-msg__md">
            {context ? (
              <div className="chat-msg__task-context">
                <Markdown>{context}</Markdown>
              </div>
            ) : null}
            {code ? (
              <Fold title="Код (свернуть/развернуть)" defaultOpen={false}>
                <Markdown>{`\`\`\`\n${code}\n\`\`\``}</Markdown>
              </Fold>
            ) : null}
          </div>
        </div>
      )
    }
    case 'agent': {
      const c = msg.content || {}
      const agentName = String(msg.agent || 'Agent')
      const isJudge = /judge|arbiter|суд/i.test(agentName)
      const issues = Array.isArray(c.issues_found) ? c.issues_found : []
      const thoughtsFold = shouldFold(c.thoughts, 280)
      const summaryFold = shouldFold(c.summary, 320)
      const hasMain =
        Boolean(c.thoughts) || Boolean(c.summary) || (issues && issues.length > 0)
      const body = (
        <>
          {c.thoughts ? (
            <div className="chat-msg__thoughts chat-msg__md">
              {thoughtsFold ? (
                <Fold title="Thoughts" defaultOpen={false}>
                  <Markdown>{c.thoughts}</Markdown>
                </Fold>
              ) : (
                <Markdown>{c.thoughts}</Markdown>
              )}
            </div>
          ) : null}
          {c.summary ? (
            <div className="chat-msg__summary chat-msg__md">
              {summaryFold ? (
                <Fold title="Summary" defaultOpen={false}>
                  <Markdown>{c.summary}</Markdown>
                </Fold>
              ) : (
                <Markdown>{c.summary}</Markdown>
              )}
            </div>
          ) : null}
          {issues.length > 0 ? (
            <ul className="chat-msg__issues">
              {issues.map((issue, i) => (
                <li key={i}>
                  <span className={`chat-msg__badge chat-msg__badge--${issue.type || 'note'}`}>
                    {issue.type || 'issue'}
                  </span>
                  {issue.description ? (
                    <div className="chat-msg__md">
                      {shouldFold(issue.description) ? (
                        <Fold title="Описание" defaultOpen={false}>
                          <Markdown>{issue.description}</Markdown>
                        </Fold>
                      ) : (
                        <Markdown>{issue.description}</Markdown>
                      )}
                    </div>
                  ) : null}
                  {issue.snippet ? (
                    <Fold title="Snippet" defaultOpen={!shouldFold(issue.snippet, 240)}>
                      <SyntaxHighlighter
                        language="javascript"
                        style={oneLight}
                        showLineNumbers={false}
                        wrapLongLines
                        PreTag="div"
                        customStyle={{
                          background: 'rgba(255, 255, 255, 0.92)',
                          border: '1px solid rgba(244, 114, 182, 0.22)',
                          borderRadius: '10px',
                          fontSize: '0.78rem',
                          marginTop: '0.5rem',
                          overflowX: 'hidden',
                        }}
                      >
                        {String(issue.snippet)}
                      </SyntaxHighlighter>
                    </Fold>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
          {!hasMain && c.raw ? (
            <div className="chat-msg__md">
              <Fold title="Raw" defaultOpen={false}>
                <Markdown>{c.raw}</Markdown>
              </Fold>
            </div>
          ) : null}
        </>
      )
      return (
        <div className="chat-msg chat-msg--agent">
          <div className="chat-msg__agent-head">
            <span className="chat-msg__avatar" aria-hidden="true">
              {String(agentName || 'A').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong className="chat-msg__agent-name">{agentName}</strong>
              <span className="chat-msg__round">Round {msg.round}</span>
            </div>
          </div>
          {isJudge ? body : <Fold title="Показать ответ" defaultOpen={false}>{body}</Fold>}
        </div>
      )
    }
    case 'final': {
      const c = msg.content || {}
      const fixes = Array.isArray(c.critical_fixes) ? c.critical_fixes : []
      const improvements = Array.isArray(c.improvements) ? c.improvements : []
      const diff = c.unified_diff ?? c.diff ?? ''
      const finalCode = c.final_code ?? ''
      const hasFinalCode = String(finalCode).trim().length > 0
      const summary = c.summary ?? ''
      const hasMain =
        fixes.length > 0 || improvements.length > 0 || Boolean(diff) || hasFinalCode || Boolean(summary)
      const verdictBody = (
        <>
          {summary ? (
            <div className="chat-msg__summary chat-msg__md">
              <Markdown>{summary}</Markdown>
            </div>
          ) : null}
          {fixes.length > 0 ? (
            <div className="chat-msg__list-block">
              <h4>Critical fixes</h4>
              <ul>
                {fixes.map((x, i) => (
                  <li key={i}>
                    <div className="chat-msg__md">
                      <Markdown>{typeof x === 'string' ? x : JSON.stringify(x)}</Markdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
          {improvements.length > 0 ? (
            <div className="chat-msg__list-block">
              <h4>Improvements</h4>
              <ul>
                {improvements.map((x, i) => (
                  <li key={i}>
                    <div className="chat-msg__md">
                      <Markdown>{typeof x === 'string' ? x : JSON.stringify(x)}</Markdown>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </>
      )
      return (
        <div className={`chat-msg chat-msg--final${hasFinalCode ? '' : ' chat-msg--final-compact'}`}>
          {hasFinalCode ? (
            <>
              <h3 className="chat-msg__final-title">Final verdict</h3>
              <Fold title="Показать/скрыть" closedTitle="Показать" openTitle="Скрыть" defaultOpen>
                {verdictBody}
              </Fold>
            </>
          ) : (
            verdictBody
          )}
          {hasFinalCode ? (
            <div className="chat-msg__list-block">
              <h3 className="chat-msg__final-title">Final code</h3>
              <Fold title="Показать/скрыть" closedTitle="Показать" openTitle="Скрыть" defaultOpen>
                <div className="chat-msg__code">
                  <CodeBlock value={finalCode} defaultLanguage="python" />
                </div>
              </Fold>
            </div>
          ) : null}
          {diff ? (
            <div className="chat-msg__list-block">
              <h4>Diff</h4>
              <Fold title="Показать diff" defaultOpen={false}>
                <pre className="chat-msg__diff">{String(diff)}</pre>
              </Fold>
            </div>
          ) : null}
          {!hasMain && c.raw ? (
            <div className="chat-msg__md">
              <Fold title="Raw" defaultOpen={false}>
                <Markdown>{c.raw}</Markdown>
              </Fold>
            </div>
          ) : null}
        </div>
      )
    }
    case 'chat': {
      const role = String(msg.role || 'judge')
      return (
        <div className={`chat-msg chat-msg--chat chat-msg--chat-${role.toLowerCase()}`}>
          <div className="chat-msg__md">
            {shouldFold(msg.text, 900) ? (
              <Fold title="Показать сообщение" defaultOpen={true}>
                <Markdown>{msg.text}</Markdown>
              </Fold>
            ) : (
              <Markdown>{msg.text}</Markdown>
            )}
          </div>
        </div>
      )
    }
    case 'usage': {
      const totalTokens = totalTokensFromUsage(msg.usage)
      const spentCredits = creditsFromTokens(totalTokens)
      return (
        <div className="chat-msg chat-msg--usage">
          <div className="chat-msg__md">Кредитов потрачено: {spentCredits}</div>
        </div>
      )
    }
    case 'usage_group': {
      const events = Array.isArray(msg.events) ? msg.events : []
      const totalTokens = events.reduce((sum, e) => sum + totalTokensFromUsage(e?.usage), 0)
      const spentCredits = creditsFromTokens(totalTokens)
      return (
        <div className="chat-msg chat-msg--usage">
          <div className="chat-msg__md">Кредитов потрачено: {spentCredits}</div>
        </div>
      )
    }
    case 'stream':
      return (
        <div className="chat-msg chat-msg--stream">
          <div className="chat-msg__md">
            <Markdown>{msg.text}</Markdown>
          </div>
        </div>
      )
    case 'error':
      return (
        <div className="chat-msg chat-msg--error" role="alert">
          <div className="chat-msg__md">
            <Markdown>{msg.text}</Markdown>
          </div>
        </div>
      )
    default:
      return null
  }
})
