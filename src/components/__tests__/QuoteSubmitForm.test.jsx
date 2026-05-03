import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import QuoteSubmitForm from '../QuoteSubmitForm';

const estimate = {
  formData: {
    itemType: 'hat-cap',
    quantity: '12',
    designComplexity: 'unsure',
    digitizingNeeded: 'yes',
  },
  result: {
    manualQuoteRequired: false,
    isRange: true,
    quantityTier: '8-15',
    stitchRange: '1-18,000 stitches (estimated)',
    pricePerItemLow: 6.75,
    pricePerItemHigh: 10.65,
    embroiderySubtotalLow: 81,
    embroiderySubtotalHigh: 127.8,
    hatCapAddon: 24,
    digitizingLow: 30,
    digitizingHigh: 75,
    estimatedLow: 135,
    estimatedHigh: 226.8,
    quantity: 12,
  },
};

afterEach(() => cleanup());

describe('QuoteSubmitForm', () => {
  it('syncs estimator values into the quote form when an estimate is calculated', () => {
    const { rerender } = render(<QuoteSubmitForm estimate={null} />);

    expect(screen.getByLabelText(/Item Type/i).value).toBe('');

    rerender(<QuoteSubmitForm estimate={estimate} />);

    expect(screen.getByLabelText(/Item Type/i).value).toBe('hat-cap');
    expect(screen.getByLabelText(/Quantity/i).value).toBe('12');
    expect(screen.getByLabelText(/Design Complexity/i).value).toBe('unsure');
    expect(screen.getByLabelText(/Digitizing Needed/i).value).toBe('yes');
  });

  it('keeps browser validation enabled for required customer fields', () => {
    const { container } = render(<QuoteSubmitForm estimate={estimate} />);
    const form = container.querySelector('form');

    expect(form.noValidate).toBe(false);
    expect(form.checkValidity()).toBe(false);

    fireEvent.change(screen.getByLabelText(/Full Name/i), { target: { value: 'Jane Smith' } });
    fireEvent.change(screen.getByLabelText(/Email/i), { target: { value: 'jane@example.com' } });

    expect(form.checkValidity()).toBe(true);
  });

  it('rejects artwork files larger than the stated upload limit', () => {
    render(<QuoteSubmitForm estimate={estimate} />);

    const largeFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large-logo.png', {
      type: 'image/png',
    });

    fireEvent.change(screen.getByLabelText(/Upload Design/i), {
      target: { files: [largeFile] },
    });

    expect(screen.getByRole('alert').textContent).toContain('10MB');
  });
});
