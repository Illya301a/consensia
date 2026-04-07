import { apiFetch } from './http.js'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

/**
 * Maps REST `session_data.history` entries to orchestrator UI message shape.
 * Expected items: { role: string, content: string | object }
 */
function pickHistoryText(item) {
  const raw =
    item?.content ??
    item?.message ??
    item?.msg ??
    item?.text ??
    item?.prompt ??
    item?.query ??
    item?.request ??
    item?.user_message ??
    item?.body ??
    item?.value ??
    ''
  if (typeof raw === 'string') return raw
  if (raw == null) return ''
  if (typeof raw === 'object') {
    const nested =
      raw.content ?? raw.message ?? raw.msg ?? raw.text ?? raw.body ?? raw.value ?? raw.raw
    if (typeof nested === 'string') return nested
  }
  try {
    return JSON.stringify(raw)
  } catch {
    return String(raw)
  }
}

function parseHistoryPayload(item) {
  const raw =
    item?.verdict_data ??
    item?.content ??
    item?.message ??
    item?.msg ??
    item?.text ??
    item?.body ??
    item?.value
  if (raw && typeof raw === 'object') return raw
  const text = pickHistoryText(item).trim()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    /* try relaxed parser below */
  }
  // Some backends persist Python-like dict strings with single quotes.
  const relaxed = text
    .replace(/([{,]\s*)'([^']+?)'\s*:/g, '$1"$2":')
    .replace(/:\s*'([^']*)'/g, (_m, v) => `: ${JSON.stringify(v)}`)
    .replace(/\bNone\b/g, 'null')
    .replace(/\bTrue\b/g, 'true')
    .replace(/\bFalse\b/g, 'false')
  try {
    return JSON.parse(relaxed)
  } catch {
    return null
  }
}

function isFinalPayload(payload) {
  if (!payload || typeof payload !== 'object') return false
  return (
    'critical_fixes' in payload ||
    'improvements' in payload ||
    'final_code' in payload ||
    'unified_diff' in payload ||
    'diff' in payload
  )
}

function isAgentPayload(payload) {
  if (!payload || typeof payload !== 'object') return false
  return 'thoughts' in payload || 'issues_found' in payload || 'snippet' in payload
}

export function mapSessionHistoryToMessages(history) {
  if (!Array.isArray(history)) return []
  return history.map((h, i) => {
    const id = `hist-${i}-${uid()}`
    const roleRaw = String(h?.role ?? '').toLowerCase()
    const typeRaw = String(h?.type ?? '').toLowerCase()
    const text = pickHistoryText(h)
    const payload = parseHistoryPayload(h)
    const round = Number(h?.round ?? h?.current_round ?? 0) || 0

    if (typeRaw === 'initial_request') {
      const reqCode = typeof h?.code === 'string' ? h.code : ''
      const reqText =
        typeof h?.text === 'string'
          ? h.text
          : typeof h?.prompt === 'string'
            ? h.prompt
            : typeof h?.query === 'string'
              ? h.query
              : typeof h?.request === 'string'
                ? h.request
                : typeof h?.user_message === 'string'
                  ? h.user_message
          : typeof h?.content === 'string'
            ? h.content
            : text
      return {
        id,
        kind: 'task',
        context: reqText || '',
        code: reqCode || '',
        mode: h?.mode ?? '',
        rounds: h?.max_rounds ?? h?.rounds ?? null,
      }
    }

    if (typeRaw === 'verdict') {
      return {
        id,
        kind: 'final',
        content:
          payload && typeof payload === 'object'
            ? payload
            : { raw: typeof h?.verdict_data === 'string' ? h.verdict_data : text },
      }
    }

    if (typeRaw === 'chat') {
      if (roleRaw === 'user') return { id, kind: 'user', text }
      return {
        id,
        kind: 'chat',
        role: typeof h?.role === 'string' && h.role.trim() ? h.role : 'judge',
        text,
      }
    }

    if (roleRaw === 'user') {
      return { id, kind: 'user', text }
    }
    if (typeRaw === 'final_verdict' || isFinalPayload(payload)) {
      return {
        id,
        kind: 'final',
        content: payload && typeof payload === 'object' ? payload : { raw: text },
      }
    }
    if (typeRaw === 'agent_report' || isAgentPayload(payload)) {
      return {
        id,
        kind: 'agent',
        agent: String(h?.agent ?? h?.role ?? 'Agent'),
        round,
        content: payload && typeof payload === 'object' ? payload : { raw: text },
      }
    }
    return {
      id,
      kind: 'chat',
      role: typeof h?.role === 'string' && h.role.trim() ? h.role : 'assistant',
      text,
    }
  })
}

