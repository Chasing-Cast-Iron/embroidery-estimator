import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
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

function getForm(container) {
  return container.querySelector('form[name="quote-request"]');
}

describe('QuoteSubmitForm', () => {
  it('renders a native Netlify form without an embedded iframe', () => {
    const { container } = render(<QuoteSubmitForm estimate={null} />);
    const form = getForm(container);

    expect(form).toBeTruthy();
    expect(form.getAttribute('data-netlify')).toBe('true');
    expect(form.getAttribute('netlify-honeypot')).toBe('bot-field');
    expect(form.getAttribute('enctype')).toBe('multipart/form-data');
    expect(form.querySelector('input[name="form-name"]').value).toBe('quote-request');
    expect(form.querySelector('input[name="customerProvidedItem"]')).toBeNull();
    expect(screen.queryByTitle('Custom embroidery quote request')).toBeNull();
  });

  it('shows quote fields without requiring an estimator first', () => {
    render(<QuoteSubmitForm estimate={null} />);

    expect(screen.getByText(/Submit Without an Estimate/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /Use Estimator/i }).getAttribute('href')).toBe('#estimate');
    expect(screen.getByLabelText(/Full Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Email/i)).toBeTruthy();
    expect(screen.getByLabelText(/Item Type/i)).toBeTruthy();
    expect(screen.getByLabelText(/^Quantity/i)).toBeTruthy();
    expect(screen.getByLabelText(/Design Type/i)).toBeTruthy();
    expect(screen.getByLabelText(/Digitizing Needed/i)).toBeTruthy();
    expect(screen.getByLabelText(/Text to Embroider/i)).toBeTruthy();
    expect(screen.getByLabelText(/Upload Logo/i)).toBeTruthy();
    expect(screen.queryByRole('option', { name: /Customer-Provided Item/i })).toBeNull();
  });

  it('prefills order fields and includes hidden estimate details when an estimate exists', async () => {
    const { container } = render(<QuoteSubmitForm estimate={estimate} />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Item Type/i).value).toBe('hat-cap');
    });

    expect(screen.getByLabelText(/^Quantity/i).value).toBe('12');
    expect(screen.getByLabelText(/Digitizing Needed/i).value).toBe('yes');
    expect(screen.getByLabelText(/Quote request details/i).textContent).toContain('Hat / Cap');

    expect(container.querySelector('input[name="itemTypeLabel"]').value).toBe('Hat / Cap');
    expect(container.querySelector('input[name="designComplexity"]').value).toBe('unsure');
    expect(container.querySelector('input[name="designComplexityLabel"]').value).toContain('Not sure');
    expect(container.querySelector('input[name="estimateSummary"]').value).toContain('Estimated range:');
    expect(container.querySelector('input[name="estimateDetails"]').value).toContain('Digitizing fee:');
  });

  it('includes selected Hatch font details as hidden fields', () => {
    const { container } = render(<QuoteSubmitForm estimate={null} />);

    fireEvent.click(screen.getByRole('button', { name: /Choose Font/i }));
    fireEvent.change(screen.getByLabelText(/Search Hatch Fonts/i), {
      target: { value: 'Script3' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /Script3/ }));

    expect(container.querySelector('input[name="hatchFontName"]').value).toBe('Script3');
    expect(container.querySelector('input[name="hatchFontCategory"]').value).toBe('Script fonts');
    expect(container.querySelector('input[name="hatchFontSizeRange"]').value).toBe('0.8-2.1 in / 20-55 mm');
    expect(container.querySelector('input[name="hatchFontJoinMethod"]').value).toBe('CJ');
  });

  it('requires artwork only for logo/image requests', () => {
    render(<QuoteSubmitForm estimate={null} />);
    const designType = screen.getByLabelText(/Design Type/i);
    const fileInput = screen.getByLabelText(/Upload Logo/i);

    expect(fileInput.required).toBe(false);

    fireEvent.change(designType, {
      target: { name: 'designType', value: 'logo-image' },
    });

    expect(fileInput.required).toBe(true);
  });

  it('requires text only for text-only requests', () => {
    render(<QuoteSubmitForm estimate={null} />);
    const designType = screen.getByLabelText(/Design Type/i);
    const textInput = screen.getByLabelText(/Text to Embroider/i);

    expect(textInput.required).toBe(false);

    fireEvent.change(designType, {
      target: { name: 'designType', value: 'text-only' },
    });

    expect(textInput.required).toBe(true);
  });

  it('rejects artwork files larger than the stated upload limit', () => {
    render(<QuoteSubmitForm estimate={null} />);

    const largeFile = new File([new Uint8Array(10 * 1024 * 1024 + 1)], 'large-logo.png', {
      type: 'image/png',
    });

    fireEvent.change(screen.getByLabelText(/Upload Logo/i), {
      target: { files: [largeFile] },
    });

    expect(screen.getByRole('alert').textContent).toContain('10MB');
    expect(screen.getByRole('button', { name: /Submit Quote Request/i }).disabled).toBe(true);
  });

  it('rejects unsupported artwork file types', () => {
    render(<QuoteSubmitForm estimate={null} />);

    const unsupportedFile = new File(['hello'], 'logo.txt', {
      type: 'text/plain',
    });

    fireEvent.change(screen.getByLabelText(/Upload Logo/i), {
      target: { files: [unsupportedFile] },
    });

    expect(screen.getByRole('alert').textContent).toContain('PNG, JPG, PDF, SVG, AI, EPS, TIF, or TIFF');
  });

  it('defaults deadline to at least 2 weeks from today', () => {
    render(<QuoteSubmitForm estimate={null} />);
    const deadlineInput = screen.getByLabelText(/Deadline/i);

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 14);
    const minDateStr = minDate.toISOString().slice(0, 10);

    expect(deadlineInput.value).toBe(minDateStr);
    expect(deadlineInput.min).toBe(minDateStr);
  });

  it('prevents selecting a deadline sooner than 2 weeks from today', () => {
    render(<QuoteSubmitForm estimate={null} />);
    const deadlineInput = screen.getByLabelText(/Deadline/i);

    const today = new Date();
    const minDate = new Date(today);
    minDate.setDate(today.getDate() + 14);
    const minDateStr = minDate.toISOString().slice(0, 10);

    expect(deadlineInput.min).toBe(minDateStr);
  });

});
