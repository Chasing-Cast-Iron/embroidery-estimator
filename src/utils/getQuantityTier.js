export function getQuantityTier(quantity) {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1) return null;
  if (qty === 1) return "1";
  if (qty <= 3) return "2-3";
  if (qty <= 7) return "4-7";
  if (qty <= 15) return "8-15";
  if (qty <= 30) return "16-30";
  if (qty <= 75) return "31-75";
  if (qty <= 125) return "76-125";
  if (qty <= 175) return "126-175";
  if (qty <= 350) return "176-350";
  return "351+";
}
