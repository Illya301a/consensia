import { apiFetch } from './http.js'

export async function fetchCurrentUser() {
  const r = await apiFetch('/users/me')
  if (r.status === 401) return { ok: false, status: 401 }
  if (!r.ok) return { ok: false, status: r.status }
  const users = await r.json()
  return { ok: true, users }
}
