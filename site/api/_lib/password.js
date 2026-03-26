import crypto from 'node:crypto';

const SCRYPT_COST = 16384;      // N
const BLOCK_SIZE = 8;           // r
const PARALLELIZATION = 1;      // p
const KEY_LENGTH = 64;
const SALT_LENGTH = 32;

/**
 * Hash a password using scrypt.
 * Returns a string: `salt:derivedKey` (both hex-encoded).
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export function hashPassword(password) {
  return new Promise((resolve, reject) => {
    const salt = crypto.randomBytes(SALT_LENGTH);
    crypto.scrypt(
      password,
      salt,
      KEY_LENGTH,
      { N: SCRYPT_COST, r: BLOCK_SIZE, p: PARALLELIZATION },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(salt.toString('hex') + ':' + derivedKey.toString('hex'));
      },
    );
  });
}

/**
 * Verify a password against a stored hash.
 *
 * @param {string} password  - Plaintext password to check.
 * @param {string} hash      - Stored hash string from hashPassword().
 * @returns {Promise<boolean>}
 */
export function verifyPassword(password, hash) {
  return new Promise((resolve, reject) => {
    const [saltHex, keyHex] = hash.split(':');
    if (!saltHex || !keyHex) return resolve(false);

    const salt = Buffer.from(saltHex, 'hex');
    const storedKey = Buffer.from(keyHex, 'hex');

    crypto.scrypt(
      password,
      salt,
      KEY_LENGTH,
      { N: SCRYPT_COST, r: BLOCK_SIZE, p: PARALLELIZATION },
      (err, derivedKey) => {
        if (err) return reject(err);
        resolve(crypto.timingSafeEqual(storedKey, derivedKey));
      },
    );
  });
}
