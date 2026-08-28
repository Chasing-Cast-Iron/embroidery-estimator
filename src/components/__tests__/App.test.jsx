import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import App from '../../App';

beforeEach(() => {
  Element.prototype.scrollIntoView = vi.fn();
  window.history.replaceState({}, '', '/');
  window.sessionStorage.clear();
});

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe('App guided request flow', () => {
  it('starts with quote submission before the estimate option', () => {
    render(<App />);

    expect(screen.getByRole('heading', { name: /Start Your Embroidery Request/i })).toBeTruthy();
    const pathButtons = screen.getByRole('group', { name: /Choose request path/i }).querySelectorAll('button');
    expect([...pathButtons].map(button => button.textContent)).toEqual([
      expect.stringContaining('Submit a Quote Request'),
      expect.stringContaining('Get an Estimate First'),
    ]);
    expect(screen.queryByText(/Calculate Your Estimate/i)).toBeNull();
    expect(screen.queryByText(/Finish Your Quote Request/i)).toBeNull();
  });

  it('shows the embroidery phone number and email contact link in the footer', () => {
    render(<App />);

    expect(screen.getByText(/Call 218-544-0071/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: 'Intrlup@gmail.com' }).getAttribute('href'))
      .toBe('mailto:Intrlup@gmail.com');
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

  it('takes a successful submission to the guarded thank-you page and tracks it in GA4', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    const gtagMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    vi.stubGlobal('gtag', gtagMock);
    render(<App />);

    fireEvent.click(screen.getByRole('button', { name: /Submit a Quote Request/i }));
    fireEvent.submit(document.querySelector('form[name="quote-request"]'));

    await screen.findByRole('heading', { name: /Thank You — Your Quote Request Is Sent/i });

    expect(window.location.pathname).toBe('/thank-you');
    expect(screen.getByRole('link', { name: 'Home' }).getAttribute('href')).toBe('/');
    expect(gtagMock).toHaveBeenCalledWith(
      'event',
      'page_view',
      expect.objectContaining({ page_path: '/thank-you' }),
    );
  });

  it('redirects direct visitors away from the guarded thank-you page', async () => {
    window.history.replaceState({}, '', '/thank-you');

    render(<App />);

    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
    expect(screen.queryByRole('heading', { name: /Thank You — Your Quote Request Is Sent/i })).toBeNull();
    expect(screen.getByRole('heading', { name: /Start Your Embroidery Request/i })).toBeTruthy();
  });
});
