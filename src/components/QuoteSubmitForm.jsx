import { useState } from 'react';
import { itemOptions } from '../data/itemOptions';
import { designComplexityOptions } from '../data/designComplexity';
import { formatCurrency } from '../utils/formatCurrency';
import { getHatchFontSizeRange } from '../utils/hatchFontFormatting';
import HatchFontSelector from './HatchFontSelector';
import PricingDisclaimer from './PricingDisclaimer';

const NETLIFY_FORM_NAME = 'quote-request';
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
const MAX_UPLOAD_MB = 10;
const ACCEPTED_FILE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.pdf', '.svg', '.ai', '.eps', '.tif', '.tiff'];
const FILE_ACCEPT = ACCEPTED_FILE_EXTENSIONS.join(',');

const designTypeOptions = [
  { value: 'logo-image', label: 'Logo / image artwork' },
  { value: 'text-only', label: 'Text-only embroidery' },
  { value: 'logo-with-text', label: 'Logo / image plus text' },
  { value: 'unsure', label: 'Not sure yet' },
];

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

function isAcceptedFile(file) {
  if (!file?.name) return true;
  return ACCEPTED_FILE_EXTENSIONS.some(extension => file.name.toLowerCase().endsWith(extension));
}

export default function QuoteSubmitForm({ estimate }) {
  const estimateFormData = estimate?.formData || {};
  const hasEstimate = Boolean(estimate && estimateFormData.itemType);
  const currentResult = hasEstimate ? estimate?.result : null;
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    deadline: '',
    itemType: '',
    quantity: '',
    designType: '',
    textToEmbroider: '',
    digitizingNeeded: '',
    notes: '',
  });
  const [selectedFont, setSelectedFont] = useState(null);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [status, setStatus] = useState('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const itemTypeLabel = getOptionLabel(itemOptions, estimateFormData.itemType);
  const designComplexityLabel = getOptionLabel(designComplexityOptions, estimateFormData.designComplexity);
  const digitizingNeededLabel = getOptionLabel(digitizingOptions, estimateFormData.digitizingNeeded);
  const effectiveFormData = {
    ...formData,
    itemType: formData.itemType || estimateFormData.itemType || '',
    quantity: formData.quantity || estimateFormData.quantity || '',
    digitizingNeeded: formData.digitizingNeeded || estimateFormData.digitizingNeeded || '',
  };
  const formItemTypeLabel = getOptionLabel(itemOptions, effectiveFormData.itemType);
  const formDigitizingNeededLabel = getOptionLabel(digitizingOptions, effectiveFormData.digitizingNeeded);
  const isArtworkRequired = formData.designType === 'logo-image' || formData.designType === 'logo-with-text';
  const isTextRequired = formData.designType === 'text-only' || formData.designType === 'logo-with-text';

  const buildEstimateSummary = () => {
    if (!hasEstimate) return '';
    if (!currentResult || currentResult.incomplete) return 'No estimate calculated';
    if (currentResult.manualQuoteRequired) return 'Manual quote required';
    if (currentResult.isRange) {
      return `Estimated range: ${formatRange(currentResult.estimatedLow, currentResult.estimatedHigh)}`;
    }
    return `Estimated total: ${formatRange(currentResult.estimatedLow, currentResult.estimatedHigh)}`;
  };

  const buildEstimateDetails = () => {
    if (!hasEstimate) return '';

    const lines = [
      `Item: ${itemTypeLabel || 'Not provided'}`,
      `Quantity: ${estimateFormData.quantity || 'Not provided'}`,
      `Design complexity: ${designComplexityLabel || 'Not provided'}`,
      `Digitizing needed: ${digitizingNeededLabel || 'Not provided'}`,
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

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0] || null;

    if (selectedFile && selectedFile.size > MAX_UPLOAD_BYTES) {
      setFile(null);
      setFileError(`Please choose a file ${MAX_UPLOAD_MB}MB or smaller.`);
      e.target.value = '';
      return;
    }

    if (selectedFile && !isAcceptedFile(selectedFile)) {
      setFile(null);
      setFileError('Please upload PNG, JPG, PDF, SVG, AI, EPS, TIF, or TIFF artwork.');
      e.target.value = '';
      return;
    }

    setFile(selectedFile);
    setFileError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (fileError) return;

    const formPayload = new FormData(e.currentTarget);
    const artworkFile = formPayload.get('artworkFile');

    if (artworkFile instanceof File && artworkFile.size > MAX_UPLOAD_BYTES) {
      setFileError(`Please choose a file ${MAX_UPLOAD_MB}MB or smaller.`);
      return;
    }

    setStatus('submitting');
    setErrorMsg('');

    try {
      const response = await fetch('/', {
        method: 'POST',
        body: formPayload,
      });

      if (!response.ok) {
        throw new Error('Netlify form submission failed.');
      }

      setStatus('success');
    } catch {
      setStatus('error');
      setErrorMsg('Submission failed. Please try again, or call 218-544-0071.');
    }
  };

  if (status === 'success') {
    return (
      <div className="success-message" role="alert">
        <h3>Quote Request Sent</h3>
        <p>Thanks for reaching out. We'll review your request and get back to you within 1-2 business days.</p>
      </div>
    );
  }

  return (
    <div className="form-card quote-handoff">
      <h3>Finish Your Request</h3>

      <div className="quote-prep">
        {!hasEstimate ? (
          <div className="quote-no-estimate">
            <div>
              <h4>Submit Without an Estimate</h4>
              <p>
                Use the form below to send your request now, or use the estimator first if you want a price range.
              </p>
            </div>
            <a className="btn btn-secondary btn-sm" href="#estimate">Use Estimator</a>
          </div>
        ) : (
          <>
            <div className="quote-recap" aria-label="Quote request details">
              <div className="quote-recap__item">
                <span>Item</span>
                <strong>{itemTypeLabel}</strong>
              </div>
              <div className="quote-recap__item">
                <span>Quantity</span>
                <strong>{estimateFormData.quantity}</strong>
              </div>
              <div className="quote-recap__item">
                <span>Design</span>
                <strong>{designComplexityLabel}</strong>
              </div>
              <div className="quote-recap__item">
                <span>Digitizing</span>
                <strong>{digitizingNeededLabel}</strong>
              </div>
            </div>

            <div className="quote-estimate-summary">
              <strong>Estimate Summary:</strong> {buildEstimateSummary()}
            </div>
          </>
        )}

        <div className="font-selector-wrap">
          <h4>Text Font Preference</h4>
          <p className="form-hint">
            Optional for text-only embroidery. Logo or image artwork can be uploaded in the quote form below.
          </p>
          <HatchFontSelector selectedFont={selectedFont} onSelectFont={setSelectedFont} />
        </div>
      </div>

      <PricingDisclaimer />

      {status === 'error' && (
        <div className="error-message" role="alert">{errorMsg}</div>
      )}

      <form
        name={NETLIFY_FORM_NAME}
        method="POST"
        action="/"
        data-netlify="true"
        netlify-honeypot="bot-field"
        encType="multipart/form-data"
        onSubmit={handleSubmit}
      >
        <input type="hidden" name="form-name" value={NETLIFY_FORM_NAME} />
        <p hidden>
          <label>
            Do not fill this out: <input name="bot-field" />
          </label>
        </p>
        <input type="hidden" name="source" value="embroidery-estimator" />
        <input type="hidden" name="itemTypeLabel" value={formItemTypeLabel || itemTypeLabel || ''} />
        <input type="hidden" name="designComplexity" value={estimateFormData.designComplexity || ''} />
        <input type="hidden" name="designComplexityLabel" value={designComplexityLabel || ''} />
        <input type="hidden" name="digitizingNeededLabel" value={formDigitizingNeededLabel || digitizingNeededLabel || ''} />
        <input type="hidden" name="estimateSummary" value={buildEstimateSummary()} />
        <input type="hidden" name="estimateDetails" value={buildEstimateDetails()} />
        <input type="hidden" name="hatchFontName" value={selectedFont?.name || ''} />
        <input type="hidden" name="hatchFontCategory" value={selectedFont?.category || ''} />
        <input type="hidden" name="hatchFontSizeRange" value={getHatchFontSizeRange(selectedFont)} />
        <input type="hidden" name="hatchFontJoinMethod" value={selectedFont?.joinMethod || ''} />

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
              value={effectiveFormData.itemType} onChange={handleChange} required aria-required="true">
              <option value="">- Select item -</option>
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
            <label htmlFor="q-design-type">Design Type <span className="required" aria-hidden="true">*</span></label>
            <select id="q-design-type" name="designType" className="form-control"
              value={formData.designType} onChange={handleChange} required aria-required="true">
              <option value="">- Select design type -</option>
              {designTypeOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="q-digitizing">Digitizing Needed? <span className="required" aria-hidden="true">*</span></label>
            <select id="q-digitizing" name="digitizingNeeded" className="form-control"
              value={effectiveFormData.digitizingNeeded} onChange={handleChange} required aria-required="true">
              <option value="">- Select option -</option>
              {digitizingOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="q-text">
            Text to Embroider {isTextRequired && <span className="required" aria-hidden="true">*</span>}
          </label>
          <textarea id="q-text" name="textToEmbroider" className="form-control"
            value={formData.textToEmbroider} onChange={handleChange}
            required={isTextRequired} aria-required={isTextRequired}
            placeholder="Names, words, monogram letters, or exact text for text-only embroidery." />
        </div>

        <div className="form-group">
          <label htmlFor="q-file">
            Upload Logo / Photo {isArtworkRequired ? <span className="required" aria-hidden="true">*</span> : <span className="field-optional">(optional)</span>}
          </label>
          <div className="file-input-wrapper">
            <input
              id="q-file"
              type="file"
              name="artworkFile"
              accept={FILE_ACCEPT}
              onChange={handleFileChange}
              required={isArtworkRequired}
              aria-required={isArtworkRequired}
              aria-describedby={`file-hint${fileError ? ' file-error' : ''}`}
            />
            <div className="file-input-label">
              {file
                ? <><strong>{file.name}</strong></>
                : <><strong>Click to upload</strong> or drag &amp; drop your artwork file</>
              }
            </div>
          </div>
          <p className="form-hint" id="file-hint">Accepted: PNG, JPG, PDF, SVG, AI, EPS, TIF, TIFF. Max {MAX_UPLOAD_MB}MB.</p>
          {fileError && (
            <p className="form-hint file-error" id="file-error" role="alert">{fileError}</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="q-notes">Additional Notes</label>
          <textarea id="q-notes" name="notes" className="form-control"
            value={formData.notes} onChange={handleChange}
            placeholder="Thread colors, placement, garment details, timing, or anything else we should know." />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn-primary btn-lg" disabled={status === 'submitting' || Boolean(fileError)}>
            {status === 'submitting' ? 'Sending...' : 'Submit Quote Request'}
          </button>
        </div>
      </form>
    </div>
  );
}
