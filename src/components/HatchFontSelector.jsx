import { useMemo, useState } from 'react';
import { hatchFontCategories, hatchFonts } from '../data/hatchFonts';
import { getHatchFontSizeRange } from '../utils/hatchFontFormatting';

export default function HatchFontSelector({ selectedFont, onSelectFont }) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('');

  const filteredFonts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return hatchFonts.filter(font => {
      const matchesCategory = !category || font.category === category;
      const matchesQuery = !normalizedQuery ||
        font.name.toLowerCase().includes(normalizedQuery) ||
        font.category.toLowerCase().includes(normalizedQuery);

      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  const handleSelectFont = (font) => {
    onSelectFont(font);
    setIsPickerOpen(false);
  };

  const handleClearFont = () => {
    onSelectFont(null);
  };

  return (
    <div className="hatch-font-selector">
      <div className="font-selected-summary" data-testid="selected-font-summary">
        <div className="font-selected-summary__text">
          {selectedFont ? (
            <>
              <strong>{selectedFont.name}</strong>
              <span>{selectedFont.category} · {getHatchFontSizeRange(selectedFont)} · Join {selectedFont.joinMethod}</span>
            </>
          ) : (
            <span>No Hatch font selected. Leave this blank for logo/image requests.</span>
          )}
        </div>
        <div className="font-selected-summary__actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            aria-expanded={isPickerOpen}
            aria-controls="hatch-font-picker"
            onClick={() => setIsPickerOpen(open => !open)}
          >
            {isPickerOpen ? 'Hide Fonts' : selectedFont ? 'Change Font' : 'Choose Font'}
          </button>
          {selectedFont && (
            <button type="button" className="link-button" onClick={handleClearFont}>
              Clear font
            </button>
          )}
        </div>
      </div>

      {isPickerOpen && (
        <div id="hatch-font-picker" className="font-picker-panel">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="hatch-font-search">Search Hatch Fonts</label>
              <input
                id="hatch-font-search"
                className="form-control"
                type="search"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by name or style"
              />
            </div>
            <div className="form-group">
              <label htmlFor="hatch-font-category">Font Style</label>
              <select
                id="hatch-font-category"
                className="form-control"
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                <option value="">All styles</option>
                {hatchFontCategories.map(fontCategory => (
                  <option key={fontCategory} value={fontCategory}>{fontCategory}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="font-list" role="radiogroup" aria-label="Hatch Embroidery 3 Digitizer fonts">
            {filteredFonts.map(font => {
              const isSelected = selectedFont?.name === font.name;

              return (
                <label
                  key={font.name}
                  className={`font-option${isSelected ? ' is-selected' : ''}`}
                >
                  <input
                    type="radio"
                    name="hatchFont"
                    value={font.name}
                    checked={isSelected}
                    onChange={() => handleSelectFont(font)}
                  />
                  <span className="font-option__main">
                    <span className="font-option__name">{font.name}</span>
                    <span className="font-option__meta">{font.category}</span>
                  </span>
                  <span className="font-option__details">
                    {getHatchFontSizeRange(font)} · Join {font.joinMethod}
                  </span>
                </label>
              );
            })}
            {!filteredFonts.length && (
              <p className="form-hint font-list-empty">No Hatch fonts match that search.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
