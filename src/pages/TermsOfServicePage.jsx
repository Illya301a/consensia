import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'

const TITLE = 'Terms of Service · Consensia'

export default function TermsOfServicePage() {
  useEffect(() => {
    const prev = document.title
    document.title = TITLE
    return () => {
      document.title = prev
    }
  }, [])

  return (
    <div className="app legal-page">
      <a href="#legal-main" className="legal-page__skip">
        Skip to content
      </a>
      <header className="legal-page__header">
        <Link to="/" className="logo legal-page__logo">
          Consensia
        </Link>
        <nav className="legal-page__header-nav" aria-label="Navigation">
          <Link to="/" className="legal-page__back">
            Back to home
          </Link>
        </nav>
      </header>

      <main id="legal-main" className="legal-page__main" tabIndex={-1}>
        <article className="legal-page__article">
          <h1 className="legal-page__title">Terms of Service</h1>
          <p className="legal-page__meta">Last updated: April 5, 2026</p>

          <aside className="legal-page__notice" role="note">
            <strong>Draft / test deployment.</strong> This page is published while the product is
            experimental. Before a public launch, have this text reviewed for your jurisdiction.
            Nothing here is legal advice.
          </aside>

          <p className="legal-page__lead">
            By accessing or using Consensia, you agree to these Terms of Service. If you do not
            agree, please do not use the Service.
          </p>

          <section className="legal-page__section">
            <h2>1. Registration and Account</h2>
            <p>
              <strong>Mandatory Registration:</strong> To use the Service (including the free
              tier), you must create an account.
            </p>
            <p>
              <strong>Authentication:</strong> We use secure third-party authentication (Google
              OAuth). You agree to provide accurate information and are responsible for account
              security.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>2. Pricing, Credits, and Payments</h2>
            <p>
              New users may receive limited complimentary credits. Limits and pricing can change.
            </p>
            <p>
              Credits are consumed based on actual model usage (input/output tokens and complexity).
              You can monitor the balance in your account.
            </p>
            <p>
              Purchased credits are generally non-refundable once partially used, except where
              required by law.
            </p>
            <p>
              Payments are processed by Stripe. We do not store full card details on our servers.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>3. Acceptable Use</h2>
            <p>You agree not to use the Service to:</p>
            <ul>
              <li>Violate laws, copyrights, or licenses.</li>
              <li>Attempt to hack, DDoS, or reverse-engineer platform systems.</li>
              <li>Generate malware, exploits, or perform illegal cyberattacks.</li>
            </ul>
          </section>

          <section className="legal-page__section">
            <h2>4. Disclaimer and Limitation of Liability</h2>
            <p>
              The Service relies on third-party AI APIs and does not guarantee uninterrupted
              availability or absolute accuracy.
            </p>
            <p>
              You are responsible for reviewing and testing generated outputs before production use.
            </p>
            <p>
              The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without
              warranties. We are not liable for direct or indirect damages from use of the Service.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>5. Intellectual Property</h2>
            <p>
              <strong>Your Code:</strong> You retain ownership of the code you submit.
            </p>
            <p>
              <strong>Our Platform:</strong> The interface, orchestration logic, branding, and
              infrastructure belong to Consensia.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>6. Account Termination</h2>
            <p>
              We may suspend or terminate accounts for violations of these Terms, including abuse,
              attempts to bypass limits, spam, or payment fraud.
            </p>
          </section>

          <section className="legal-page__section">
            <h2>7. Contact Us</h2>
            <p>
              Questions about these Terms: <a href="mailto:support@faby.world">support@faby.world</a>
            </p>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
