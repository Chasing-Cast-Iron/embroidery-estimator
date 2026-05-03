import { useState } from 'react';
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

  const handleEstimate = (data) => {
    setEstimate(data);
    setTimeout(() => {
      document.getElementById('estimate-result')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 50);
  };

  return (
    <>
      <Header />
      <main>
        <Hero />
        <HowItWorks />
        <section id="estimate" className="estimate-section">
          <div className="container">
            <div className="section-header">
              <h2>Get Your Embroidery Estimate</h2>
              <p>Fill in the details below to see a price range for your order.</p>
            </div>
            <div className="estimate-layout">
              <EstimateForm onEstimate={handleEstimate} />
              <div id="estimate-result">
                <EstimateSummary estimate={estimate} formData={estimate?.formData} />
              </div>
            </div>
          </div>
        </section>
        <section className="quote-section" id="quote">
          <div className="container">
            <div className="section-header">
              <h2>Submit Your Quote Request</h2>
              <p>Ready to move forward? Send us your details and artwork — we'll review and confirm your final price.</p>
            </div>
            <div className="quote-form-wrap">
              <QuoteSubmitForm estimate={estimate} />
            </div>
          </div>
        </section>
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
