import { NextRequest, NextResponse } from 'next/server';
import { api } from '@/lib/polar';

/**
 * Handle checkout requests
 * This API route creates a checkout session with Polar and returns the checkout URL
 */
export async function GET(request: NextRequest) {
  try {
    // Get the product ID from the query parameters
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json({ error: 'Missing product ID in query params' }, { status: 400 });
    }

    // Create a checkout session
    const checkoutSession = await api.checkouts.create({
      successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
      products: [productId],
    });

    // Return the checkout URL
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}
