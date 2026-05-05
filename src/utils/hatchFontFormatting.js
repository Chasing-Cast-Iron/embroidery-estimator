export function getHatchFontSizeRange(font) {
  if (!font) return '';
  return `${font.minIn}-${font.maxIn} in / ${font.minMm}-${font.maxMm} mm`;
}
