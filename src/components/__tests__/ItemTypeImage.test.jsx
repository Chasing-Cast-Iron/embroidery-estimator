import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import ItemTypeImage from '../ItemTypeImage';

afterEach(() => cleanup());

describe('ItemTypeImage', () => {
  it('renders an image with correct src and alt for a known item type', () => {
    render(<ItemTypeImage itemType="5374-perf-water-rep" />);
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('alt')).toBe('Water Repellent Perf Hat');
    expect(img.getAttribute('src')).toContain('662570bb-cd2e-4220-88ee-d4d6bd6d12d0');
  });

  it('renders nothing when no itemType is provided', () => {
    const { container } = render(<ItemTypeImage itemType="" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an item type with no reference image', () => {
    const { container } = render(<ItemTypeImage itemType="stocking-cap" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing for an unknown item type', () => {
    const { container } = render(<ItemTypeImage itemType="unknown-item" />);
    expect(container.firstChild).toBeNull();
  });

  it('renders correct image for each item type that has a reference photo', () => {
    const cases = [
      { itemType: 'dads-hat', alt: 'Dad Hat' },
      { itemType: 'richardson-112fp', alt: 'Richardson 112 trucker hat' },
      { itemType: 'c819-realtree', alt: 'C819 RealTree hat' },
      { itemType: 'light-canvas-tote', alt: 'Light Canvas Tote' },
      { itemType: 'heavy-canvas-tote', alt: 'Heavy Canvas Tote' },
      { itemType: 'zippered-tote', alt: 'Zippered Tote' },
    ];
    for (const { itemType, alt } of cases) {
      const { container, unmount } = render(<ItemTypeImage itemType={itemType} />);
      const img = container.querySelector('img');
      expect(img, `expected image for ${itemType}`).toBeTruthy();
      expect(img.getAttribute('alt')).toBe(alt);
      unmount();
    }
  });
});
