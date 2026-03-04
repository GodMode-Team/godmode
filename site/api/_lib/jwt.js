import crypto from 'node:crypto';

/**
 * Base64url encode a buffer or string.
 */
function base64url(input) {
  const buf = typeof input === 'string' ? Buffer.from(input) : input;
  return buf.toString('base64url');
}

/**
 * Base64url decode to a Buffer.
 */
function base64urlDecode(str) {
  return Buffer.from(str, 'base64url');
}

/**
 * Sign a JWT with RS256 using the AUTH_JWT_PRIVATE_KEY env var.
 * @param {object} payload - Claims to include in the token.
 * @returns {string} Signed JWT string.
 */
export function signToken(payload) {
  const privateKey = process.env.AUTH_JWT_PRIVATE_KEY;
  if (!privateKey) throw new Error('AUTH_JWT_PRIVATE_KEY is not set');

  const header = { alg: 'RS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);

  const claims = {
    ...payload,
    iat: now,
    exp: now + 86400, // 24 hours
  };

  const segments = [
    base64url(JSON.stringify(header)),
    base64url(JSON.stringify(claims)),
  ];

  const signingInput = segments.join('.');

  const sign = crypto.createSign('RSA-SHA256');
  sign.update(signingInput);
  sign.end();
  const signature = sign.sign(privateKey);

  return signingInput + '.' + base64url(signature);
}

/**
 * Verify a JWT with RS256 using the AUTH_JWT_PUBLIC_KEY env var.
 * @param {string} token - JWT string to verify.
 * @returns {object|null} Decoded payload if valid, null otherwise.
 */
export function verifyToken(token) {
  try {
    const publicKey = process.env.AUTH_JWT_PUBLIC_KEY;
    if (!publicKey) throw new Error('AUTH_JWT_PUBLIC_KEY is not set');

    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [headerB64, payloadB64, signatureB64] = parts;

    const signingInput = headerB64 + '.' + payloadB64;
    const signature = base64urlDecode(signatureB64);

    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(signingInput);
    verify.end();

    if (!verify.verify(publicKey, signature)) return null;

    const payload = JSON.parse(base64urlDecode(payloadB64).toString('utf8'));

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) return null;

    return payload;
  } catch {
    return null;
  }
}
