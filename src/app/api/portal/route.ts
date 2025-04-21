import { CustomerPortal } from '@polar-sh/nextjs';
import { NextRequest } from 'next/server';

// Create a customer portal handler
export const GET = CustomerPortal({
  accessToken: process.env.POLAR_ACCESS_TOKEN!,
  // Function to resolve the Polar Customer ID from the request
  getCustomerId: async (req: NextRequest) => {
    // In a real app, you would get the user ID from the session/auth
    // and then lookup their Polar customer ID
    const userId = req.headers.get('x-user-id');
    
    if (!userId) {
      throw new Error('User not authenticated');
    }
    
    // Return the Polar customer ID (in a real app, you'd fetch this from your DB)
    // For now we're assuming the user ID is the same as the Polar customer ID
    return userId;
  },
  server: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox',
});
