import crypto from 'node:crypto';
import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';
import { signToken } from '../_lib/jwt.js';
import { hashPassword } from '../_lib/password.js';

const REFRESH_TTL = 30 * 24 * 60 * 60; // 30 days in seconds

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'method_not_allowed' });
  }

  try {
    const { email, password, name, user_code } = req.body || {};

    if (!email || !password) {
      res.statusCode = 400;
      return res.json({ error: 'invalid_request', message: 'email and password are required' });
    }

    const redis = getRedis();

    // Check if email already registered
    const existingUserId = await redis.get(`user:email:${email}`);
    if (existingUserId) {
      res.statusCode = 409;
      return res.json({ error: 'conflict', message: 'Email already registered' });
    }

    // Generate user ID
    const userId = 'usr_' + crypto.randomBytes(8).toString('hex'); // usr_ + 16 hex chars

    // Hash password
    const passwordHash = await hashPassword(password);

    const now = Date.now();
    const userData = {
      id: userId,
      email,
      name: name || null,
      passwordHash,
      subscription: null,
      createdAt: now,
    };

    // Store user and email index atomically
    await Promise.all([
      redis.set(`user:${userId}`, JSON.stringify(userData)),
      redis.set(`user:email:${email}`, userId),
    ]);

    // If user_code provided, authorize the device code
    if (user_code) {
      const deviceCode = await redis.get(`usercode:${user_code}`);
      if (deviceCode) {
        const deviceRaw = await redis.get(`device:${deviceCode}`);
        if (deviceRaw) {
          const deviceData = JSON.parse(deviceRaw);
          if (deviceData.status === 'pending' && deviceData.expiresAt > Date.now()) {
            deviceData.status = 'authorized';
            deviceData.userId = userId;
            const remainingTTL = Math.ceil((deviceData.expiresAt - Date.now()) / 1000);
            await redis.set(`device:${deviceCode}`, JSON.stringify(deviceData), 'EX', remainingTTL);
          }
        }
      }
    }

    // Sign JWT
    const accessToken = signToken({
      sub: userId,
      email,
      plan: 'none',
    });

    // Generate refresh token
    const refreshToken = 'rt_' + crypto.randomBytes(32).toString('hex');
    const refreshHash = crypto.createHash('sha256').update(refreshToken).digest('hex');

    await redis.set(
      `refresh:${refreshHash}`,
      JSON.stringify({
        userId,
        expiresAt: now + REFRESH_TTL * 1000,
        createdAt: now,
      }),
      'EX',
      REFRESH_TTL,
    );

    res.statusCode = 201;
    return res.json({
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: 'bearer',
      expires_in: 86400,
      user: {
        id: userId,
        email,
        name: name || null,
      },
    });
  } catch (err) {
    console.error('register error:', err);
    res.statusCode = 500;
    return res.json({ error: 'server_error', message: 'Internal server error' });
  }
}
