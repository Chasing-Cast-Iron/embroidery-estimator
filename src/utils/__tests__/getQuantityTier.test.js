import { describe, it, expect } from 'vitest';
import { getQuantityTier } from '../getQuantityTier';

describe('getQuantityTier', () => {
  it('returns null for 0', () => expect(getQuantityTier(0)).toBeNull());
  it('returns null for NaN', () => expect(getQuantityTier('abc')).toBeNull());
  it('returns "1" for 1', () => expect(getQuantityTier(1)).toBe('1'));
  it('returns "2-3" for 2', () => expect(getQuantityTier(2)).toBe('2-3'));
  it('returns "2-3" for 3', () => expect(getQuantityTier(3)).toBe('2-3'));
  it('returns "4-9" for 4', () => expect(getQuantityTier(4)).toBe('4-9'));
  it('returns "4-9" for 9', () => expect(getQuantityTier(9)).toBe('4-9'));
  it('returns "10-24" for 10', () => expect(getQuantityTier(10)).toBe('10-24'));
  it('returns "10-24" for 24', () => expect(getQuantityTier(24)).toBe('10-24'));
  it('returns "25-49" for 25', () => expect(getQuantityTier(25)).toBe('25-49'));
  it('returns "25-49" for 49', () => expect(getQuantityTier(49)).toBe('25-49'));
  it('returns "50-100" for 50', () => expect(getQuantityTier(50)).toBe('50-100'));
  it('returns "50-100" for 100', () => expect(getQuantityTier(100)).toBe('50-100'));
  it('returns "100+" for 101', () => expect(getQuantityTier(101)).toBe('100+'));
  it('returns "100+" for 350', () => expect(getQuantityTier(350)).toBe('100+'));
  it('returns "100+" for 500', () => expect(getQuantityTier(500)).toBe('100+'));
});
