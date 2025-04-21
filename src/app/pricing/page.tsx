import { Product } from '@polar-sh/sdk/dist/commonjs/models/components/product';
import Link from 'next/link';
import { ProductCard } from '@/components/pricing/product-card';

async function getProducts(): Promise<Product[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/products`, {
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }

    const { products }: { products: Product[] } = await response.json();

    return products;
  } catch (error) {
    console.error('Failed to fetch products:', error);
    return [];
  }
}

// Billing toggle component
function BillingToggle() {
  return (
    <div className="flex items-center justify-center space-x-4">
      <span className="text-sm font-medium text-gray-900">Monthly</span>
      <div 
        className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out"
        role="switch"
        aria-checked="false"
      >
        <span 
          aria-hidden="true" 
          className="translate-x-0 bg-white pointer-events-none inline-block h-5 w-5 transform rounded-full shadow ring-0 transition duration-200 ease-in-out"
        />
      </div>
      <span className="text-sm font-medium text-gray-500">
        Yearly
        <span className="ml-1.5 inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800">
          Save 20%
        </span>
      </span>
    </div>
  );
}

// Main page component
export default async function PricingPage() {
  const products = await getProducts();

  // Prepare products with proper names and descriptions if they don't have them
  const enhancedProducts = products.map((product, index) => {
    const planNames = ['Free', 'Plus', 'Business', 'Enterprise'];
    const planDescriptions = [
      'For individuals getting started',
      'For small teams',
      'For growing businesses',
      'For large organizations'
    ];
    
    // Add name and description if not present
    if (!product.name) {
      product.name = planNames[index % 4];
    }
    
    if (!product.description) {
      product.description = planDescriptions[index % 4];
    }
    
    // We won't modify the benefits directly since they require specific Polar SDK types
    // Instead, we'll pass the descriptions to the ProductCard component which will handle them
    
    return product;
  });

  return (
    <div className="bg-white">
      {/* Hero section with gradient background */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pt-16 pb-32">
        <div className="absolute inset-0">
          <div className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-blue-50 to-indigo-50 opacity-50" />
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white" />
        </div>
        
        {/* Navigation */}
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-16">
            <div className="text-xl font-semibold text-gray-900">Your SaaS</div>
            <div className="flex space-x-8">
              <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">Home</Link>
              <Link href="/pricing" className="text-sm text-gray-900 font-medium">Pricing</Link>
              <Link href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">Dashboard</Link>
              <Link href="/account" className="text-sm text-gray-600 hover:text-gray-900 ml-6">My Account →</Link>
            </div>
          </div>

          {/* Pricing header */}
          <div className="relative text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl mb-6">
              Pricing plans for teams of all sizes
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
              Choose the perfect plan for your needs. Always know what you'll pay. No hidden fees.
            </p>
          </div>
        </div>
      </div>

      {/* Pricing section */}
      <div className="relative z-10 -mt-32 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Billing toggle */}
        <div className="mb-12 text-center">
          <BillingToggle />
        </div>

        {products.length === 0 ? (
          <div className="mt-12 flex justify-center">
            <div className="rounded-xl bg-blue-50 p-6 max-w-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-blue-800">No pricing plans available</h3>
                  <div className="mt-2 text-sm text-blue-700">
                    <p>We're currently updating our pricing plans. Please check back later or contact our sales team for more information.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10">
            {enhancedProducts.map((product, index) => (
              <div key={product.id} className="h-full">
                <ProductCard 
                  product={product} 
                  popular={index === 1} 
                />
              </div>
            ))}
          </div>
        )}

        {/* FAQ section */}
        <div className="mt-32 mx-auto max-w-3xl">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">Frequently asked questions</h2>
          <div className="mt-12 space-y-8">
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">How does billing work?</h3>
              <p className="mt-2 text-base text-gray-600">We offer both monthly and annual billing options. You can change your billing cycle at any time from your account settings.</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Can I change my plan later?</h3>
              <p className="mt-2 text-base text-gray-600">Yes, you can upgrade or downgrade your plan at any time. When you upgrade, you'll be prorated for the remainder of your billing cycle.</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">Do you offer a free trial?</h3>
              <p className="mt-2 text-base text-gray-600">Yes, all paid plans include a 14-day free trial. No credit card required.</p>
            </div>
            <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-900">What payment methods do you accept?</h3>
              <p className="mt-2 text-base text-gray-600">We accept all major credit cards, PayPal, and bank transfers for annual plans.</p>
            </div>
          </div>
        </div>

        {/* CTA section */}
        <div className="mt-24 mb-16 bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 sm:px-12 sm:py-16 lg:flex lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Ready to get started?
              </h2>
              <p className="mt-3 text-lg text-blue-100">
                Start your free 14-day trial today. No credit card required.  
              </p>
            </div>
            <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow">
                <Link href="/signup" className="inline-flex items-center justify-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-blue-600 hover:bg-blue-50">
                  Get started
                </Link>
              </div>
              <div className="ml-3 inline-flex rounded-md shadow">
                <Link href="/contact" className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-500 px-5 py-3 text-base font-medium text-white hover:bg-blue-700">
                  Contact sales
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
