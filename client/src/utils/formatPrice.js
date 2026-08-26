import { CURRENCY } from "./constants";

/**
 * Format price for display
 *
 * Example:
 * formatPrice(1299)
 * → "$1,299.00"
 */

export const formatPrice = (
  price,
  currency = CURRENCY
) => {
  const numericPrice = Number(price);

  if (!Number.isFinite(numericPrice)) {
    return "$0.00";
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numericPrice);
};