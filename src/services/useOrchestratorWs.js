import { useCallback, useRef, useState } from 'react'
import { mapSessionHistoryToMessages } from './sessionsApi.js'

// WebSocket оркестратора: первое сообщение после open — JSON { token, session_id, mode, code, context, rounds }
// Входящие сообщения — JSON с полем type (session_id, system, agent_report, input_required, final_verdict, chunk, error)
const WS_URL =
  import.meta.env.VITE_ORCHESTRATOR_WS_URL ??
  'wss://api.consensia.world/ws/orchestrator'

function uid() {
    // Перевіряємо, чи доступний randomUUID (працює на localhost або HTTPS)
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    
    // Запасний варіант (Fallback) для роботи через локальний IP (HTTP)
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }

function parseMaybeJson(value) {
  if (value == null) return null
  if (typeof value === 'object') return value
  if (typeof value === 'string') {
    const raw = value
    // Common pattern from LLMs / backend: a JSON block wrapped in ```json ... ```
    const fenced = raw.match(/```json\\s*([\\s\\S]*?)\\s*```/i)
    const candidates = []
    if (fenced?.[1]) candidates.push(fenced[1])
    candidates.push(raw)

    for (const c of candidates) {
      const trimmed = String(c).trim()
      // 1) Try direct JSON
      try {
        return JSON.parse(trimmed)
      } catch {
        /* try next */
      }
      // 2) Try extracting the first {...} region
      const first = trimmed.indexOf('{')
      const last = trimmed.lastIndexOf('}')
      if (first !== -1 && last !== -1 && last > first) {
        const slice = trimmed.slice(first, last + 1)
        try {
          return JSON.parse(slice)
        } catch {
          /* try next */
        }
      }
    }

    return { raw }
  }
  return value
}

export function useOrchestratorWs({ onSessionId } = {}) {
  const wsRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [messages, setMessages] = useState([])
  const [usageEvents, setUsageEvents] = useState([])
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
    setUsageEvents([])
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
        case 'state_update': {
          const snapshot =
            (data?.data && typeof data.data === 'object' ? data.data : null) ||
            (data?.state && typeof data.state === 'object' ? data.state : null) ||
            (data?.session_data && typeof data.session_data === 'object' ? data.session_data : null)
          if (!snapshot) break

          const sid = snapshot.session_id ?? snapshot.sessionId
          if (sid) {
            setSessionId(sid)
            onSessionId?.(sid)
          }

          const round = Number(snapshot.current_round ?? 0) || 0
          if (round) setCurrentRound(round)

          const statusRaw = String(snapshot.session_status ?? snapshot.status ?? '').toLowerCase()
          if (statusRaw === 'waiting_for_user' || statusRaw === 'post_analysis_chat') {
            setInputLocked(false)
          } else if (statusRaw) {
            setInputLocked(true)
          }

          const historyMessages = mapSessionHistoryToMessages(snapshot.history)
          if (historyMessages.length > 0) {
            // Backend snapshots can be partial (e.g. only final verdict after completion).
            // Preserve already rendered agent/user/task messages when snapshot is reduced.
            setMessages((prev) => {
              const prevStable = Array.isArray(prev)
                ? prev.filter((m) => m?.kind !== 'stream')
                : []
              const prevHasAgents = prevStable.some((m) => m?.kind === 'agent')
              const nextHasAgents = historyMessages.some((m) => m?.kind === 'agent')

              // Critical rule: never drop already visible agents on reduced snapshots.
              if (prevHasAgents && !nextHasAgents) {
                const preserved = prevStable.filter((m) => m?.kind !== 'final')
                const finalsFromHistory = historyMessages.filter((m) => m?.kind === 'final')
                const finals = finalsFromHistory.length
                  ? finalsFromHistory
                  : prevStable.filter((m) => m?.kind === 'final')
                return [...preserved, ...finals]
              }

              const historyHasContext = historyMessages.some((m) =>
                ['agent', 'task', 'user', 'chat'].includes(m?.kind)
              )
              if (historyHasContext) return historyMessages

              const prevHasContext = prevStable.some((m) =>
                ['agent', 'task', 'user', 'chat'].includes(m?.kind)
              )
              if (!prevHasContext) return historyMessages

              const preserved = prevStable.filter((m) => m?.kind !== 'final')
              const finalsFromHistory = historyMessages.filter((m) => m?.kind === 'final')
              return [...preserved, ...finalsFromHistory]
            })
          }
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
        case 'chat_message': {
          const text = data.content ?? data.msg ?? data.message ?? data.text ?? ''
          const role = data.role ?? data.agent ?? 'judge'
          // Не дублировать: сервер шлёт chunk (stream), затем итоговый chat_message с тем же текстом
          setMessages((prev) => {
            const last = prev[prev.length - 1]
            if (last?.kind === 'stream') {
              return [
                ...prev.slice(0, -1),
                { ...last, kind: 'chat', role, text },
              ]
            }
            return [...prev, { id: uid(), kind: 'chat', role, text }]
          })
          break
        }
        case 'agent_usage': {
          // optional telemetry; keep it quiet but visible if needed
          const agent = data.agent ?? 'Agent'
          const usage = data.usage ?? {}
          setUsageEvents((prev) => [...prev, { id: uid(), kind: 'usage', agent, usage }])
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
    ({
      token,
      sessionId: sidIn,
      mode,
      code,
      context,
      rounds,
      ui,
      resumeMessages,
      resumeUsageEvents,
    }) => {
      setLastError(null)
      setInputLocked(true)
      setCurrentRound(0)
      disconnect()

      if (Array.isArray(resumeMessages) && resumeMessages.length > 0) {
        setMessages(resumeMessages)
      } else if (ui && (ui.context || ui.code || ui.mode || ui.rounds)) {
        append({
          kind: 'task',
          context: ui.context || '',
          code: ui.code || '',
          mode: ui.mode || '',
          rounds: ui.rounds ?? null,
        })
      }
      if (Array.isArray(resumeUsageEvents) && resumeUsageEvents.length > 0) {
        setUsageEvents(resumeUsageEvents)
      } else {
        setUsageEvents([])
      }

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

  const sendFollowUp = useCallback(
    (message) => {
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        setLastError('Not connected')
        return
      }
      const text = typeof message === 'string' ? message : String(message ?? '')
      setInputLocked(true)
      append({ kind: 'user', text })
      ws.send(JSON.stringify({ message: text }))
    },
    [append]
  )

  return {
    status,
    messages,
    usageEvents,
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
