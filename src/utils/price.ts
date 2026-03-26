/**
 * Robustly parses a price string or number into a number.
 * Handles formats like "Rs. 90/-", "₹119", "₹80 / ₹90", etc.
 */
export const parsePrice = (price: string | number | undefined | null): number => {
  if (typeof price === 'number') return price;
  if (!price) return 0;
  
  // Try to extract the first number found in the string
  const match = String(price).match(/\d+(\.\d+)?/);
  if (match) {
    const parsed = parseFloat(match[0]);
    return isNaN(parsed) ? 0 : parsed;
  }
  
  return 0;
};

/**
 * Safely formats a price for display.
 */
export const formatPrice = (price: string | number | undefined | null): string => {
  return parsePrice(price).toFixed(2);
};
