import Stripe from 'stripe';
import { getRedis } from '../_lib/redis.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Disable Vercel's automatic body parsing — Stripe signature verification
// requires the raw request body.
export const config = {
  api: { bodyParser: false },
};

/**
 * Read the raw body from an incoming request stream.
 * @param {import('http').IncomingMessage} req
 * @returns {Promise<Buffer>}
 */
async function getRawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  return Buffer.concat(chunks);
}

/**
 * Look up the GodMode userId for a Stripe customer via the reverse-lookup key.
 * @param {import('ioredis').Redis} redis
 * @param {string} stripeCustomerId
 * @returns {Promise<string|null>}
 */
async function userIdFromCustomer(redis, stripeCustomerId) {
  return redis.get(`stripe:${stripeCustomerId}`);
}

/**
 * Update subscription fields on a user record in Redis.
 * @param {import('ioredis').Redis} redis
 * @param {string} userId
 * @param {object} fields - Partial subscription fields to merge.
 */
async function updateSubscription(redis, userId, fields) {
  const raw = await redis.get(`user:${userId}`);
  if (!raw) {
    console.warn(`[payments/webhook] user:${userId} not found in Redis`);
    return;
  }
  const user = JSON.parse(raw);
  user.subscription = { ...user.subscription, ...fields };
  await redis.set(`user:${userId}`, JSON.stringify(user));
}

/**
 * POST /api/payments/webhook
 *
 * Stripe webhook receiver. Verifies the webhook signature and handles
 * subscription lifecycle events.
 *
 * No JWT — Stripe calls this endpoint directly.
 */
export default async function handler(req, res) {
  // Only POST
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  try {
    // ── Verify Stripe signature ───────────────────────────────────
    const rawBody = await getRawBody(req);
    const sig = req.headers['stripe-signature'];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      console.error('[payments/webhook] Signature verification failed:', err.message);
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'invalid_signature' }));
      return;
    }

    const redis = getRedis();

    // ── Handle events ─────────────────────────────────────────────
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.userId;
        if (!userId) {
          console.warn('[payments/webhook] checkout.session.completed missing userId metadata');
          break;
        }

        // Retrieve full subscription details from Stripe
        const subscription = await stripe.subscriptions.retrieve(session.subscription);

        await updateSubscription(redis, userId, {
          status: 'active',
          plan: 'godmode',
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: subscription.current_period_end,
        });

        console.log(`[payments/webhook] checkout.session.completed — userId=${userId} sub=${subscription.id}`);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const userId = await userIdFromCustomer(redis, customerId);
        if (!userId) {
          console.warn(`[payments/webhook] subscription.updated — no user for customer ${customerId}`);
          break;
        }

        await updateSubscription(redis, userId, {
          status: subscription.status === 'active' ? 'active' : subscription.status,
          plan: 'godmode',
          stripeSubscriptionId: subscription.id,
          currentPeriodEnd: subscription.current_period_end,
        });

        console.log(`[payments/webhook] subscription.updated — userId=${userId} status=${subscription.status}`);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const customerId = subscription.customer;
        const userId = await userIdFromCustomer(redis, customerId);
        if (!userId) {
          console.warn(`[payments/webhook] subscription.deleted — no user for customer ${customerId}`);
          break;
        }

        await updateSubscription(redis, userId, {
          status: 'cancelled',
        });

        console.log(`[payments/webhook] subscription.deleted — userId=${userId}`);
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        const customerId = invoice.customer;
        const userId = await userIdFromCustomer(redis, customerId);
        if (!userId) {
          console.warn(`[payments/webhook] payment_failed — no user for customer ${customerId}`);
          break;
        }

        await updateSubscription(redis, userId, {
          status: 'past_due',
        });

        console.log(`[payments/webhook] invoice.payment_failed — userId=${userId}`);
        break;
      }

      default:
        // Unhandled event type — acknowledge receipt, do nothing.
        console.log(`[payments/webhook] Unhandled event type: ${event.type}`);
    }

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ received: true }));
  } catch (err) {
    console.error('[payments/webhook] Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal_error' }));
  }
}
