export function getQuantityTier(quantity) {
  const qty = parseInt(quantity, 10);
  if (isNaN(qty) || qty < 1) return null;
  if (qty === 1) return "1";
  if (qty <= 3) return "2-3";
  if (qty <= 9) return "4-9";
  if (qty <= 24) return "10-24";
  if (qty <= 49) return "25-49";
  if (qty <= 100) return "50-100";
  return "100+";
}
