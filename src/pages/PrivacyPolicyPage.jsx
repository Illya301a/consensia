import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'

const TITLE = 'Privacy Policy · Consensia'

export default function PrivacyPolicyPage() {
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
          <h1 className="legal-page__title">Privacy Policy</h1>
          <p className="legal-page__meta">Last updated: April 5, 2026</p>

          <aside className="legal-page__notice" role="note">
            <strong>Draft / test deployment.</strong> This page describes the intended product and
            is published while the site is experimental. Before a public launch, have the text
            reviewed for your situation and jurisdiction (for example EU / GDPR and Czech law if
            applicable). Nothing here is legal advice.
          </aside>

          <p className="legal-page__lead">
            This Privacy Policy explains what data we collect, how we use it, and what rights you
            have regarding your data when using Consensia.
          </p>

          <section className="legal-page__part">
            <h2 className="legal-page__part-title">Privacy Policy</h2>
            <p className="legal-page__section-intro">
              We take your privacy seriously. This section explains what data we collect, how we use
              it, and your rights.
            </p>

            <section className="legal-page__section">
              <h3>1. Data We Collect</h3>
              <p>
                <strong>Profile Data (via Google OAuth):</strong> Your email address and name. This
                is used exclusively for account identification and authentication.
              </p>
              <p>
                <strong>Usage Data:</strong> Your chat history, submitted code snippets, and system
                logs necessary to maintain session stability.
              </p>
              <p>
                <strong>Payment Information:</strong> Your subscription status and Customer ID
                (processed securely by Stripe).
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. Third-Party AI API Processing</h3>
              <p>
                Because we use external AI models to analyze your code, the text of your queries
                (prompts and code snippets) is transmitted via API to our partners (e.g.,
                OpenRouter, Google). These providers process your data solely to generate a
                response. We select partners that adhere to high security standards, but we do not
                control their internal algorithms.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Data Collection for Our AI Training &amp; Opt-Out</h3>
              <p>
                In addition to sending requests to APIs for real-time operation, we store your chat
                histories on our servers. We do this to potentially train, fine-tune, or improve our
                own future orchestration algorithms and models.
              </p>
              <p>
                <strong>Strict Anonymization:</strong> Any data we use for analytics or future
                training is strictly anonymized and stripped of any connection to your name, email, or
                payment details.
              </p>
              <p>
                <strong>How to Opt-Out:</strong> You can forbid us from using your data for these
                training purposes at any time. Simply toggle off the &quot;Data sharing for AI
                training&quot; option in your account settings.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>4. Data Sharing with Third Parties</h3>
              <p>
                We do not sell your personal data to advertisers. We only share necessary data with
                trusted service providers to operate our platform:
              </p>
              <ul>
                <li>
                  <strong>AI API Providers:</strong> To generate responses to your queries.
                </li>
                <li>
                  <strong>Infrastructure Providers:</strong> To host our platform and databases
                  (e.g., our cloud hosting, SQLite/PostgreSQL databases).
                </li>
                <li>
                  <strong>Payment Gateways:</strong> Stripe, to process transactions.
                </li>
              </ul>
            </section>

            <section className="legal-page__section">
              <h3>5. Cookies and Tracking Technologies</h3>
              <p>
                We use essential cookies strictly to provide core platform functionality (such as
                keeping you logged in and securing your session). We do not use third-party
                marketing trackers for targeted advertising without your explicit consent.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>6. Your Data Rights (GDPR &amp; CCPA)</h3>
              <p>Depending on your location, you have the right to:</p>
              <ul>
                <li>
                  <strong>Access:</strong> Request a copy of the personal data we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> Request that we correct inaccurate data.
                </li>
                <li>
                  <strong>Deletion (&quot;Right to be Forgotten&quot;):</strong> Request the
                  complete deletion of your account and associated data.
                </li>
              </ul>
              <p>
                To exercise these rights, contact us at the email provided below or use the account
                deletion option in your profile settings.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>7. Data Retention</h3>
              <p>
                We retain your information only as long as your account is active or as needed to
                provide you the Service and comply with our legal obligations. If you choose to
                delete your account, your personal data will be removed from our active databases
                within 30 days.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>8. Children&apos;s Privacy</h3>
              <p>
                Our Service is not intended for individuals under the age of 16. We do not knowingly
                collect personal data from children. If we discover we have received such data without
                parental consent, we will delete it immediately.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>9. Changes to this Policy</h3>
              <p>
                We may update this document periodically. If we make significant changes (such as
                changes to data usage rules or pricing models), we will notify you via email or a
                prominent notice within the Service dashboard. The current version is always
                available at <Link to="/privacy">/privacy</Link>.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>10. Contact Us</h3>
              <p>
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <p>
                <strong>Email:</strong>{' '}
                <a href="mailto:support@faby.world">support@faby.world</a>
              </p>
            </section>
          </section>
        </article>
      </main>

      <SiteFooter />
    </div>
  )
}
