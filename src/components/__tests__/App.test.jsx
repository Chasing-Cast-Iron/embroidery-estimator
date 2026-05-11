import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe('App guided request flow', () => {
  it('starts with estimate and quote path choices', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Start Your Embroidery Request/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Get an Estimate First/i })).toBeTruthy();
    expect(screen.getByRole('button', { name: /Submit a Quote Request/i })).toBeTruthy();
    expect(screen.queryByText(/Calculate Your Estimate/i)).toBeNull();
    expect(screen.queryByText(/Finish Your Quote Request/i)).toBeNull();
  });

  it('shows the quote form without requiring an estimate', () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Submit a Quote Request/i }));

    expect(screen.getByText(/Finish Your Quote Request/i)).toBeTruthy();
    expect(screen.getByText(/Submit Without an Estimate/i)).toBeTruthy();
    expect(screen.getByLabelText(/Full Name/i)).toBeTruthy();
    expect(screen.getByLabelText(/Item Type/i).value).toBe('');
  });

  it('reveals the quote form after an estimate and carries estimate fields forward', async () => {
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Get an Estimate First/i }));
    fireEvent.change(screen.getByLabelText(/Item Type/i), {
      target: { name: 'itemType', value: '5374-perf-water-rep' },
    });
    fireEvent.change(screen.getByLabelText(/^Quantity/i), {
      target: { name: 'quantity', value: '12' },
    });
    fireEvent.change(screen.getByLabelText(/Design Complexity/i), {
      target: { name: 'designComplexity', value: 'simple' },
    });
    fireEvent.change(screen.getByLabelText(/Digitizing Needed/i), {
      target: { name: 'digitizingNeeded', value: 'yes' },
    });
    fireEvent.click(screen.getByRole('button', { name: /Calculate Estimate/i }));

    await waitFor(() => {
      expect(screen.getByText(/Finish Your Quote Request/i)).toBeTruthy();
    });

    expect(screen.getByText(/Your estimate details are included with this request/i)).toBeTruthy();
    expect(screen.getByLabelText(/Item Type/i).value).toBe('5374-perf-water-rep');
    expect(screen.getByLabelText(/^Quantity/i).value).toBe('12');
    expect(screen.getByLabelText(/Digitizing Needed/i).value).toBe('yes');

    fireEvent.click(screen.getByRole('button', { name: /Get an Estimate First/i }));

    expect(screen.getByText(/Calculate Your Estimate/i)).toBeTruthy();
    expect(screen.getByLabelText(/Item Type/i).value).toBe('5374-perf-water-rep');
    expect(screen.getByLabelText(/^Quantity/i).value).toBe('12');
    expect(screen.getByLabelText(/Design Complexity/i).value).toBe('simple');
    expect(screen.getByLabelText(/Digitizing Needed/i).value).toBe('yes');
  });
});
