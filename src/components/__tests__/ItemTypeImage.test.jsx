import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import ItemTypeImage from '../ItemTypeImage';

afterEach(() => cleanup());

describe('ItemTypeImage', () => {
  it('renders an image with correct src and alt for a known item type', () => {
    render(<ItemTypeImage itemType="5374-perf-water-rep" />);
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('alt')).toBe('Water Repellent Perf Hat');
    expect(img.getAttribute('src')).toBe('/item-type-images/water-repellent-perf-hat.webp');
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

  it('opens an expanded image dialog and closes it', () => {
    render(<ItemTypeImage itemType="5374-perf-water-rep" />);

    fireEvent.click(screen.getByRole('button', { name: 'Expand Water Repellent Perf Hat' }));

    const dialog = screen.getByRole('dialog', { name: 'Water Repellent Perf Hat' });
    const expandedImg = within(dialog).getByRole('img', { name: 'Water Repellent Perf Hat' });
    expect(expandedImg.getAttribute('src')).toBe('/item-type-images/water-repellent-perf-hat.webp');

    fireEvent.click(within(dialog).getByRole('button', { name: 'Close expanded image' }));
    expect(screen.queryByRole('dialog', { name: 'Water Repellent Perf Hat' })).toBeNull();
  });

  it('hides a failed image and renders again when the item type changes', () => {
    const { container, rerender } = render(<ItemTypeImage itemType="richardson-112fp" />);

    fireEvent.error(screen.getByRole('img', { name: 'Richardson 112 trucker hat' }));
    expect(container.firstChild).toBeNull();

    rerender(<ItemTypeImage itemType="c819-realtree" />);
    const img = screen.getByRole('img', { name: 'C819 RealTree hat' });
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('/item-type-images/c819-realtree.webp');
  });

  it('renders correct image for each item type that has a reference photo', () => {
    const cases = [
      { itemType: 'dads-hat', alt: 'Dad Hat', src: '/item-type-images/dad-hat.webp' },
      { itemType: 'richardson-112fp', alt: 'Richardson 112 trucker hat', src: '/item-type-images/richardson-112.webp' },
      { itemType: 'c819-realtree', alt: 'C819 RealTree hat', src: '/item-type-images/c819-realtree.webp' },
      { itemType: 'light-canvas-tote', alt: 'Light Canvas Tote', src: '/item-type-images/light-canvas-tote.webp' },
      { itemType: 'heavy-canvas-tote', alt: 'Heavy Canvas Tote', src: '/item-type-images/heavy-canvas-tote.webp' },
      { itemType: 'zippered-tote', alt: 'Zippered Tote', src: '/item-type-images/zippered-tote.webp' },
    ];
    for (const { itemType, alt, src } of cases) {
      const { container, unmount } = render(<ItemTypeImage itemType={itemType} />);
      const img = container.querySelector('img');
      expect(img, `expected image for ${itemType}`).toBeTruthy();
      expect(img.getAttribute('alt')).toBe(alt);
      expect(img.getAttribute('src')).toBe(src);
      unmount();
    }
  });
});
