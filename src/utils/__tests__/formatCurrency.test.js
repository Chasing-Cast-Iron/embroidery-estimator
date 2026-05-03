import { describe, it, expect } from 'vitest';
import { formatCurrency } from '../formatCurrency';

describe('formatCurrency', () => {
  it('formats whole dollar amounts', () => {
    expect(formatCurrency(100)).toBe('$100.00');
  });

  it('formats decimal amounts', () => {
    expect(formatCurrency(6.75)).toBe('$6.75');
  });

  it('formats zero', () => {
    expect(formatCurrency(0)).toBe('$0.00');
  });

  it('formats large amounts', () => {
    expect(formatCurrency(1234.56)).toBe('$1,234.56');
  });
});
