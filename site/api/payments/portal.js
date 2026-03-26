import Stripe from 'stripe';
import { verifyToken } from '../_lib/jwt.js';
import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * POST /api/payments/portal
 *
 * Creates a Stripe Billing Portal session so the user can manage their
 * subscription (upgrade, downgrade, cancel, update payment method).
 *
 * Headers:  Authorization: Bearer {jwt}
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

    if (!user.stripeCustomerId) {
      res.statusCode = 400;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'no_subscription' }));
      return;
    }

    // ── Create Billing Portal session ─────────────────────────────
    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: 'https://lifeongodmode.com/account',
    });

    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ url: session.url }));
  } catch (err) {
    console.error('[payments/portal] Error:', err);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ error: 'internal_error' }));
  }
}
