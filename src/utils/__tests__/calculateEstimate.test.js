import { describe, it, expect } from 'vitest';
import { calculateEstimate } from '../calculateEstimate';

describe('calculateEstimate', () => {
  it('returns manualQuoteRequired for "manual" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'manual', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(true);
  });

  it('returns manualQuoteRequired for qty > 350', () => {
    const result = calculateEstimate({ quantity: 400, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(true);
  });

  it('calculates single stitch range estimate', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(false);
    expect(result.isRange).toBe(false);
    expect(result.pricePerItem).toBe(6.75);
    expect(result.embroiderySubtotal).toBe(67.5);
    expect(result.itemBasePrice).toBe(9.99);
    expect(result.itemSubtotal).toBeCloseTo(99.9);
    expect(result.hatCapAddon).toBe(20);
    expect(result.estimatedLow).toBeCloseTo(187.4);
    expect(result.estimatedHigh).toBeCloseTo(187.4);
  });

  it('adds hat/cap addon', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'stocking-cap', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.hatCapAddon).toBe(20);
    expect(result.estimatedLow).toBeCloseTo(171.4);
  });

  it('includes digitizing when yes', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'yes' });
    expect(result.digitizingLow).toBe(30);
    expect(result.digitizingHigh).toBe(75);
    expect(result.estimatedLow).toBeCloseTo(217.4);
    expect(result.estimatedHigh).toBeCloseTo(262.4);
  });

  it('returns range estimate for "unsure" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'unsure', digitizingNeeded: 'no' });
    expect(result.isRange).toBe(true);
    expect(result.pricePerItemLow).toBeDefined();
    expect(result.pricePerItemHigh).toBeDefined();
    expect(result.itemSubtotal).toBeCloseTo(99.9);
    expect(result.estimatedLow).toBeCloseTo(187.4);
    expect(result.estimatedHigh).toBeCloseTo(226.4);
  });

  it('returns incomplete for invalid quantity', () => {
    const result = calculateEstimate({ quantity: 0, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.incomplete).toBe(true);
  });
});
