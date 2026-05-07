import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import EstimateSummary from '../EstimateSummary';

const estimate = {
  formData: {
    itemType: 'hat-cap',
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
    hatCapAddon: 24,
    digitizingLow: 0,
    digitizingHigh: 0,
    estimatedLow: 105,
    estimatedHigh: 105,
    quantity: 12,
  },
};

afterEach(() => cleanup());

describe('EstimateSummary', () => {
  it('labels totals as embroidery-only and links to the quote request', () => {
    render(<EstimateSummary estimate={estimate} formData={estimate.formData} />);

    expect(screen.getByText(/Estimated Embroidery Total/i)).toBeTruthy();
    expect(screen.getByText(/Does not include the cost of hats, apparel, or other items being embroidered/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Continue to Quote Request/i }).getAttribute('href')).toBe('#quote');
  });

  it('links manual quote results to the quote request', () => {
    render(
      <EstimateSummary
        estimate={{ formData: estimate.formData, result: { manualQuoteRequired: true } }}
        formData={estimate.formData}
      />
    );

    expect(screen.getByText(/Manual Quote Required/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Continue to Quote Request/i }).getAttribute('href')).toBe('#quote');
  });
});
