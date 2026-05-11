import { pricingTable } from "../data/pricingTable";
import { itemOptions, HAT_CAP_ADDON_PER_ITEM } from "../data/itemOptions";
import { getQuantityTier } from "./getQuantityTier";
import { getStitchRange } from "./getStitchRange";

const DIGITIZING_LOW = 30;
const DIGITIZING_HIGH = 75;

export function calculateEstimate({ quantity, itemType, designComplexity, digitizingNeeded }) {
  const qty = parseInt(quantity, 10);

  if (designComplexity === "manual") {
    return { manualQuoteRequired: true };
  }

  const quantityTier = getQuantityTier(qty);
  if (quantityTier === "351+") {
    return { manualQuoteRequired: true };
  }
  if (!quantityTier) {
    return { manualQuoteRequired: false, incomplete: true };
  }

  const stitchRange = getStitchRange(designComplexity);
  const isRange = stitchRange === "range";

  const item = itemOptions.find(o => o.value === itemType);
  const itemBasePrice = item?.basePrice ?? 0;
  const itemSubtotal = itemBasePrice * qty;
  const hasHatAddon = item ? item.hasHatAddon : false;
  const hatCapAddon = hasHatAddon ? HAT_CAP_ADDON_PER_ITEM * qty : 0;

  let digitizingLow = 0;
  let digitizingHigh = 0;
  if (digitizingNeeded === "yes") {
    digitizingLow = DIGITIZING_LOW;
    digitizingHigh = DIGITIZING_HIGH;
  } else if (digitizingNeeded === "unsure") {
    digitizingLow = 0;
    digitizingHigh = DIGITIZING_HIGH;
  }

  if (isRange) {
    const allRanges = Object.keys(pricingTable);
    let lowestPrice = Infinity;
    let highestPrice = 0;
    for (const range of allRanges) {
      const price = pricingTable[range][quantityTier];
      if (price !== undefined) {
        if (price < lowestPrice) lowestPrice = price;
        if (price > highestPrice) highestPrice = price;
      }
    }
    const embroiderySubtotalLow = lowestPrice * qty;
    const embroiderySubtotalHigh = highestPrice * qty;
    return {
      manualQuoteRequired: false,
      isRange: true,
      quantityTier,
      stitchRange: "1–18,000 stitches (estimated)",
      pricePerItemLow: lowestPrice,
      pricePerItemHigh: highestPrice,
      embroiderySubtotalLow,
      embroiderySubtotalHigh,
      itemBasePrice,
      itemSubtotal,
      hatCapAddon,
      digitizingLow,
      digitizingHigh,
      estimatedLow: embroiderySubtotalLow + itemSubtotal + hatCapAddon + digitizingLow,
      estimatedHigh: embroiderySubtotalHigh + itemSubtotal + hatCapAddon + digitizingHigh,
      quantity: qty
    };
  }

  const pricePerItem = pricingTable[stitchRange]?.[quantityTier];
  if (pricePerItem === undefined) {
    return { manualQuoteRequired: true };
  }

  const embroiderySubtotal = pricePerItem * qty;
  const estimatedLow = embroiderySubtotal + itemSubtotal + hatCapAddon + digitizingLow;
  const estimatedHigh = embroiderySubtotal + itemSubtotal + hatCapAddon + digitizingHigh;

  return {
    manualQuoteRequired: false,
    isRange: false,
    quantityTier,
    stitchRange,
    pricePerItem,
    embroiderySubtotal,
    itemBasePrice,
    itemSubtotal,
    hatCapAddon,
    digitizingLow,
    digitizingHigh,
    estimatedLow,
    estimatedHigh,
    quantity: qty
  };
}
