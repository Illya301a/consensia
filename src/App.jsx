import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import TermsOfServicePage from './pages/TermsOfServicePage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import DevelopersPage from './pages/DevelopersPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ModelsPage from './pages/ModelsPage.jsx'

const AppPage = lazy(() => import('./pages/AppPage.jsx'))
export default function App() {
  return (
    <Routes>
      <Route path="/" index element={<HomePage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/faq" element={<FaqPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/models" element={<ModelsPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/developers" element={<DevelopersPage />} />
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
