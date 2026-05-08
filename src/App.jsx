import { lazy, Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation } from 'react-router-dom'
import HomePage from './pages/HomePage.jsx'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage.jsx'
import TermsOfServicePage from './pages/TermsOfServicePage.jsx'
import AuthCallbackPage from './pages/AuthCallbackPage.jsx'
import DevelopersPage from './pages/DevelopersPage.jsx'
import FaqPage from './pages/FaqPage.jsx'
import AboutPage from './pages/AboutPage.jsx'
import ModelsPage from './pages/ModelsPage.jsx'
import CliGuidePage from './pages/GithubActionsPage.jsx'
import PaymentSuccessPage from './pages/PaymentSuccessPage.jsx'
import PaymentCancelPage from './pages/PaymentCancelPage.jsx'
import AiPage from './pages/AiAgentPage.jsx'

const AppPage = lazy(() => import('./pages/AppPage.jsx'))

function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [pathname])

  return null
}

function AppRoutes() {
  const { t } = useTranslation()
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" index element={<HomePage />} />
        <Route path="/terms" element={<TermsOfServicePage />} />
        <Route path="/privacy" element={<PrivacyPolicyPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/models" element={<ModelsPage />} />
        <Route path="/github-actions" element={<CliGuidePage />} />
        <Route path="/ai-agent" element={<AiPage />} />
        <Route path="/success" element={<PaymentSuccessPage />} />
        <Route path="/cancel" element={<PaymentCancelPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />
        <Route path="/developers" element={<DevelopersPage />} />
        <Route
          path="/app"
          element={
            <Suspense fallback={<div className="app-suspense-fallback">{t('common.loading')}</div>}>
              <AppPage />
            </Suspense>
          }
        />
      </Routes>
    </>
  )
}

export default function App() {
  return <AppRoutes />
}
