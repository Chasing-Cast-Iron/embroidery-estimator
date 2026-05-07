import { formatCurrency } from '../utils/formatCurrency';
import { itemOptions } from '../data/itemOptions';
import { designComplexityOptions } from '../data/designComplexity';
import PricingDisclaimer from './PricingDisclaimer';

const itemCostNote = 'Does not include the cost of hats, apparel, or other items being embroidered. Item costs are added separately.';

function QuoteRequestCta({ onContinueToQuote }) {
  return (
    <div className="estimate-next-step">
      <button type="button" className="btn btn-primary btn-lg" onClick={onContinueToQuote}>
        Continue to Quote Request
      </button>
    </div>
  );
}

export default function EstimateSummary({ estimate, formData, onContinueToQuote }) {
  if (!estimate) {
    return (
      <div className="estimate-summary" aria-live="polite" aria-label="Estimate results">
        <h3>Your Estimate</h3>
        <div className="estimate-placeholder">
          <div className="icon" aria-hidden="true">🧵</div>
          <p>Fill out the form and click <strong>Calculate Estimate</strong> to see your price range.</p>
        </div>
        <PricingDisclaimer />
      </div>
    );
  }

  const { result } = estimate;

  if (result.manualQuoteRequired) {
    return (
      <div className="estimate-summary" aria-live="polite">
        <h3>Your Estimate</h3>
        <div className="estimate-manual">
          <h4>Manual Quote Required</h4>
          <p>
            Your order size or design complexity requires a custom quote.
            Please submit your request below and we'll get back to you promptly.
          </p>
        </div>
        <PricingDisclaimer />
        <QuoteRequestCta onContinueToQuote={onContinueToQuote} />
      </div>
    );
  }

  const itemLabel = itemOptions.find(o => o.value === formData?.itemType)?.label || formData?.itemType;
  const complexityLabel = designComplexityOptions.find(o => o.value === formData?.designComplexity)?.label || '';

  return (
    <div className="estimate-summary" aria-live="polite">
      <h3>Your Estimate</h3>
      <div className="estimate-line-items">
        <div className="estimate-line">
          <span className="estimate-line__label">Item</span>
          <span className="estimate-line__value">{itemLabel}</span>
        </div>
        <div className="estimate-line">
          <span className="estimate-line__label">Quantity</span>
          <span className="estimate-line__value">{result.quantity}</span>
        </div>
        <div className="estimate-line">
          <span className="estimate-line__label">Design</span>
          <span className="estimate-line__value">{complexityLabel}</span>
        </div>
        <div className="estimate-line">
          <span className="estimate-line__label">Price per item</span>
          <span className="estimate-line__value">
            {result.isRange
              ? `${formatCurrency(result.pricePerItemLow)} – ${formatCurrency(result.pricePerItemHigh)}`
              : formatCurrency(result.pricePerItem)}
          </span>
        </div>
        <div className="estimate-line">
          <span className="estimate-line__label">Embroidery subtotal</span>
          <span className="estimate-line__value">
            {result.isRange
              ? `${formatCurrency(result.embroiderySubtotalLow)} – ${formatCurrency(result.embroiderySubtotalHigh)}`
              : formatCurrency(result.embroiderySubtotal)}
          </span>
        </div>
        {result.hatCapAddon > 0 && (
          <div className="estimate-line">
            <span className="estimate-line__label">Hat/cap add-on</span>
            <span className="estimate-line__value">{formatCurrency(result.hatCapAddon)}</span>
          </div>
        )}
        {(result.digitizingLow > 0 || result.digitizingHigh > 0) && (
          <div className="estimate-line">
            <span className="estimate-line__label">Est. digitizing fee</span>
            <span className="estimate-line__value">
              {result.digitizingLow === result.digitizingHigh
                ? formatCurrency(result.digitizingLow)
                : `${formatCurrency(result.digitizingLow)} – ${formatCurrency(result.digitizingHigh)}`}
            </span>
          </div>
        )}
      </div>

      <div className="estimate-total" role="status">
        <span className="estimate-total__label">Estimated Embroidery Total</span>
        <span className="estimate-total__value">
          {result.estimatedLow === result.estimatedHigh
            ? formatCurrency(result.estimatedLow)
            : `${formatCurrency(result.estimatedLow)} – ${formatCurrency(result.estimatedHigh)}`}
        </span>
      </div>
      <p className="estimate-item-cost-note">{itemCostNote}</p>

      <PricingDisclaimer />
      <QuoteRequestCta onContinueToQuote={onContinueToQuote} />
    </div>
  );
}
