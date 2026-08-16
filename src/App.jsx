import { useEffect, useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import EstimateForm from './components/EstimateForm';
import EstimateSummary from './components/EstimateSummary';
import QuoteSubmitForm from './components/QuoteSubmitForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import ThankYouPage from './components/ThankYouPage';
import { trackPageView } from './utils/analytics';

const THANK_YOU_PATH = '/thank-you';
const QUOTE_SUBMITTED_SESSION_KEY = 'quote-request-submitted';

function getCurrentPath() {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname.replace(/\/+$/, '') || '/';
}

function canShowThankYouPage() {
  return getCurrentPath() === THANK_YOU_PATH
    && window.sessionStorage.getItem(QUOTE_SUBMITTED_SESSION_KEY) === 'true';
}

export default function App() {
  const [estimate, setEstimate] = useState(null);
  const [activeRequestPath, setActiveRequestPath] = useState(null);
  const [showThankYouPage, setShowThankYouPage] = useState(canShowThankYouPage);
  const quotePanelRef = useRef(null);

  useEffect(() => {
    if (showThankYouPage) {
      trackPageView(THANK_YOU_PATH);
      return;
    }

    if (getCurrentPath() === THANK_YOU_PATH) {
      window.history.replaceState({}, '', '/');
    }

    trackPageView(getCurrentPath());
  }, [showThankYouPage]);

  const focusQuotePanel = () => {
    setTimeout(() => {
      quotePanelRef.current?.scrollIntoView?.({ behavior: 'smooth', block: 'start' });
      quotePanelRef.current?.focus?.({ preventScroll: true });
    }, 50);
  };

  const showEstimatePath = () => {
    setActiveRequestPath('estimate');
  };

  const showQuotePath = ({ focus = false } = {}) => {
    setActiveRequestPath('quote');
    if (focus) {
      focusQuotePanel();
    }
  };

  const handleEstimate = (data) => {
    setEstimate(data);
    showQuotePath({ focus: true });
  };

  const handleSubmissionSuccess = () => {
    window.sessionStorage.setItem(QUOTE_SUBMITTED_SESSION_KEY, 'true');
    window.history.pushState({}, '', THANK_YOU_PATH);
    setShowThankYouPage(true);
  };

  const handleSubmitAnotherRequest = () => {
    window.sessionStorage.removeItem(QUOTE_SUBMITTED_SESSION_KEY);
    window.history.replaceState({}, '', '/');
    setShowThankYouPage(false);
    showQuotePath({ focus: true });
  };

  if (showThankYouPage) {
    return (
      <>
        <Header />
        <ThankYouPage onSubmitAnotherRequest={handleSubmitAnotherRequest} />
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <Hero />
        <section id="request" className="request-section">
          <div className="container">
            <div className="section-header">
              <h2>Start Your Embroidery Request</h2>
              <p>Choose the path that fits where you are today. You can submit your quote request now or get a price range first.</p>
            </div>

            <div className="request-paths" role="group" aria-label="Choose request path">
              <button
                type="button"
                className={`request-path${activeRequestPath === 'quote' ? ' is-active' : ''}`}
                aria-pressed={activeRequestPath === 'quote'}
                onClick={() => showQuotePath()}
              >
                <span className="request-path__label">Submit a Quote Request</span>
                <span className="request-path__text">Send your artwork, contact details, and order notes right away. You can use the price estimator if you prefer.</span>
              </button>
              <button
                type="button"
                className={`request-path${activeRequestPath === 'estimate' ? ' is-active' : ''}`}
                aria-pressed={activeRequestPath === 'estimate'}
                onClick={showEstimatePath}
              >
                <span className="request-path__label">Get an Estimate First</span>
                <span className="request-path__text">Answer a few pricing questions, then finish the quote request with your estimate included.</span>
              </button>
            </div>

            {!activeRequestPath && (
              <div className="request-placeholder" role="status">
                Pick one of the options above to begin.
              </div>
            )}

            {activeRequestPath === 'estimate' && (
              <div className="request-workflow estimate-layout">
                <EstimateForm onEstimate={handleEstimate} initialFormData={estimate?.formData} />
                <div id="estimate-result">
                  <EstimateSummary
                    estimate={estimate}
                    formData={estimate?.formData}
                    onContinueToQuote={() => showQuotePath({ focus: true })}
                  />
                </div>
              </div>
            )}

            {activeRequestPath === 'quote' && (
              <div
                id="quote-request-panel"
                className="request-workflow quote-form-wrap"
                ref={quotePanelRef}
                tabIndex="-1"
              >
                <QuoteSubmitForm
                  estimate={estimate}
                  onUseEstimator={showEstimatePath}
                  onSubmissionSuccess={handleSubmissionSuccess}
                />
              </div>
            )}
          </div>
        </section>
        <HowItWorks />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
