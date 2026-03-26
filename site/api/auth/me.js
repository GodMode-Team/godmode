import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';
import { verifyToken } from '../_lib/jwt.js';

/** Convert Stripe Unix-seconds timestamp to JS milliseconds if needed. */
function toMillis(ts) {
  if (!ts) return null;
  // If the timestamp looks like seconds (before year 2100 in seconds = ~4102444800)
  return ts < 1e12 ? ts * 1000 : ts;
}

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'GET') {
    res.statusCode = 405;
    return res.json({ error: 'method_not_allowed' });
  }

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.statusCode = 401;
      return res.json({ error: 'unauthorized', message: 'Missing or invalid Authorization header' });
    }

    const token = authHeader.slice(7);
    const payload = verifyToken(token);

    if (!payload) {
      res.statusCode = 401;
      return res.json({ error: 'unauthorized', message: 'Invalid or expired token' });
    }

    const redis = getRedis();
    const userRaw = await redis.get(`user:${payload.sub}`);

    if (!userRaw) {
      res.statusCode = 401;
      return res.json({ error: 'unauthorized', message: 'User not found' });
    }

    const user = JSON.parse(userRaw);

    res.statusCode = 200;
    return res.json({
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.createdAt || null,
      subscription: user.subscription
        ? {
            status: user.subscription.status,
            plan: user.subscription.plan,
            current_period_end: toMillis(user.subscription.currentPeriodEnd || user.subscription.current_period_end),
          }
        : null,
    });
  } catch (err) {
    console.error('me error:', err);
    res.statusCode = 500;
    return res.json({ error: 'server_error', message: 'Internal server error' });
  }
}
