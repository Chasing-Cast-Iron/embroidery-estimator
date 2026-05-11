import { useState } from 'react';

const faqs = [
  {
    q: 'How is the estimate calculated?',
    a: 'Estimates are based on your selected item type, quantity, design complexity (stitch count range), and whether digitizing is needed. Prices follow quantity-tier pricing — the more items, the lower the per-item cost.'
  },
  {
    q: 'Is the estimate the final price?',
    a: 'No. The estimate is a preliminary price range. Final pricing is confirmed after we review your actual artwork, verify the stitch count, check design placement, and assess thread colors and material. We will always confirm before starting your order.'
  },
  {
    q: 'What file types can I upload?',
    a: 'For best results, vector files are preferred: SVG, AI, EPS, or PDF. High-resolution raster images (PNG, JPG, TIFF at 300+ DPI) also work. If your file needs clean-up, we may request an updated version.'
  },
  {
    q: 'How long does it take?',
    a: 'Typical turnaround is 1–2 weeks after artwork is approved and payment/deposit is received. Rush orders may be available — let us know your deadline in the notes field.'
  },
  {
    q: 'Do I need to provide digitizing?',
    a: "If you don't already have an embroidery file (.DST, .PES, etc.), digitizing is required. It's a one-time fee of approximately $30–$75 depending on design complexity. Once digitized, we keep your file on file for future orders."
  },
  {
    q: "What if I'm not sure about design complexity?",
    a: "Choose \"Not sure — show me an estimate range.\" This will display a price range based on all stitch count tiers. When you submit your request, we'll evaluate your actual artwork and provide an accurate quote."
  },
  {
    q: 'What items can be embroidered?',
    a: "The estimator includes the listed hat and cap styles. If you need a different apparel or accessory option, submit a quote request and tell us about it in the notes."
  },
  {
    q: "What's the minimum order?",
    a: 'There is no strict minimum — we can do single-item orders. However, per-item pricing is significantly lower at higher quantities. Check the estimator to compare pricing tiers and find the sweet spot for your budget.'
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (i) => setOpenIndex(openIndex === i ? null : i);

  return (
    <section id="faq" className="faq">
      <div className="container">
        <div className="section-header">
          <h2>Frequently Asked Questions</h2>
          <p>Everything you need to know about our embroidery pricing and process.</p>
        </div>
        <div className="faq__list">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className={`faq__item${openIndex === i ? ' faq__item--open' : ''}`}
            >
              <button
                className="faq__question"
                onClick={() => toggle(i)}
                aria-expanded={openIndex === i}
                aria-controls={`faq-answer-${i}`}
                id={`faq-question-${i}`}
              >
                {faq.q}
                <span className="faq__icon" aria-hidden="true">+</span>
              </button>
              {openIndex === i && (
                <div
                  className="faq__answer"
                  id={`faq-answer-${i}`}
                  role="region"
                  aria-labelledby={`faq-question-${i}`}
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
