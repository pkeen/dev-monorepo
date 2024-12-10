import { z } from "zod";
// import { config } from "dotenv";

// Load `.env` variables (only for local environments or scripts)
// if (process.env.NODE_ENV !== "production") {
// 	// config();
// 	throw new Error("Please use a .env file instead of this script");
// }

// Define environment variable schema
export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.string().default("development").optional(),
	JWT_SECRET: z.string().default("secret").optional(),
});

// Parse environment variables
const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	// Log error and throw instead of process.exit
	console.error(
		"❌ Environment variable validation error:",
		parsedEnv.error.format()
	);
	throw new Error("Environment variable validation failed");
}

export const env = parsedEnv.data;
