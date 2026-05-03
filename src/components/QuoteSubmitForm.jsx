import { useState } from 'react';
import { itemOptions } from '../data/itemOptions';
import { designComplexityOptions } from '../data/designComplexity';
import { formatCurrency } from '../utils/formatCurrency';
import PricingDisclaimer from './PricingDisclaimer';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;

export default function QuoteSubmitForm({ estimate }) {
  const prefill = estimate?.formData || {};
  const result = estimate?.result;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    itemType: prefill.itemType || '',
    quantity: prefill.quantity || '',
    designComplexity: prefill.designComplexity || '',
    digitizingNeeded: prefill.digitizingNeeded || '',
    deadline: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const buildEstimateSummary = () => {
    if (!result || result.manualQuoteRequired) return 'Manual quote required';
    if (result.isRange) {
      return `Estimated range: ${formatCurrency(result.estimatedLow)} – ${formatCurrency(result.estimatedHigh)}`;
    }
    return `Estimated total: ${formatCurrency(result.estimatedLow)} – ${formatCurrency(result.estimatedHigh)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');

    const payload = new FormData();
    Object.entries(formData).forEach(([k, v]) => payload.append(k, v));
    payload.append('estimateSummary', buildEstimateSummary());
    if (file) payload.append('designFile', file);

    if (FORMSPREE_ENDPOINT) {
      try {
        const res = await fetch(FORMSPREE_ENDPOINT, {
          method: 'POST',
          body: payload,
          headers: { Accept: 'application/json' },
        });
        if (res.ok) {
          setStatus('success');
        } else {
          const data = await res.json().catch(() => ({}));
          setErrorMsg(data?.errors?.[0]?.message || 'Submission failed. Please try again.');
          setStatus('error');
        }
      } catch {
        setErrorMsg('Network error. Please try again or email us directly.');
        setStatus('error');
      }
    } else {
      const subject = encodeURIComponent('Custom Embroidery Quote Request');
      const body = encodeURIComponent(
        `Name: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\n` +
        `Item: ${formData.itemType}\nQuantity: ${formData.quantity}\n` +
        `Design Complexity: ${formData.designComplexity}\nDigitizing: ${formData.digitizingNeeded}\n` +
        `Deadline: ${formData.deadline}\nEstimate: ${buildEstimateSummary()}\nNotes: ${formData.notes}`
      );
      window.location.href = `mailto:hello@chasingcastiron.com?subject=${subject}&body=${body}`;
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="success-message" role="alert">
        <h3>✅ Quote Request Sent!</h3>
        <p>Thanks for reaching out. We'll review your request and get back to you within 1–2 business days.</p>
      </div>
    );
  }

  const digitizingOptions = [
    { value: 'no', label: 'No — I have an embroidery file' },
    { value: 'yes', label: 'Yes — I need digitizing' },
    { value: 'unsure', label: 'Not sure' },
  ];

  return (
    <div className="form-card">
      <h3>Submit Your Quote Request</h3>
      {status === 'error' && (
        <div className="error-message" role="alert">{errorMsg}</div>
      )}
      <form onSubmit={handleSubmit} noValidate encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-name">Full Name <span className="required" aria-hidden="true">*</span></label>
            <input id="q-name" name="name" type="text" className="form-control"
              value={formData.name} onChange={handleChange} required aria-required="true" placeholder="Jane Smith" />
          </div>
          <div className="form-group">
            <label htmlFor="q-email">Email <span className="required" aria-hidden="true">*</span></label>
            <input id="q-email" name="email" type="email" className="form-control"
              value={formData.email} onChange={handleChange} required aria-required="true" placeholder="jane@example.com" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-phone">Phone</label>
            <input id="q-phone" name="phone" type="tel" className="form-control"
              value={formData.phone} onChange={handleChange} placeholder="(555) 555-5555" />
          </div>
          <div className="form-group">
            <label htmlFor="q-deadline">Deadline / Needed By</label>
            <input id="q-deadline" name="deadline" type="date" className="form-control"
              value={formData.deadline} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-item">Item Type <span className="required" aria-hidden="true">*</span></label>
            <select id="q-item" name="itemType" className="form-control"
              value={formData.itemType} onChange={handleChange} required aria-required="true">
              <option value="">— Select item —</option>
              {itemOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="q-qty">Quantity <span className="required" aria-hidden="true">*</span></label>
            <input id="q-qty" name="quantity" type="number" className="form-control"
              value={formData.quantity} onChange={handleChange} min="1" max="500"
              required aria-required="true" placeholder="e.g. 24" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-complexity">Design Complexity <span className="required" aria-hidden="true">*</span></label>
            <select id="q-complexity" name="designComplexity" className="form-control"
              value={formData.designComplexity} onChange={handleChange} required aria-required="true">
              <option value="">— Select complexity —</option>
              {designComplexityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="q-digitizing">Digitizing Needed? <span className="required" aria-hidden="true">*</span></label>
            <select id="q-digitizing" name="digitizingNeeded" className="form-control"
              value={formData.digitizingNeeded} onChange={handleChange} required aria-required="true">
              <option value="">— Select option —</option>
              {digitizingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="q-file">Upload Design / Logo</label>
          <div className="file-input-wrapper">
            <input
              id="q-file"
              type="file"
              accept=".png,.jpg,.jpeg,.pdf,.svg,.ai,.eps,.tif,.tiff"
              onChange={(e) => setFile(e.target.files[0] || null)}
              aria-describedby="file-hint"
            />
            <div className="file-input-label">
              {file
                ? <><strong>✓ {file.name}</strong></>
                : <><strong>Click to upload</strong> or drag &amp; drop your design file</>
              }
            </div>
          </div>
          <p className="form-hint" id="file-hint">Accepted: PNG, JPG, PDF, SVG, AI, EPS. Max 10MB.</p>
        </div>

        <div className="form-group">
          <label htmlFor="q-notes">Additional Notes</label>
          <textarea id="q-notes" name="notes" className="form-control"
            value={formData.notes} onChange={handleChange}
            placeholder="Thread color preferences, placement details, special instructions..." />
        </div>

        {result && !result.manualQuoteRequired && (
          <div style={{ marginBottom: '1rem', padding: '0.75rem 1rem', background: 'var(--color-surface-alt)', borderRadius: 'var(--radius)', fontSize: '0.9rem' }}>
            <strong>Estimate Summary:</strong> {buildEstimateSummary()}
          </div>
        )}

        <PricingDisclaimer />

        <div className="form-actions" style={{ marginTop: '1.25rem' }}>
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting'}>
            {status === 'submitting' ? 'Sending…' : 'Submit Quote Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
