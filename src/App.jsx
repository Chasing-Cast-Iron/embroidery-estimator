import { useRef, useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import HowItWorks from './components/HowItWorks';
import EstimateForm from './components/EstimateForm';
import EstimateSummary from './components/EstimateSummary';
import QuoteSubmitForm from './components/QuoteSubmitForm';
import FAQ from './components/FAQ';
import Footer from './components/Footer';

export default function App() {
  const [estimate, setEstimate] = useState(null);
  const [activeRequestPath, setActiveRequestPath] = useState(null);
  const quotePanelRef = useRef(null);

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

  return (
    <>
      <Header />
      <main>
        <Hero />
        <section id="request" className="request-section">
          <div className="container">
            <div className="section-header">
              <h2>Start Your Embroidery Request</h2>
              <p>Choose the path that fits where you are today. You can get a price range first or submit your quote request now.</p>
            </div>

            <div className="request-paths" role="group" aria-label="Choose request path">
              <button
                type="button"
                className={`request-path${activeRequestPath === 'estimate' ? ' is-active' : ''}`}
                aria-pressed={activeRequestPath === 'estimate'}
                onClick={showEstimatePath}
              >
                <span className="request-path__label">Get an Estimate First</span>
                <span className="request-path__text">Answer a few pricing questions, then finish the quote request with your estimate included.</span>
              </button>
              <button
                type="button"
                className={`request-path${activeRequestPath === 'quote' ? ' is-active' : ''}`}
                aria-pressed={activeRequestPath === 'quote'}
                onClick={() => showQuotePath()}
              >
                <span className="request-path__label">Submit a Quote Request</span>
                <span className="request-path__text">Skip the estimate and send your artwork, contact details, and order notes right away.</span>
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
                <QuoteSubmitForm estimate={estimate} onUseEstimator={showEstimatePath} />
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
