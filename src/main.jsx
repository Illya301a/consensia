import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import { AuthProvider } from './services/AuthContext.jsx'
import { ThemeProvider } from './services/ThemeContext.jsx'
import i18n from './i18n/index.js'
import './styles/theme-tokens.scss'
import './styles/page-aurora.scss'
import './styles/page-mesh-bg.scss'
import './styles/glass-card.scss'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <BrowserRouter>
          <AuthProvider>
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </I18nextProvider>
  </StrictMode>,
)
