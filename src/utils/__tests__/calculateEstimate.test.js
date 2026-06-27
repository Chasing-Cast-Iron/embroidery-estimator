import { describe, it, expect } from 'vitest';
import { calculateEstimate } from '../calculateEstimate';

describe('calculateEstimate', () => {
  it('returns manualQuoteRequired for "manual" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'manual', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(true);
  });

  it('uses the 100+ quantity tier for large quantities', () => {
    const result = calculateEstimate({ quantity: 400, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(false);
    expect(result.quantityTier).toBe('100+');
    expect(result.pricePerItem).toBe(6.5);
  });

  it('calculates single stitch range estimate', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.manualQuoteRequired).toBe(false);
    expect(result.isRange).toBe(false);
    expect(result.pricePerItem).toBe(10.25);
    expect(result.embroiderySubtotal).toBe(102.5);
    expect(result.itemBasePrice).toBe(9.99);
    expect(result.itemSubtotal).toBeCloseTo(99.9);
    expect(result.hatCapAddon).toBe(20);
    expect(result.estimatedLow).toBeCloseTo(222.4);
    expect(result.estimatedHigh).toBeCloseTo(222.4);
  });

  it('adds hat/cap addon', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'stocking-cap', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.hatCapAddon).toBe(20);
    expect(result.estimatedLow).toBeCloseTo(206.4);
  });

  it('does not add hat/cap addon for tote items', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'light-canvas-tote', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.hatCapAddon).toBe(0);
    expect(result.itemBasePrice).toBe(5);
    expect(result.estimatedLow).toBeCloseTo(152.5);
  });

  it('supports an other item type with no included base item price', () => {
    const result = calculateEstimate({ quantity: 10, itemType: 'other-item-not-included', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.hatCapAddon).toBe(0);
    expect(result.itemBasePrice).toBe(0);
    expect(result.itemSubtotal).toBe(0);
    expect(result.estimatedLow).toBeCloseTo(102.5);
  });

  it('includes digitizing when yes', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'yes' });
    expect(result.digitizingLow).toBe(30);
    expect(result.digitizingHigh).toBe(75);
    expect(result.estimatedLow).toBeCloseTo(252.4);
    expect(result.estimatedHigh).toBeCloseTo(297.4);
  });

  it('returns range estimate for "unsure" complexity', () => {
    const result = calculateEstimate({ quantity: 10, itemType: '5374-perf-water-rep', designComplexity: 'unsure', digitizingNeeded: 'no' });
    expect(result.isRange).toBe(true);
    expect(result.pricePerItemLow).toBeDefined();
    expect(result.pricePerItemHigh).toBeDefined();
    expect(result.itemSubtotal).toBeCloseTo(99.9);
    expect(result.stitchRange).toBe('1–24,000 stitches (estimated)');
    expect(result.estimatedLow).toBeCloseTo(222.4);
    expect(result.estimatedHigh).toBeCloseTo(277.4);
  });

  it('returns incomplete for invalid quantity', () => {
    const result = calculateEstimate({ quantity: 0, itemType: '5374-perf-water-rep', designComplexity: 'simple', digitizingNeeded: 'no' });
    expect(result.incomplete).toBe(true);
  });
});
