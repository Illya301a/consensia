export function getUserLabel(user) {
  if (!user || typeof user !== 'object') return ''
  return user.email || user.name || user.full_name || user.display_name || user.given_name || ''
}

export function getCredits(user) {
  if (!user || typeof user !== 'object') return null
  const candidates = [user.credits, user.credit_balance, user.balance, user.remaining_credits]
  for (const v of candidates) {
    if (typeof v === 'number' && Number.isFinite(v)) return v
    if (typeof v === 'string' && v.trim() && Number.isFinite(Number(v))) return Number(v)
  }
  return null
}
