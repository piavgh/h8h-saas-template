'use client';

import { useEffect, useState } from 'react';
import { formatCurrency, hasActiveSubscription } from '@/lib/polar';
import { useRouter } from 'next/navigation';

// Types matching our schema
type Subscription = {
  id: number;
  status: string;
  current_period_end: string;
  product: {
    name: string;
    price_cents: number;
    interval: string;
  };
};

type Payment = {
  id: number;
  amount_cents: number;
  status: string;
  created_at: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch the user's subscription and payment history
  useEffect(() => {
    // Simulate API call to fetch user subscription
    const fetchUserData = async () => {
      try {
        // Mock data - in a real app you'd fetch this from your API
        const mockSubscription = {
          id: 1,
          status: 'active',
          current_period_end: new Date(
            Date.now() + 30 * 24 * 60 * 60 * 1000
          ).toISOString(), // 30 days from now
          product: {
            name: 'Pro Plan',
            price_cents: 2999,
            interval: 'monthly',
          },
        };

        const mockPayments = [
          {
            id: 1,
            amount_cents: 2999,
            status: 'succeeded',
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            amount_cents: 2999,
            status: 'succeeded',
            created_at: new Date(
              Date.now() - 30 * 24 * 60 * 60 * 1000
            ).toISOString(),
          },
        ];

        setSubscription(mockSubscription);
        setPayments(mockPayments);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleManageSubscription = () => {
    // Redirect to the customer portal
    window.location.href = '/api/portal';
  };

  const handleUpgradeSubscription = () => {
    router.push('/pricing');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg">Loading your subscription data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">Your Subscription</h1>

      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        {subscription ? (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Current Plan: {subscription.product.name}
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>
                {formatCurrency(subscription.product.price_cents)}/
                {subscription.product.interval}
              </p>
              <p className="mt-1">
                Status:{' '}
                <span
                  className={`font-medium ${
                    hasActiveSubscription(subscription.status)
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {subscription.status.charAt(0).toUpperCase() +
                    subscription.status.slice(1)}
                </span>
              </p>
              {hasActiveSubscription(subscription.status) && (
                <p className="mt-1">
                  Your subscription renews on{' '}
                  {new Date(
                    subscription.current_period_end
                  ).toLocaleDateString()}
                </p>
              )}
            </div>
            <div className="mt-5">
              <button
                onClick={handleManageSubscription}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Manage subscription
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              No active subscription
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>You don't have an active subscription yet.</p>
            </div>
            <div className="mt-5">
              <button
                onClick={handleUpgradeSubscription}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View pricing plans
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Payment history */}
      {payments.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold text-gray-900">
            Payment History
          </h2>
          <div className="mt-4 flex flex-col">
            <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Date
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Amount
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                        >
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {payments.map((payment) => (
                        <tr key={payment.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(
                              payment.created_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(payment.amount_cents)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                payment.status === 'succeeded'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {payment.status.charAt(0).toUpperCase() +
                                payment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
