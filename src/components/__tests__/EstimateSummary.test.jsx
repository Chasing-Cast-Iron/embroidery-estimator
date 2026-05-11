import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import EstimateSummary from '../EstimateSummary';

const estimate = {
  formData: {
    itemType: '5374-perf-water-rep',
    quantity: '12',
    designComplexity: 'simple',
    digitizingNeeded: 'no',
  },
  result: {
    manualQuoteRequired: false,
    isRange: false,
    quantityTier: '8-15',
    stitchRange: '1-5,000 stitches',
    pricePerItem: 6.75,
    embroiderySubtotal: 81,
    itemBasePrice: 9.99,
    itemSubtotal: 119.88,
    hatCapAddon: 24,
    digitizingLow: 0,
    digitizingHigh: 0,
    estimatedLow: 224.88,
    estimatedHigh: 224.88,
    quantity: 12,
  },
};

afterEach(() => cleanup());

describe('EstimateSummary', () => {
  it('includes item costs in the estimated total and links to the quote request', () => {
    const onContinueToQuote = vi.fn();
    render(<EstimateSummary estimate={estimate} formData={estimate.formData} onContinueToQuote={onContinueToQuote} />);

    expect(screen.getByText(/Estimated Total/i)).toBeTruthy();
    expect(screen.getByText(/Base item price/i)).toBeTruthy();
    expect(screen.getByText(/Item subtotal/i)).toBeTruthy();
    expect(screen.getByText('$9.99')).toBeTruthy();
    expect(screen.getByText('$119.88')).toBeTruthy();
    expect(screen.getByText('$224.88')).toBeTruthy();
    expect(screen.queryByText(/Does not include the cost of hats, apparel, or other items being embroidered/i)).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Continue to Quote Request/i }));
    expect(onContinueToQuote).toHaveBeenCalledTimes(1);
  });

  it('links manual quote results to the quote request', () => {
    const onContinueToQuote = vi.fn();
    render(
      <EstimateSummary
        estimate={{ formData: estimate.formData, result: { manualQuoteRequired: true } }}
        formData={estimate.formData}
        onContinueToQuote={onContinueToQuote}
      />
    );

    expect(screen.getByText(/Manual Quote Required/i)).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: /Continue to Quote Request/i }));
    expect(onContinueToQuote).toHaveBeenCalledTimes(1);
  });
});
