// Базовый URL REST API (FastAPI: /auth/google/*, /api/sessions, …)
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? 'https://consensia-api.faby.world'
