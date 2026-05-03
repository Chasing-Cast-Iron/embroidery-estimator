import { useState } from 'react';
import { itemOptions } from '../data/itemOptions';
import { designComplexityOptions } from '../data/designComplexity';
import { calculateEstimate } from '../utils/calculateEstimate';
import { formatCurrency } from '../utils/formatCurrency';
import PricingDisclaimer from './PricingDisclaimer';

const FORMSPREE_ENDPOINT = import.meta.env.VITE_FORMSPREE_ENDPOINT;
const TALLY_UPLOAD_URL = import.meta.env.VITE_TALLY_UPLOAD_URL;
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_MB = 10;

const digitizingOptions = [
  { value: 'no', label: 'No - I have an embroidery file' },
  { value: 'yes', label: 'Yes - I need digitizing' },
  { value: 'unsure', label: 'Not sure' },
];

function getOptionLabel(options, value) {
  return options.find(option => option.value === value)?.label || value || '';
}

function formatRange(low, high) {
  return low === high
    ? formatCurrency(low)
    : `${formatCurrency(low)} - ${formatCurrency(high)}`;
}

export default function QuoteSubmitForm({ estimate }) {
  const estimateFormData = estimate?.formData || {};
  const result = estimate?.result;

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    itemType: '',
    quantity: '',
    designComplexity: '',
    digitizingNeeded: '',
    deadline: '',
    notes: '',
  });
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [usedMailtoFallback, setUsedMailtoFallback] = useState(false);

  const effectiveFormData = {
    ...formData,
    itemType: formData.itemType || estimateFormData.itemType || '',
    quantity: formData.quantity || estimateFormData.quantity || '',
    designComplexity: formData.designComplexity || estimateFormData.designComplexity || '',
    digitizingNeeded: formData.digitizingNeeded || estimateFormData.digitizingNeeded || '',
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && selectedFile.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      setFileError(`Please choose a file ${MAX_UPLOAD_MB}MB or smaller, or submit without a file and we will follow up with artwork instructions.`);
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    setFileError('');
  };

  const hasEstimateInputs = effectiveFormData.itemType &&
    effectiveFormData.quantity &&
    parseInt(effectiveFormData.quantity, 10) >= 1 &&
    effectiveFormData.designComplexity &&
    effectiveFormData.digitizingNeeded;

  const currentResult = hasEstimateInputs ? calculateEstimate(effectiveFormData) : result;

  const buildEstimateSummary = () => {
    if (!currentResult || currentResult.incomplete) return 'No estimate calculated';
    if (currentResult.manualQuoteRequired) return 'Manual quote required';
    if (currentResult.isRange) {
      return `Estimated range: ${formatRange(currentResult.estimatedLow, currentResult.estimatedHigh)}`;
    }
    return `Estimated total: ${formatRange(currentResult.estimatedLow, currentResult.estimatedHigh)}`;
  };

  const buildEstimateDetails = () => {
    const lines = [
      `Item: ${getOptionLabel(itemOptions, effectiveFormData.itemType)}`,
      `Quantity: ${effectiveFormData.quantity}`,
      `Design complexity: ${getOptionLabel(designComplexityOptions, effectiveFormData.designComplexity)}`,
      `Digitizing needed: ${getOptionLabel(digitizingOptions, effectiveFormData.digitizingNeeded)}`,
      `Deadline: ${effectiveFormData.deadline || 'Not provided'}`,
    ];

    if (!currentResult || currentResult.incomplete) {
      return [...lines, 'Estimate: Not calculated'].join('\n');
    }

    if (currentResult.manualQuoteRequired) {
      return [...lines, 'Estimate: Manual quote required'].join('\n');
    }

    lines.push(`Estimated stitch range: ${currentResult.stitchRange}`);
    lines.push(
      currentResult.isRange
        ? `Price per item: ${formatRange(currentResult.pricePerItemLow, currentResult.pricePerItemHigh)}`
        : `Price per item: ${formatCurrency(currentResult.pricePerItem)}`
    );
    lines.push(
      currentResult.isRange
        ? `Embroidery subtotal: ${formatRange(currentResult.embroiderySubtotalLow, currentResult.embroiderySubtotalHigh)}`
        : `Embroidery subtotal: ${formatCurrency(currentResult.embroiderySubtotal)}`
    );
    lines.push(`Hat/cap add-on: ${formatCurrency(currentResult.hatCapAddon)}`);
    lines.push(`Digitizing fee: ${formatRange(currentResult.digitizingLow, currentResult.digitizingHigh)}`);
    lines.push(buildEstimateSummary());

    return lines.join('\n');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMsg('');
    setUsedMailtoFallback(false);

    const payload = new FormData();
    Object.entries(effectiveFormData).forEach(([k, v]) => payload.append(k, v));
    payload.append('estimateSummary', buildEstimateSummary());
    payload.append('estimateDetails', buildEstimateDetails());
    payload.append('itemTypeLabel', getOptionLabel(itemOptions, effectiveFormData.itemType));
    payload.append('designComplexityLabel', getOptionLabel(designComplexityOptions, effectiveFormData.designComplexity));
    payload.append('digitizingNeededLabel', getOptionLabel(digitizingOptions, effectiveFormData.digitizingNeeded));
    payload.append('artworkFollowUpNeeded', file ? 'Maybe - file selected, but upload delivery depends on backend support' : 'Yes - no file attached');
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
        `Name: ${effectiveFormData.name}\nEmail: ${effectiveFormData.email}\nPhone: ${effectiveFormData.phone}\n` +
        `${buildEstimateDetails()}\nNotes: ${effectiveFormData.notes}\n\n` +
        'Artwork: Attach it to this email or send it separately after we follow up.'
      );
      setUsedMailtoFallback(true);
      window.location.href = `mailto:hello@chasingcastiron.com?subject=${subject}&body=${body}`;
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="success-message" role="alert">
        <h3>{usedMailtoFallback ? 'Email Draft Opened' : 'Quote Request Sent'}</h3>
        <p>
          {usedMailtoFallback
            ? 'Send the email draft from your mail app so we receive the quote request.'
            : "Thanks for reaching out. We'll review your request and get back to you within 1-2 business days."}
        </p>
        <p>If your artwork was not attached or upload is unavailable, we'll reply with instructions for sending it separately.</p>
      </div>
    );
  }

  return (
    <div className="form-card">
      <h3>Submit Your Quote Request</h3>
      {status === 'error' && (
        <div className="error-message" role="alert">{errorMsg}</div>
      )}
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-name">Full Name <span className="required" aria-hidden="true">*</span></label>
            <input id="q-name" name="name" type="text" className="form-control"
              value={effectiveFormData.name} onChange={handleChange} required aria-required="true" placeholder="Jane Smith" />
          </div>
          <div className="form-group">
            <label htmlFor="q-email">Email <span className="required" aria-hidden="true">*</span></label>
            <input id="q-email" name="email" type="email" className="form-control"
              value={effectiveFormData.email} onChange={handleChange} required aria-required="true" placeholder="jane@example.com" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-phone">Phone</label>
            <input id="q-phone" name="phone" type="tel" className="form-control"
              value={effectiveFormData.phone} onChange={handleChange} placeholder="(555) 555-5555" />
          </div>
          <div className="form-group">
            <label htmlFor="q-deadline">Deadline / Needed By</label>
            <input id="q-deadline" name="deadline" type="date" className="form-control"
              value={effectiveFormData.deadline} onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-item">Item Type <span className="required" aria-hidden="true">*</span></label>
            <select id="q-item" name="itemType" className="form-control"
              value={effectiveFormData.itemType} onChange={handleChange} required aria-required="true">
              <option value="">— Select item —</option>
              {itemOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="q-qty">Quantity <span className="required" aria-hidden="true">*</span></label>
            <input id="q-qty" name="quantity" type="number" className="form-control"
              value={effectiveFormData.quantity} onChange={handleChange} min="1" max="500"
              required aria-required="true" placeholder="e.g. 24" />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="q-complexity">Design Complexity <span className="required" aria-hidden="true">*</span></label>
            <select id="q-complexity" name="designComplexity" className="form-control"
              value={effectiveFormData.designComplexity} onChange={handleChange} required aria-required="true">
              <option value="">— Select complexity —</option>
              {designComplexityOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="q-digitizing">Digitizing Needed? <span className="required" aria-hidden="true">*</span></label>
            <select id="q-digitizing" name="digitizingNeeded" className="form-control"
              value={effectiveFormData.digitizingNeeded} onChange={handleChange} required aria-required="true">
              <option value="">— Select option —</option>
              {digitizingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="q-file">Upload Design / Logo <span className="field-optional">(optional)</span></label>
          <div className="file-input-wrapper">
            <input
              id="q-file"
              type="file"
              name="designFile"
              accept=".png,.jpg,.jpeg,.pdf,.svg,.ai,.eps,.tif,.tiff"
              onChange={handleFileChange}
              aria-describedby={`file-hint file-fallback${fileError ? ' file-error' : ''}`}
            />
            <div className="file-input-label">
              {file
                ? <><strong>{file.name}</strong></>
                : <><strong>Click to upload</strong> or drag &amp; drop your design file</>
              }
            </div>
          </div>
          <p className="form-hint" id="file-hint">Accepted: PNG, JPG, PDF, SVG, AI, EPS. Max 10MB.</p>
          {fileError && (
            <p className="form-hint file-error" id="file-error" role="alert">{fileError}</p>
          )}
          <p className="form-hint upload-fallback-note" id="file-fallback">
            <strong>If upload is unavailable,</strong> submit the form and we'll reply with instructions for sending your artwork.
            {TALLY_UPLOAD_URL && (
              <>
                {' '}You can also use the <a href={TALLY_UPLOAD_URL} target="_blank" rel="noreferrer">artwork upload form</a>.
              </>
            )}
          </p>
        </div>

        <div className="form-group">
          <label htmlFor="q-notes">Additional Notes</label>
          <textarea id="q-notes" name="notes" className="form-control"
            value={effectiveFormData.notes} onChange={handleChange}
            placeholder="Thread color preferences, placement details, special instructions..." />
        </div>

        {currentResult && !currentResult.manualQuoteRequired && !currentResult.incomplete && (
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
