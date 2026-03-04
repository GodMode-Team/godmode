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
    const { device_code, grant_type } = req.body || {};

    if (grant_type !== 'urn:ietf:params:oauth:grant-type:device_code') {
      res.statusCode = 400;
      return res.json({ error: 'unsupported_grant_type' });
    }

    if (!device_code) {
      res.statusCode = 400;
      return res.json({ error: 'invalid_request', message: 'device_code is required' });
    }

    const redis = getRedis();
    const raw = await redis.get(`device:${device_code}`);

    if (!raw) {
      res.statusCode = 400;
      return res.json({ error: 'expired_token' });
    }

    const deviceData = JSON.parse(raw);

    if (deviceData.expiresAt < Date.now()) {
      await redis.del(`device:${device_code}`);
      res.statusCode = 400;
      return res.json({ error: 'expired_token' });
    }

    if (deviceData.status === 'pending') {
      res.statusCode = 400;
      return res.json({ error: 'authorization_pending' });
    }

    if (deviceData.status === 'denied') {
      await redis.del(`device:${device_code}`);
      res.statusCode = 400;
      return res.json({ error: 'access_denied' });
    }

    if (deviceData.status === 'authorized') {
      const userId = deviceData.userId;
      const userRaw = await redis.get(`user:${userId}`);

      if (!userRaw) {
        res.statusCode = 400;
        return res.json({ error: 'invalid_request', message: 'User not found' });
      }

      const user = JSON.parse(userRaw);

      const accessToken = signToken({
        sub: userId,
        email: user.email,
        plan: user.subscription?.plan || 'none',
      });

      const refreshToken = 'rt_' + crypto.randomBytes(32).toString('hex'); // rt_ + 64 hex chars
      const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

      const now = Date.now();
      await Promise.all([
        redis.set(
          `refresh:${refreshHash}`,
          JSON.stringify({
            userId,
            expiresAt: now + REFRESH_TTL * 1000,
            createdAt: now,
          }),
          'EX',
          REFRESH_TTL,
        ),
        redis.del(`device:${device_code}`),
        redis.del(`usercode:${deviceData.userCode}`),
      ]);

      res.statusCode = 200;
      return res.json({
        access_token: accessToken,
        refresh_token: refreshToken,
        token_type: 'bearer',
        expires_in: 86400,
      });
    }

    // Unknown status
    res.statusCode = 400;
    return res.json({ error: 'invalid_request' });
  } catch (err) {
    console.error('token exchange error:', err);
    res.statusCode = 500;
    return res.json({ error: 'server_error', message: 'Internal server error' });
  }
}
