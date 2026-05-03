import { designComplexityOptions } from "../data/designComplexity";

export function getStitchRange(complexityValue) {
  const option = designComplexityOptions.find(o => o.value === complexityValue);
  return option ? option.stitchRange : null;
}

export function getStitchDescription(complexityValue) {
  const option = designComplexityOptions.find(o => o.value === complexityValue);
  return option ? option.stitchDescription : "";
}
