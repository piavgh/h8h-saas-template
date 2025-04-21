'use client';

import Link from 'next/link';
import { formatCurrency, formatPrice } from '@/lib/polar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Product } from '@polar-sh/sdk/dist/commonjs/models/components/product';

interface ProductCardProps {
  product: Product;
  popular?: boolean;
}

export function ProductCard({ product, popular = false }: ProductCardProps) {
  // Extract the first price for display
  const firstPrice = product.prices && product.prices.length > 0 ? product.prices[0] : null;
  
  // Get interval from the price
  const interval = firstPrice?.recurringInterval || 
    (firstPrice && 'recurringInterval' in firstPrice ? firstPrice.recurringInterval : '') || '';
  
  // Extract benefits/features
  const benefits = product.benefits?.map(benefit => benefit.description) || [
    'All core features',
    'Unlimited users',
    'Priority support',
  ];

  return (
    <Card className={`flex flex-col ${popular ? 'border-blue-600 shadow-lg' : ''}`}>
      {popular && (
        <div className="absolute -top-4 left-0 right-0 mx-auto w-32 rounded-full bg-blue-600 px-3 py-1 text-center text-sm font-medium text-white">
          Popular
        </div>
      )}
      <CardHeader className={`${popular ? 'pt-8' : ''}`}>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-bold tracking-tight text-gray-900">
            {firstPrice ? formatPrice(firstPrice) : 'Free'}
          </span>
          {interval && (
            <span className="ml-1 text-base font-medium text-gray-500">
              /{interval}
            </span>
          )}
        </div>
        <ul className="mt-6 space-y-3">
          {benefits.map((benefit) => (
            <li key={benefit} className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="ml-3 text-sm text-gray-700">{benefit}</p>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter>
        <Link
          href={`/checkout?productId=${product.id}`}
          className="w-full"
        >
          <Button 
            variant="polar" 
            className="w-full"
          >
            Subscribe to {product.name}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}
