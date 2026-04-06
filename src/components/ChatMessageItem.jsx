import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism'

export function ChatMessageItem({ msg }) {
  switch (msg.kind) {
    case 'system':
      return (
        <div className="chat-msg chat-msg--system">
          <p>{msg.text}</p>
        </div>
      )
    case 'user':
      return (
        <div className="chat-msg chat-msg--user">
          <p>{msg.text}</p>
        </div>
      )
    case 'agent': {
      const c = msg.content || {}
      const issues = Array.isArray(c.issues_found) ? c.issues_found : []
      return (
        <div className="chat-msg chat-msg--agent">
          <div className="chat-msg__agent-head">
            <span className="chat-msg__avatar" aria-hidden="true">
              {String(msg.agent || 'A').slice(0, 1).toUpperCase()}
            </span>
            <div>
              <strong className="chat-msg__agent-name">{msg.agent}</strong>
              <span className="chat-msg__round">Round {msg.round}</span>
            </div>
          </div>
          {c.thoughts ? (
            <p className="chat-msg__thoughts">{c.thoughts}</p>
          ) : null}
          {c.summary ? <p className="chat-msg__summary">{c.summary}</p> : null}
          {issues.length > 0 ? (
            <ul className="chat-msg__issues">
              {issues.map((issue, i) => (
                <li key={i}>
                  <span className={`chat-msg__badge chat-msg__badge--${issue.type || 'note'}`}>
                    {issue.type || 'issue'}
                  </span>
                  {issue.description ? <p>{issue.description}</p> : null}
                  {issue.snippet ? (
                    <SyntaxHighlighter
                      language="javascript"
                      style={oneLight}
                      showLineNumbers={false}
                      PreTag="div"
                      customStyle={{
                        background: 'rgba(255, 255, 255, 0.92)',
                        border: '1px solid rgba(244, 114, 182, 0.22)',
                        borderRadius: '10px',
                        fontSize: '0.78rem',
                        marginTop: '0.5rem',
                      }}
                    >
                      {String(issue.snippet)}
                    </SyntaxHighlighter>
                  ) : null}
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      )
    }
    case 'final': {
      const c = msg.content || {}
      const fixes = Array.isArray(c.critical_fixes) ? c.critical_fixes : []
      const improvements = Array.isArray(c.improvements) ? c.improvements : []
      const diff = c.unified_diff ?? c.diff ?? ''
      return (
        <div className="chat-msg chat-msg--final">
          <h3 className="chat-msg__final-title">Final verdict</h3>
          {fixes.length > 0 ? (
            <div className="chat-msg__list-block">
              <h4>Critical fixes</h4>
              <ul>
                {fixes.map((x, i) => (
                  <li key={i}>{typeof x === 'string' ? x : JSON.stringify(x)}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {improvements.length > 0 ? (
            <div className="chat-msg__list-block">
              <h4>Improvements</h4>
              <ul>
                {improvements.map((x, i) => (
                  <li key={i}>{typeof x === 'string' ? x : JSON.stringify(x)}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {diff ? (
            <pre className="chat-msg__diff">{String(diff)}</pre>
          ) : null}
        </div>
      )
    }
    case 'stream':
      return (
        <div className="chat-msg chat-msg--stream">
          <p>{msg.text}</p>
        </div>
      )
    case 'error':
      return (
        <div className="chat-msg chat-msg--error" role="alert">
          <p>{msg.text}</p>
        </div>
      )
    default:
      return null
  }
}
