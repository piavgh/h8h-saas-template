import { pgTable, serial, varchar, integer, timestamp, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Products available for purchase
export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: varchar('description', { length: 1000 }),
  price_cents: integer('price_cents').notNull(),
  interval: varchar('interval', { length: 50 }).notNull(), // 'monthly', 'yearly', 'one_time'
  polar_price_id: varchar('polar_price_id', { length: 255 }).notNull().unique(),
  active: boolean('active').default(true),
  created_at: timestamp('created_at').defaultNow(),
});

// User subscriptions
export const subscriptions = pgTable('subscriptions', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  product_id: integer('product_id').references(() => products.id),
  status: varchar('status', { length: 50 }).notNull(), // 'active', 'canceled', 'past_due', 'trialing'
  current_period_start: timestamp('current_period_start'),
  current_period_end: timestamp('current_period_end'),
  cancel_at_period_end: boolean('cancel_at_period_end').default(false),
  polar_subscription_id: varchar('polar_subscription_id', { length: 255 }).notNull().unique(),
  polar_customer_id: varchar('polar_customer_id', { length: 255 }).notNull(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Payment records
export const payments = pgTable('payments', {
  id: serial('id').primaryKey(),
  user_id: varchar('user_id', { length: 255 }).notNull(),
  subscription_id: integer('subscription_id').references(() => subscriptions.id),
  amount_cents: integer('amount_cents').notNull(),
  status: varchar('status', { length: 50 }).notNull(), // 'succeeded', 'failed', 'pending', 'refunded'
  polar_payment_id: varchar('polar_payment_id', { length: 255 }).notNull().unique(),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
});

// Define relations
export const productsRelations = relations(products, ({ many }) => ({
  subscriptions: many(subscriptions),
}));

export const subscriptionsRelations = relations(subscriptions, ({ one, many }) => ({
  product: one(products, {
    fields: [subscriptions.product_id],
    references: [products.id],
  }),
  payments: many(payments),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  subscription: one(subscriptions, {
    fields: [payments.subscription_id],
    references: [subscriptions.id],
  }),
}));
