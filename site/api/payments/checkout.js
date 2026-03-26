import Stripe from 'stripe';
import { verifyToken } from '../_lib/jwt.js';
import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/checkout
 *
 * Creates a Stripe Checkout Session for a GodMode subscription.
 *
 * Headers:  Authorization: Bearer {jwt}
 * Body:     { seats?: number }  (defaults to 1)
 * Returns:  { url: string }
 */
export default async function handler(req, res) {
  // CORS preflight
  if (cors(req, res)) return;

  // Method check
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'method_not_allowed' }));
    return;
  }

  try {
    // ── Authenticate ──────────────────────────────────────────────
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'missing_token' }));
      return;
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);
    if (!payload || !payload.sub) {
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'invalid_token' }));
      return;
    }

    const userId = payload.sub;

    // ── Parse body ────────────────────────────────────────────────
    const body = typeof req.body === 'object' && req.body !== null
      ? req.body
      : JSON.parse(typeof req.body === 'string' ? req.body : '{}');

    const seats = Math.max(1, Math.floor(Number(body.seats) || 1));

    // ── Load user from Redis ──────────────────────────────────────
    const redis = getRedis();
    const raw = await redis.get(`user:${userId}`);
    if (!raw) {
      res.statusCode = 404;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'user_not_found' }));
      return;
    }

    const user = JSON.parse(raw);

    // ── Ensure Stripe customer exists ─────────────────────────────
    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId },
      });
      stripeCustomerId = customer.id;

      // Persist customer ID back to user record
      user.stripeCustomerId = stripeCustomerId;
      await redis.set(`user:${userId}`, JSON.stringify(user));

      // Store reverse lookup: stripe customer -> userId
      await redis.set(`stripe:${stripeCustomerId}`, userId);
    }

    // ── Create Checkout Session ───────────────────────────────────
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: stripeCustomerId,
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: seats,
        },
      ],
      metadata: { userId },
      success_url: 'https://lifeongodmode.com/account?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'https://lifeongodmode.com/pricing',
      allow_promotion_codes: true,
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ url: session.url }));
  } catch (err) {
    console.error('[payments/checkout] Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal_error' }));
  }
}
