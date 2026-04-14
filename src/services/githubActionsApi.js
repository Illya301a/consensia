import { apiFetch } from './http.js'

async function readJsonSafe(response) {
  return await response.json().catch(() => null)
}

function extractErrorMessage(data, fallback) {
  return (
    data?.detail ||
    data?.message ||
    (typeof data === 'string' ? data : '') ||
    fallback
  )
}

export async function generateCliApiKey() {
  const r = await apiFetch('/users/me/cli-key', { method: 'POST' })
  const data = await readJsonSafe(r)
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: extractErrorMessage(data, 'Failed to generate CLI key'),
    }
  }
  return {
    ok: true,
    cliApiKey: data?.cli_api_key || '',
    message: data?.message || 'CLI key generated successfully',
  }
}

export async function saveOpenRouterApiKey(apiKey) {
  const r = await apiFetch('/users/me/openrouter-key', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey }),
  })
  const data = await readJsonSafe(r)
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: extractErrorMessage(data, 'Failed to save OpenRouter key'),
    }
  }
  return {
    ok: true,
    message: data?.message || 'OpenRouter key saved successfully',
  }
}

export async function createCliPassCheckout() {
  const r = await apiFetch('/payments/cli-pass-checkout', { method: 'POST' })
  const data = await readJsonSafe(r)
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: extractErrorMessage(data, 'Failed to create CLI Pass checkout session'),
    }
  }
  return {
    ok: true,
    checkoutUrl: data?.checkout_url || '',
  }
}

export async function deleteMyAccount() {
  const r = await apiFetch('/api/users/me', { method: 'DELETE' })
  const data = await readJsonSafe(r)
  if (!r.ok) {
    return {
      ok: false,
      status: r.status,
      error: extractErrorMessage(data, 'Failed to delete account'),
    }
  }
  return {
    ok: true,
    message: data?.message || 'Account deleted successfully',
  }
}
