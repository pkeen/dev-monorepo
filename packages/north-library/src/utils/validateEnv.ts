// make sure the databseURL is set
// make sure JWT_Secret is set

import { z } from "zod";

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	JWT_SECRET: z.string(),
	NODE_ENV: z.string().default("development").optional(),
});

export type Env = z.infer<typeof envSchema>;

export const validateEnv = (env: Env) => {
	const result = envSchema.safeParse(env);
	if (!result.success) {
		console.error(
			"❌ Environment variable validation error, pleasure endure DATABASE_URL and JWT_SECRET are set:",
			result.error.format()
		);
		throw new Error(result.error.errors.join("\n"));
	}
	return result.data;
};
