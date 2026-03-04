import crypto from 'node:crypto';
import { getRedis } from '../_lib/redis.js';
import { cors } from '../_lib/cors.js';

const DEVICE_CODE_TTL = 900; // 15 minutes

export default async function handler(req, res) {
  if (cors(req, res)) return;

  if (req.method !== 'POST') {
    res.statusCode = 405;
    return res.json({ error: 'method_not_allowed' });
  }

  try {
    const { client_id } = req.body || {};

    if (client_id !== 'godmode-cli') {
      res.statusCode = 400;
      return res.json({ error: 'invalid_client', message: 'Unknown client_id' });
    }

    const deviceCode = crypto.randomBytes(16).toString('hex'); // 32 hex chars
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randomLetters = Array.from(crypto.randomBytes(4))
      .map((b) => letters[b % 26])
      .join('');
    const userCode = `GODM-${randomLetters}`;

    const redis = getRedis();
    const now = Date.now();
    const expiresAt = now + DEVICE_CODE_TTL * 1000;

    const deviceData = JSON.stringify({
      userCode,
      clientId: client_id,
      expiresAt,
      status: 'pending',
    });

    await Promise.all([
      redis.set(`device:${deviceCode}`, deviceData, 'EX', DEVICE_CODE_TTL),
      redis.set(`usercode:${userCode}`, deviceCode, 'EX', DEVICE_CODE_TTL),
    ]);

    res.statusCode = 200;
    return res.json({
      device_code: deviceCode,
      user_code: userCode,
      verification_uri: 'https://lifeongodmode.com/login',
      expires_in: DEVICE_CODE_TTL,
      interval: 5,
    });
  } catch (err) {
    console.error('device code error:', err);
    res.statusCode = 500;
    return res.json({ error: 'server_error', message: 'Internal server error' });
  }
}
