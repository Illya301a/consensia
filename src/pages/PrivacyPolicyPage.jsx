import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../App.scss'
import SiteFooter from '../components/SiteFooter.jsx'

const TITLE = 'Terms of Service & Privacy Policy · Consensia'

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
          <h1 className="legal-page__title">Terms of Service &amp; Privacy Policy</h1>
          <p className="legal-page__meta">Last updated: April 5, 2026</p>

          <aside className="legal-page__notice" role="note">
            <strong>Draft / test deployment.</strong> This page describes the intended product and
            is published while the site is experimental. Before a public launch, have the text
            reviewed for your situation and jurisdiction (for example EU / GDPR and Czech law if
            applicable). Nothing here is legal advice.
          </aside>

          <p className="legal-page__lead">
            Welcome to Consensia (&quot;Service&quot;, &quot;we&quot;, &quot;us&quot;, or
            &quot;our&quot;). By accessing or using our website (
            <a href="https://consensia.faby.world" rel="noopener noreferrer">
              https://consensia.faby.world
            </a>
            ) and services, you agree to be bound by these Terms of Service and our Privacy
            Policy. If you do not agree with any part of these terms, please do not use the Service.
          </p>

          <section className="legal-page__part">
            <h2 className="legal-page__part-title">Part 1: Terms of Service</h2>

            <section className="legal-page__section">
              <h3>1. Registration and Account</h3>
              <p>
                <strong>Mandatory Registration:</strong> To use the Service (including the free
                tier), you must create an account.
              </p>
              <p>
                <strong>Authentication:</strong> We use secure third-party authentication (Google
                OAuth). You agree to provide accurate information and are solely responsible for
                maintaining the security of your account.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. Pricing, Credits, and Payments</h3>
              <p>
                <strong>Free Tier:</strong> New registered users may receive a limited amount of
                complimentary credits or a fixed number of free requests to experience the
                Service. These limits are subject to change and are specified on our dashboard.
              </p>
              <p>
                <strong>Credit-Based System:</strong> Our Service operates on a Credit System.
                Instead of a flat monthly fee for unlimited use, users purchase credit packages
                (e.g., $10 for 1,000 credits).
              </p>
              <p>
                <strong>Consumption:</strong> Credits are consumed based on the actual usage of
                underlying AI models, which is measured in tokens (the volume of input code and
                generated output).
              </p>
              <p>
                There is no fixed &quot;price per request.&quot; The cost of a single session
                depends on the length of the code provided, the number of AI agents involved, and
                the complexity of their responses.
              </p>
              <p>You can monitor your remaining credit balance in your account dashboard.</p>
              <p>
                <strong>Non-Refundable:</strong> Purchased credits are generally non-refundable once
                they have been partially used, except where required by law. Credits do not have an
                expiration date unless specified at the time of purchase.
              </p>
              <p>
                <strong>Payment Processing:</strong> All financial transactions are securely
                handled via Stripe. We do not store your full credit card details or sensitive
                billing information on our servers.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Acceptable Use</h3>
              <p>You agree not to use the Service to:</p>
              <ul>
                <li>Violate any applicable laws, copyrights, or licenses.</li>
                <li>Attempt to hack, DDoS, or reverse-engineer our systems, platform, or API.</li>
                <li>
                  Generate malicious software (malware), exploits, or conduct illegal cyberattacks.
                </li>
              </ul>
            </section>

            <section className="legal-page__section">
              <h3>4. Disclaimer and Limitation of Liability</h3>
              <p>
                Our Service acts as an orchestrator and relies on third-party Artificial
                Intelligence APIs (such as OpenRouter, Google, OpenAI, Meta, etc.) to process your
                requests and generate code analysis.
              </p>
              <p>
                The Service does not guarantee the uninterrupted availability or accuracy of these
                third-party APIs.
              </p>
              <p>
                AI models can make mistakes, generate unoptimized code, or produce
                &quot;hallucinations&quot; (false positives).
              </p>
              <p>
                You are solely responsible for testing, reviewing, and securing any code generated
                by the Service before implementing it into your projects.
              </p>
              <p>
                The Service is provided on an &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; basis
                without warranties of any kind. We shall not be liable for any direct, indirect,
                incidental, or consequential damages (including loss of profits, data, or business
                interruption) arising from your use of the Service.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>5. Intellectual Property</h3>
              <p>
                <strong>Your Code:</strong> You retain all ownership rights to the source code you
                submit to the Service. We do not claim any copyright over the code generated by
                third-party AI models in response to your prompts. You are free to use it in your
                commercial and non-commercial projects.
              </p>
              <p>
                <strong>Our Platform:</strong> The interface, orchestration logic (Consensia), logos,
                and infrastructure belong to us. You may not copy, resell, or duplicate any part of
                our Service without written permission.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>6. Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account at any time, without prior
                notice or refund, if you violate these Terms (e.g., attempting to bypass API limits,
                spamming, or fraudulent payment chargebacks).
              </p>
            </section>
          </section>

          <section className="legal-page__part">
            <h2 className="legal-page__part-title">Part 2: Privacy Policy</h2>
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
                If you have any questions about these Terms of Service or Privacy Policy, please
                contact us at:
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
