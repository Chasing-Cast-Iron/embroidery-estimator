import { useState } from 'react';
import { itemOptions } from '../data/itemOptions';

export default function ItemTypeImage({ itemType }) {
  const [failed, setFailed] = useState(false);

  const option = itemOptions.find(o => o.value === itemType);

  if (!option || !option.referenceImage || failed) return null;

  return (
    <div className="item-type-image">
      <img
        src={option.referenceImage}
        alt={option.referenceImageAlt}
        className="item-type-image__img"
        onError={() => setFailed(true)}
      />
    </div>
  );
}
