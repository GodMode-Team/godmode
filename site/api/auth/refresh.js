import crypto from 'node:crypto';
import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';
import { signToken } from '../_lib/jwt.js';

const REFRESH_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'method_not_allowed' });
  }

  try {
    const { refresh_token } = req.body || {};

    if (!refresh_token) {
      res.statusCode = 400;
      return res.json({ error: 'invalid_request', message: 'refresh_token is required' });
    }

    const redis = getRedis();
    const tokenHash = crypto.createHash('sha256').update(refresh_token).digest('hex');
    const raw = await redis.get(`refresh:${tokenHash}`);

    if (!raw) {
      res.statusCode = 401;
      return res.json({ error: 'invalid_refresh_token' });
    }

    const refreshData = JSON.parse(raw);

    if (refreshData.expiresAt < Date.now()) {
      await redis.del(`refresh:${tokenHash}`);
      res.statusCode = 401;
      return res.json({ error: 'invalid_refresh_token' });
    }

    const userId = refreshData.userId;
    const userRaw = await redis.get(`user:${userId}`);

    if (!userRaw) {
      await redis.del(`refresh:${tokenHash}`);
      res.statusCode = 401;
      return res.json({ error: 'invalid_refresh_token', message: 'User not found' });
    }

    const user = JSON.parse(userRaw);

    // Sign new access token
    const accessToken = signToken({
      sub: userId,
      email: user.email,
      plan: user.subscription?.plan || 'none',
    });

    // Rotate refresh token: delete old, create new
    const newRefreshToken = 'rt_' + crypto.randomBytes(32).toString('hex');
    const newRefreshHash = crypto.createHash('sha256').update(newRefreshToken).digest('hex');
    const now = Date.now();

    await Promise.all([
      redis.del(`refresh:${tokenHash}`),
      redis.set(
        `refresh:${newRefreshHash}`,
        JSON.stringify({
          userId,
          expiresAt: now + REFRESH_TTL * 1000,
          createdAt: now,
        }),
        'EX',
        REFRESH_TTL,
      ),
    ]);

    res.statusCode = 200;
    return res.json({
      access_token: accessToken,
      refresh_token: newRefreshToken,
      expires_in: 86400,
    });
  } catch (err) {
    console.error('refresh error:', err);
    res.statusCode = 500;
    return res.json({ error: 'server_error', message: 'Internal server error' });
  }
}
