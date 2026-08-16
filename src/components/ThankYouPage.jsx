import { useEffect, useRef } from 'react';

export default function ThankYouPage({ onSubmitAnotherRequest }) {
  const headingRef = useRef(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <main className="thank-you-page">
      <section className="request-section" aria-labelledby="thank-you-heading">
        <div className="container">
          <div className="success-message">
            <h1 id="thank-you-heading" ref={headingRef} tabIndex="-1">
              Thank You — Your Quote Request Is Sent
            </h1>
            <p>We received your quote request and will be in touch soon.</p>
            <button type="button" className="btn btn-secondary" onClick={onSubmitAnotherRequest}>
              Submit Another Quote Request
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
