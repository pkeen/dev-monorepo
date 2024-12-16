import { jest, describe, it, expect } from "@jest/globals";
import { DefaultPasswordService } from "./index";

describe("DefaultPasswordService", () => {
	it("should hash and verify a password", async () => {
		const passwordService = DefaultPasswordService();
		const password = "secret";
		const hashedPassword = await passwordService.hash(password);
		const isValid = await passwordService.verify(password, hashedPassword);
		expect(isValid).toBe(true);
	});
});
