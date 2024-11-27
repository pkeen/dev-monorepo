import crypto from "crypto";

/**
 * Generates a secure random CSRF token.
 * @returns {string} A random token as a hexadecimal string.
 */
export function generateCsrf(): string {
	return crypto.randomBytes(32).toString("hex");
}
