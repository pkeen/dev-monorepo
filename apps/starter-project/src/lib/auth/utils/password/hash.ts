import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

/**
 * Hashes a plaintext password using bcrypt.
 * @param password - The plaintext password to hash.
 * @returns The hashed password string.
 */
export async function hashPassword(password: string): Promise<string> {
	try {
		const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
		return hashedPassword;
	} catch (error) {
		console.error("Error hashing password:", error);
		throw new Error("Could not hash the password.");
	}
}
