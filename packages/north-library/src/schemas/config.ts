import { z } from "zod";

export const AuthConfigSchema = z.object({
	databaseUrl: z.string({ required_error: "DATABASE_URL is required" }), // Required
	secretKey: z.string({ required_error: "SECRET_KEY is required" }), // id needed test with hardcoded
	jwtOptions: z.object({
		access: z.object({
			algorithm: z.string().default("HS256"),
			expiresIn: z.string().default("10 minutes"),
		}),
		refresh: z.object({
			algorithm: z.string().default("HS256"),
			expiresIn: z.string().default("30 days"),
		}),
	}),
	cookies: z.object({
		namePrefix: z.string().default("pk-auth"),
	}),
	roles: z.array(z.string()).default(["admin", "user", "guest"]), // Default roles
});
