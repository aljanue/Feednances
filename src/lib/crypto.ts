import crypto from 'crypto';

/**
 * Converts the API Key into an irreversible SHA-256 hash.
 * This is what we will store in the database.
 */
export function hashUserKey(userKey: string): string {
  return crypto
    .createHash('sha256')
    .update(userKey)
    .digest('hex');
}

/**
 * Generates a new user key.
 * Format: ff_<username>:<48 random hex characters>
 */
export function generateUserKey(username: string): string {
  const randomPart = crypto.randomBytes(24).toString('hex');
  return `ff_${username}:${randomPart}`;
}