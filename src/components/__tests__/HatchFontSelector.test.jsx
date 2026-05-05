import { afterEach, describe, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import HatchFontSelector from '../HatchFontSelector';

afterEach(() => cleanup());

describe('HatchFontSelector', () => {
  it('keeps the full font picker collapsed until requested', () => {
    render(<HatchFontSelector selectedFont={null} onSelectFont={vi.fn()} />);

    expect(screen.getByTestId('selected-font-summary').textContent).toContain('No Hatch font selected');
    expect(screen.queryByLabelText(/Search Hatch Fonts/i)).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: /Choose Font/i }));

    expect(screen.getByLabelText(/Search Hatch Fonts/i)).toBeTruthy();
  });

  it('filters fonts by search text', () => {
    render(<HatchFontSelector selectedFont={null} onSelectFont={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Choose Font/i }));
    fireEvent.change(screen.getByLabelText(/Search Hatch Fonts/i), {
      target: { value: 'Script3' },
    });

    expect(screen.getByRole('radio', { name: /Script3/ })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: /Angle Block/ })).toBeNull();
  });

  it('filters fonts by category', () => {
    render(<HatchFontSelector selectedFont={null} onSelectFont={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /Choose Font/i }));
    fireEvent.change(screen.getByLabelText(/Font Style/i), {
      target: { value: 'Script fonts' },
    });

    expect(screen.getByRole('radio', { name: /Script1/ })).toBeTruthy();
    expect(screen.queryByRole('radio', { name: /Angle Block/ })).toBeNull();
  });

  it('calls onSelectFont when a font is chosen', () => {
    const onSelectFont = vi.fn();
    render(<HatchFontSelector selectedFont={null} onSelectFont={onSelectFont} />);

    fireEvent.click(screen.getByRole('button', { name: /Choose Font/i }));
    fireEvent.change(screen.getByLabelText(/Search Hatch Fonts/i), {
      target: { value: 'Script3' },
    });
    fireEvent.click(screen.getByRole('radio', { name: /Script3/ }));

    expect(onSelectFont).toHaveBeenCalledWith(expect.objectContaining({
      name: 'Script3',
      category: 'Script fonts',
      joinMethod: 'CJ',
    }));
  });
});
