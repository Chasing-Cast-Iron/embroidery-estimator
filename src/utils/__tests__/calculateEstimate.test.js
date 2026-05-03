import { describe, it, expect } from 'vitest';
import { calculateEstimate } from '../calculateEstimate';

describe('calculateEstimate', () => {
  it('returns manualQuoteRequired for "manual" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'shirt', designComplexity: 'manual', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(true);
  });

  it('returns manualQuoteRequired for qty > 350', () => {
    const result = calculateEstimate({ quantity: 400, itemType: 'shirt', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(true);
  });

  it('calculates single stitch range estimate', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'shirt', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(false);
    expect(result.isRange).toBe(false);
    expect(result.pricePerItem).toBe(6.75);
    expect(result.embroiderySubtotal).toBe(67.5);
    expect(result.estimatedLow).toBe(67.5);
    expect(result.estimatedHigh).toBe(67.5);
  });

  it('adds hat/cap addon', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'hat-cap', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.hatCapAddon).toBe(20);
    expect(result.estimatedLow).toBe(87.5);
  });

  it('includes digitizing when yes', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'shirt', designComplexity: 'simple', digitizingNeeded: 'yes' });
    expect(result.digitizingLow).toBe(30);
    expect(result.digitizingHigh).toBe(75);
    expect(result.estimatedLow).toBe(97.5);
    expect(result.estimatedHigh).toBe(142.5);
  });

  it('returns range estimate for "unsure" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'shirt', designComplexity: 'unsure', digitizingNeeded: 'no' });
    expect(result.isRange).toBe(true);
    expect(result.pricePerItemLow).toBeDefined();
    expect(result.pricePerItemHigh).toBeDefined();
  });

  it('returns incomplete for invalid quantity', () => {
    const result = calculateEstimate({ quantity: 0, itemType: 'shirt', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.incomplete).toBe(true);
  });
});
