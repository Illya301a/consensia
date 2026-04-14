# Consensia Frontend

Consensia is a multi-model AI workspace where several AI agents discuss a task and produce one aligned final response.  
This repository contains the web client (marketing site + authenticated app workspace), built with React and Vite.

## Features

- Multi-agent chat flow with orchestrated responses
- Multiple usage scenarios (`QUICK`, `CODE_REVIEW`, `CODE_WRITER`, `LEGAL`, `INVESTOR`, `SCIENCE`)
- Session history and follow-up conversation support
- Google login and user profile/credit flows
- Stripe payment success/cancel pages
- GitHub Actions integration page and setup guide
- Internationalization with English, Ukrainian, and Russian locales

## Tech Stack

- React 19
- Vite 8
- React Router
- i18next + react-i18next
- Three.js + React Three Fiber + Drei
- SCSS (Sass)
- ESLint

## Configuration

- API base URL is provided via `VITE_API_BASE_URL`.
- Orchestrator WebSocket URL is provided via `VITE_ORCHESTRATOR_WS_URL`.
- Environment examples are documented in `.env.example`.

## Project Structure

```text
src/
  components/   reusable UI components and chat rendering blocks
  pages/        route-level pages
  services/     API, auth, session, and WebSocket integration logic
  i18n/         i18n config and locale JSON files (en, ua, ru)
  photos/       static images used by pages/components
public/         static public assets
.github/
  workflows/    CI workflows (including AI review integration)
```

## Main Routes

- `/` - Home page
- `/app` - Main application workspace
- `/about`, `/models`, `/developers`, `/faq` - marketing/info pages
- `/terms`, `/privacy` - legal pages
- `/github-actions` - GitHub Actions integration guide
- `/auth/callback` - OAuth callback handler
- `/success`, `/cancel` - payment flow pages

## Authentication and API

- Auth is managed via React Context (`AuthProvider`) with token persistence in `localStorage`.
- HTTP client attaches bearer token and supports token refresh flow.
- Real-time session orchestration is handled via WebSocket.

## Localization

- i18n is initialized in `src/i18n/index.js`.
- Supported languages: `en`, `ua`, `ru`.
- Language is detected via local storage/browser settings and synced to the document `lang` attribute.

## CI / GitHub Actions

The repository includes an AI review workflow in `.github/workflows/ai-review.yml` that runs on pushes and expects `CONSENSIA_API_KEY` in GitHub secrets.

## License

No license file is currently included in this repository. Add a `LICENSE` file if you want to define distribution terms.
