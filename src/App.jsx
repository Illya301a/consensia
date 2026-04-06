import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'

const AppPage = lazy(() => import('./pages/AppPage.jsx'))

export default function App() {
  return (
    <Routes>
      <Route path="/" index element={<HomePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route
        path="/app"
        element={
          <Suspense fallback={<div className="app-suspense-fallback">Загрузка…</div>}>
            <AppPage />
          </Suspense>
        }
      />
    </Routes>
  )
}
