/**
 * Sri Lankan Rupee (LKR) currency formatting utility
 * Formats numbers into standard Sri Lankan Rupee format, e.g. "Rs. 5,000"
 */

export const CURRENCY_CODE = 'LKR';
export const CURRENCY_SYMBOL = 'Rs.';

export function formatLKR(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'Rs. 0';
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount);
  return `Rs. ${Math.round(numeric).toLocaleString('en-LK')}`;
}

export function formatLKRWithDecimals(amount: number | string | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return 'Rs. 0.00';
  }
  const numeric = typeof amount === 'number' ? amount : parseFloat(amount);
  return `Rs. ${numeric.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}
