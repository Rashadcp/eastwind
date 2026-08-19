import crypto from "crypto";

/**
 * Generates a cryptographically secure random salt.
 */
export function generateSalt(): string {
  return crypto.randomBytes(16).toString("hex");
}

/**
 * Hashes a password using PBKDF2 with SHA-512.
 */
export function hashPassword(password: string, salt: string): string {
  const iterations = 10000;
  const keyLength = 64;
  const digest = "sha512";
  
  return crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, digest)
    .toString("hex");
}

/**
 * Verifies a password against a stored hash and salt.
 */
export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const inputHash = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(inputHash, "hex"));
}
