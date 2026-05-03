import { describe, it, expect } from 'vitest';
import { getQuantityTier } from '../getQuantityTier';

describe('getQuantityTier', () => {
  it('returns null for 0', () => expect(getQuantityTier(0)).toBeNull());
  it('returns null for NaN', () => expect(getQuantityTier('abc')).toBeNull());
  it('returns "1" for 1', () => expect(getQuantityTier(1)).toBe('1'));
  it('returns "2-3" for 2', () => expect(getQuantityTier(2)).toBe('2-3'));
  it('returns "2-3" for 3', () => expect(getQuantityTier(3)).toBe('2-3'));
  it('returns "4-7" for 4', () => expect(getQuantityTier(4)).toBe('4-7'));
  it('returns "4-7" for 7', () => expect(getQuantityTier(7)).toBe('4-7'));
  it('returns "8-15" for 8', () => expect(getQuantityTier(8)).toBe('8-15'));
  it('returns "8-15" for 15', () => expect(getQuantityTier(15)).toBe('8-15'));
  it('returns "16-30" for 16', () => expect(getQuantityTier(16)).toBe('16-30'));
  it('returns "31-75" for 31', () => expect(getQuantityTier(31)).toBe('31-75'));
  it('returns "76-125" for 76', () => expect(getQuantityTier(76)).toBe('76-125'));
  it('returns "126-175" for 126', () => expect(getQuantityTier(126)).toBe('126-175'));
  it('returns "176-350" for 176', () => expect(getQuantityTier(176)).toBe('176-350'));
  it('returns "176-350" for 350', () => expect(getQuantityTier(350)).toBe('176-350'));
  it('returns "351+" for 351', () => expect(getQuantityTier(351)).toBe('351+'));
});
