import { NextResponse } from 'next/server';
import { api } from '@/lib/polar';

export async function GET() {
  try {
    // Fetch products from Polar API
    const { result } = await api.products.list({
      isArchived: false, // Only fetch active products
    });

    // Return the products
    return NextResponse.json({ 
      products: result.items 
    });
  } catch (error) {
    console.error('Error fetching products from Polar:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
