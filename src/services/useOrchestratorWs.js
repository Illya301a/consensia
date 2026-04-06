import { useCallback, useRef, useState } from 'react'

// WebSocket оркестратора: первое сообщение после open — JSON { token, session_id, mode, code, context, rounds }
// Входящие сообщения — JSON с полем type (session_id, system, agent_report, input_required, final_verdict, chunk, error)
const WS_URL =
  import.meta.env.VITE_ORCHESTRATOR_WS_URL ??
  'wss://consensia-api.faby.world/ws/orchestrator'

function uid() {
  return crypto.randomUUID()
}

function parseMaybeJson(value) {
  if (value == null) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    try {
      return JSON.parse(value)
    } catch {
      return { raw: value }
    }
  }
  return value
}

export function useOrchestratorWs({ onSessionId } = {}) {
  const wsRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [messages, setMessages] = useState([])
  const [inputLocked, setInputLocked] = useState(true)
  const [currentRound, setCurrentRound] = useState(0)
  const [sessionId, setSessionId] = useState(null)
  const [lastError, setLastError] = useState(null)

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }
    setStatus('closed')
    setMessages([])
    setSessionId(null)
    setInputLocked(true)
    setCurrentRound(0)
  }, [])

  const append = useCallback((entry) => {
    setMessages((prev) => [...prev, { id: uid(), ...entry }])
  }, [])

  const handleIncoming = useCallback(
    (raw) => {
      let data
      try {
        data = JSON.parse(raw)
      } catch {
        append({ kind: 'error', text: 'Invalid JSON from server' })
        return
      }

      if (data.session_id && !data.type) {
        setSessionId(data.session_id)
        onSessionId?.(data.session_id)
        return
      }

      const type = data.type

      switch (type) {
        case 'session_id': {
          const sid = data.session_id ?? data.sessionId
          if (sid) {
            setSessionId(sid)
            onSessionId?.(sid)
          }
          break
        }
        case 'system': {
          const text = data.msg ?? data.message ?? data.text ?? ''
          append({ kind: 'system', text })
          break
        }
        case 'agent_report': {
          const content = parseMaybeJson(data.content)
          const round = data.round ?? 0
          setCurrentRound(round)
          append({
            kind: 'agent',
            agent: data.agent ?? 'Agent',
            round,
            content,
          })
          break
        }
        case 'input_required': {
          setInputLocked(false)
          append({ kind: 'system', text: 'Waiting for your reply…' })
          break
        }
        case 'final_verdict': {
          const content = parseMaybeJson(data.content) ?? {}
          append({ kind: 'final', content })
          break
        }
        case 'chunk': {
          const piece =
            data.chunk ?? data.content ?? data.msg ?? data.text ?? data.delta ?? ''
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last?.kind === 'stream') {
              return [
                ...prev.slice(0, -1),
                { ...last, text: (last.text ?? '') + piece },
              ]
            }
            return [...prev, { id: uid(), kind: 'stream', text: piece }]
          })
          break
        }
        case 'error': {
          const errText =
            data.msg ?? data.message ?? data.error ?? JSON.stringify(data)
          setLastError(errText)
          append({ kind: 'error', text: errText })
          break
        }
        default: {
          if (data.error || data.err) {
            const errText = String(data.error ?? data.err)
            setLastError(errText)
            append({ kind: 'error', text: errText })
            break
          }
          append({ kind: 'system', text: `[${type ?? 'event'}] ${JSON.stringify(data)}` })
        }
      }
    },
    [append, onSessionId]
  )

  const connect = useCallback(
    ({ token, sessionId: sidIn, mode, code, context, rounds }) => {
      setLastError(null)
      setMessages([])
      setInputLocked(true)
      setCurrentRound(0)
      disconnect()

      setStatus('connecting')
      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onopen = () => {
        setStatus('open')
        // init-сообщение (браузер не шлёт заголовки Authorization)
        const payload = {
          token: token || '',
          session_id: sidIn || null,
          mode: mode || 'BALANCED',
          code: code || '',
          context: context || '',
          rounds: Number(rounds) || 3,
        }
        ws.send(JSON.stringify(payload))
      }

      ws.onmessage = (ev) => handleIncoming(ev.data)

      ws.onerror = () => {
        setLastError('WebSocket error')
        append({ kind: 'error', text: 'WebSocket connection error' })
      }

      ws.onclose = () => {
        setStatus('closed')
        wsRef.current = null
      }
    },
    [append, disconnect, handleIncoming]
  )

  const sendFollowUp = useCallback((message) => {
    const ws = wsRef.current
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      setLastError('Not connected')
      return
    }
    setInputLocked(true)
    append({ kind: 'user', text: message })
    // После input_required от оркестратора
    ws.send(JSON.stringify({ message }))
  }, [append])

  return {
    status,
    messages,
    inputLocked,
    currentRound,
    sessionId,
    setSessionId,
    lastError,
    connect,
    disconnect,
    sendFollowUp,
    clearMessages: () => setMessages([]),
  }
}
