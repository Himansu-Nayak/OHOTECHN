import { CartItem } from '@/api/types';

/**
 * Authoritative frontend helper for cart item unit price.
 * The selected ProductPlan is the primary source of truth.
 *
 * @param item CartItem
 * @returns number Unit price in INR
 * @throws Error if no valid price can be derived
 */
export function getCartItemUnitPrice(item: CartItem): number {
  if (item.productPlan && typeof item.productPlan.price === 'number' && !isNaN(item.productPlan.price)) {
    return item.productPlan.price;
  }
  if (typeof item.price === 'number' && !isNaN(item.price) && item.price > 0) {
    return item.price;
  }
  if (item.product && typeof item.product.price === 'number' && !isNaN(item.product.price)) {
    return item.product.price;
  }
  throw new Error(`Invalid or missing price for item: ${item.product?.name || item.id}`);
}

/**
 * Safe unit price retriever that will not throw, useful for robust UI rendering.
 */
export function getSafeCartItemUnitPrice(item: CartItem): number {
  try {
    return getCartItemUnitPrice(item);
  } catch {
    return 0;
  }
}

/**
 * Standard Indian Rupee currency formatter.
 */
export function formatInr(amount: number): string {
  const safeAmount = typeof amount === 'number' && !isNaN(amount) ? amount : 0;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safeAmount);
}
