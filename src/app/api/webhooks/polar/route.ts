import { Webhooks } from '@polar-sh/nextjs';
import { db } from '@/lib/db';
import { payments, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const POST = Webhooks({
  webhookSecret: process.env.POLAR_WEBHOOK_SECRET!,
  onPayload: async (payload) => {
    console.log('Received webhook payload:', payload.type);

    try {
      // Handle different webhook events
      switch (payload.type) {
        // Checkout events
        case 'checkout.created':
          console.log('Checkout created:', payload.data.checkout?.id);
          // You could store checkout data in a separate table if needed
          break;

        case 'checkout.updated':
          console.log('Checkout updated:', payload.data.checkout?.id, 'Status:', payload.data.checkout?.status);
          // If checkout succeeded, you might want to notify the user
          if (payload.data.checkout?.status === 'succeeded') {
            // Send email or update UI via websockets if needed
          }
          break;

        // Customer events
        case 'customer.created':
        case 'customer.updated':
          console.log('Customer event:', payload.type, payload.data.customer?.id);
          // You might want to store customer data in your own database
          break;

        // Subscription events
        case 'subscription.created':
        case 'subscription.updated':
        case 'subscription.active':
        case 'subscription.uncanceled':
          if (payload.data.subscription) {
            const sub = payload.data.subscription;
            await db
              .insert(subscriptions)
              .values({
                user_id: sub.customer_id, // Assuming user_id maps to customer_id
                product_id: Number(sub.product_id),
                status: sub.status,
                current_period_start: new Date(sub.current_period_start),
                current_period_end: new Date(sub.current_period_end),
                cancel_at_period_end: sub.cancel_at_period_end,
                polar_subscription_id: sub.id,
                polar_customer_id: sub.customer_id,
              })
              .onConflictDoUpdate({
                target: subscriptions.polar_subscription_id,
                set: {
                  status: sub.status,
                  current_period_start: new Date(sub.current_period_start),
                  current_period_end: new Date(sub.current_period_end),
                  cancel_at_period_end: sub.cancel_at_period_end,
                  updated_at: new Date(),
                },
              });
          }
          break;

        // Order events (instead of payment events)
        case 'order.created':
        case 'order.paid':
          if (payload.data.order) {
            const order = payload.data.order;
            // Find subscription by ID if this is a subscription-related order
            let subscriptionId = null;
            if (order.subscription_id) {
              const subscription = await db
                .select()
                .from(subscriptions)
                .where(eq(subscriptions.polar_subscription_id, order.subscription_id))
                .limit(1);
              
              if (subscription.length > 0) {
                subscriptionId = subscription[0].id;
              }
            }

            // Record the payment
            await db.insert(payments).values({
              user_id: order.customer_id,
              subscription_id: subscriptionId,
              amount_cents: order.amount_subtotal_cents,
              status: order.status,
              polar_payment_id: order.id, // Using order ID as payment ID
            });

            // If this is a subscription renewal, you might want to update the subscription
            if (order.billing_reason === 'subscription_cycle' && order.subscription_id) {
              // Update subscription with new period dates if needed
            }
          }
          break;

        case 'order.refunded':
          if (payload.data.order) {
            const order = payload.data.order;
            // Update the payment record to reflect the refund
            await db
              .update(payments)
              .set({
                status: 'refunded',
                updated_at: new Date(),
              })
              .where(eq(payments.polar_payment_id, order.id));
          }
          break;

        // Subscription cancellation events
        case 'subscription.canceled':
          if (payload.data.subscription) {
            const sub = payload.data.subscription;
            await db
              .update(subscriptions)
              .set({
                status: 'canceled',
                cancel_at_period_end: true,
                updated_at: new Date(),
              })
              .where(eq(subscriptions.polar_subscription_id, sub.id));
            
            // Note: Don't revoke access yet - wait until subscription.revoked
          }
          break;

        case 'subscription.revoked':
          if (payload.data.subscription) {
            const sub = payload.data.subscription;
            await db
              .update(subscriptions)
              .set({
                status: 'revoked',
                updated_at: new Date(),
              })
              .where(eq(subscriptions.polar_subscription_id, sub.id));
            
            // Now access should be fully revoked
          }
          break;

        // Product and benefit events
        case 'product.created':
        case 'product.updated':
        case 'benefit.created':
        case 'benefit.updated':
          console.log('Product/benefit event:', payload.type);
          // You might want to sync your product catalog
          break;

        default:
          console.log('Unhandled event type:', payload.type);
          break;
      }
    } catch (error) {
      console.error('Error processing webhook:', error);
      // Don't throw, as we don't want to trigger retries
    }
  },
});

// Disable body parsing, as Webhooks handler needs the raw body
export const config = {
  api: {
    bodyParser: false,
  },
};
