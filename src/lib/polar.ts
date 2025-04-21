import { Polar } from '@polar-sh/sdk';

// Create a Polar API client instance
export const api = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});

/**
 * Format a price in cents to a currency string
 * @param cents Price in cents
 * @returns Formatted currency string (e.g. $10.00)
 */
export function formatCurrency(cents: number): string {
  if (!cents) return 'Free';
  
  const dollars = cents / 100;
  return `$${dollars.toFixed(2)}`;
}

/**
 * Format price based on amount type
 * @param price The price object from Polar API
 * @returns Formatted price string
 */
export function formatPrice(price: any): string {
  if (!price) return 'Free';
  
  if (price.amountType === 'fixed') {
    return formatCurrency(price.priceAmount || price.amount_cents);
  } else if (price.amountType === 'free') {
    return 'Free';
  } else {
    return 'Pay what you want';
  }
}

// Helper to determine if a user has an active subscription
export const hasActiveSubscription = (subscriptionStatus?: string): boolean => {
  return subscriptionStatus === 'active' || subscriptionStatus === 'trialing';
};
