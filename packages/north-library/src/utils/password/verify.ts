import bcrypt from "bcryptjs";

/**
 * Verifies if a plaintext password matches a hashed password.
 * @param password - The plaintext password to verify.
 * @param hashedPassword - The hashed password stored in the database.
 * @returns A boolean indicating whether the password is valid.
 */
export async function verifyPassword(
	password: string | null,
	hashedPassword: string
): Promise<boolean> {
	if (!password) {
		return false;
	}
	try {
		const isValid = await bcrypt.compare(password, hashedPassword);
		return isValid;
	} catch (error) {
		console.error("Error verifying password:", error);
		throw new Error("Could not verify the password.");
	}
}
