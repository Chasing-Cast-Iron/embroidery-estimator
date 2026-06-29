import { useState } from 'react';
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

  if (failed) return null;

  return (
    <div className="item-type-image">
      <img
        src={src}
        alt={alt}
        className="item-type-image__img"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
