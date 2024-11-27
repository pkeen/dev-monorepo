import { loadEnv } from "./loadEnv";

import { z } from "zod";

loadEnv(); // Uncomment in live code - only for scripts

// // debug console log all envs
// console.log("DB_URL:", process.env.DATABASE_URL);
// console.log("Auth_URL:", process.env.AUTH_URL);
// console.log("Auth_SECRET:", process.env.AUTH_SECRET);

// // THESE DONT WORK IN EDGE RUNTIMES SO CAUSE AN ERROR
// // Load environment variables dynamically
// Uncomment to work as seed
// const envFile = `.env.${process.env.NODE_ENV || "development"}`;
// config({ path: envFile });

// console.log("DB_URL:", process.env.DATABASE_URL);
// console.log("Auth_URL:", process.env.AUTH_URL);
// console.log("Auth_SECRET:", process.env.AUTH_SECRET);
// // console.log("NODE_ENV:", process.env.NODE_ENV);
// // if (process.env.NODE_ENV === "seeding") {
// // 	loadEnv();
// // }

export const envSchema = z.object({
	DATABASE_URL: z.string().url(),
	NODE_ENV: z.string().default("development").optional(),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error(
		"❌ Environment variable validation error:",
		parsedEnv.error.format()
	);
	process.exit(1);
}

export const env = parsedEnv.data;
