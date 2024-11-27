// import crypto from "crypto";
import { randomBytes } from "crypto";

/**
 * Generates a secure random CSRF token.
 * @returns {string} A random token as a hexadecimal string.
 */
export function generate(): string {
	return randomBytes(32).toString("hex");
}