function getRoundNumber(key, fallback = 0) {
  const m = String(key ?? '').match(/(\d+)/)
  if (!m) return fallback
  const n = Number(m[1])
  return Number.isFinite(n) ? n : fallback
}

export function mapRoundDataToAgentMessages(roundData) {
  if (!roundData || typeof roundData !== 'object') return []
  const rounds = Object.entries(roundData).sort(
    ([a], [b]) => getRoundNumber(a) - getRoundNumber(b)
  )
  const out = []
  for (const [roundKey, agents] of rounds) {
    if (!agents || typeof agents !== 'object') continue
    const round = getRoundNumber(roundKey, 0)
    for (const [agentName, payload] of Object.entries(agents)) {
      if (!payload || typeof payload !== 'object') continue
      out.push({
        id: `round-${round}-${agentName}-${uid()}`,
        kind: 'agent',
        agent: String(agentName || 'Agent'),
        round,
        content: payload,
      })
    }
  }
  return out
}

export function buildResumeMessagesFromSessionData(sessionData) {
  const sd = sessionData && typeof sessionData === 'object' ? sessionData : {}
  const fromHistory = mapSessionHistoryToMessages(sd.history)
  const hasAgentInHistory = fromHistory.some((m) => m?.kind === 'agent')
  if (hasAgentInHistory) return fromHistory

  const fromRounds = mapRoundDataToAgentMessages(sd.round_data)
  if (!fromRounds.length) return fromHistory

  const finals = fromHistory.filter((m) => m?.kind === 'final')
  const nonFinals = fromHistory.filter((m) => m?.kind !== 'final')
  return [...nonFinals, ...fromRounds, ...finals]
}

export async function fetchSessionsList() {
  const r = await apiFetch('/api/sessions')
  if (r.status === 401) return { ok: false, status: 401, sessions: [] }
  if (!r.ok) {
    const errText = await r.text().catch(() => '')
    return { ok: false, status: r.status, error: errText || r.statusText, sessions: [] }
  }
  const data = await r.json().catch(() => null)
  const sessions = Array.isArray(data) ? data : data?.sessions ?? data?.items ?? []
  return { ok: true, sessions }
}

export async function fetchSessionDetails(sessionId) {
  const r = await apiFetch(`/api/sessions/${encodeURIComponent(sessionId)}`)
  if (r.status === 401) return { ok: false, status: 401, detail: null }
  if (!r.ok) {
    const errText = await r.text().catch(() => '')
    return { ok: false, status: r.status, error: errText || r.statusText, detail: null }
  }
  const detail = await r.json().catch(() => null)
  return { ok: true, detail }
}

export async function deleteSession(sessionId) {
  const r = await apiFetch(`/api/sessions/${encodeURIComponent(sessionId)}`, { method: 'DELETE' })
  if (r.status === 401) return { ok: false, status: 401 }
  if (!r.ok) {
    const errText = await r.text().catch(() => '')
    return { ok: false, status: r.status, error: errText || r.statusText }
  }
  return { ok: true }
}

export function normalizeSessionsFromApi(list) {
  if (!Array.isArray(list)) return []
  const out = []
  const seen = new Set()
  for (const s of list) {
    if (!s || typeof s !== 'object') continue
    const id = s.session_id ?? s.sessionId
    if (!id || seen.has(id)) continue
    seen.add(id)
    const created = s.created_at ? Date.parse(s.created_at) : NaN
    out.push({
      id: String(id),
      session_id: String(id),
      status: s.status,
      mode: s.mode,
      type: s.type,
      createdAt: Number.isFinite(created) ? created : Date.now(),
      tokens_used: s.tokens_used,
      burned_credits: s.burned_credits,
    })
  }
  out.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  return out.slice(0, 80)
}
