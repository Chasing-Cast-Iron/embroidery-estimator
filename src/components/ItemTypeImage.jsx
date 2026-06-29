import { useEffect, useState } from 'react';
import { itemOptions } from '../data/itemOptions';

export default function ItemTypeImage({ itemType }) {
  const option = itemOptions.find(o => o.value === itemType);
  const referenceImage = option?.referenceImage;

  if (!option || !referenceImage) return null;

  const alt = option.referenceImageAlt || option.label || 'Selected item reference image';

  return <ItemTypeImagePreview key={referenceImage} src={referenceImage} alt={alt} />;
}

function ItemTypeImagePreview({ src, alt }) {
  const [failed, setFailed] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return undefined;

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        setExpanded(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [expanded]);

  if (failed) return null;

  return (
    <div className="item-type-image">
      <button
        type="button"
        className="item-type-image__button"
        aria-label={`Expand ${alt}`}
        onClick={() => setExpanded(true)}
      >
        <img
          src={src}
          alt={alt}
          className="item-type-image__img"
          onError={() => setFailed(true)}
        />
      </button>
      {expanded ? (
        <div
          className="item-type-image-modal"
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          onClick={() => setExpanded(false)}
        >
          <div className="item-type-image-modal__content" onClick={event => event.stopPropagation()}>
            <button
              type="button"
              className="item-type-image-modal__close"
              aria-label="Close expanded image"
              onClick={() => setExpanded(false)}
            >
              X
            </button>
            <img src={src} alt={alt} className="item-type-image-modal__img" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
