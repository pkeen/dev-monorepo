import { config } from "dotenv";

config();

export const env = process.env;

// import { z } from "zod";

// Load environment variables dynamically
// const envFile = `.env.${process.env.NODE_ENV || "development"}`;
// config({ path: envFile });

// // Validate environment variables
// const EnvSchema = z.object({
// 	NODE_ENV: z.enum(["development", "production", "test", "green"]),
// 	DATABASE_URL: z.string().url(),
// });

// const parsedEnv = EnvSchema.safeParse(process.env);

// if (!parsedEnv.success) {
// 	console.error(
// 		"❌ Environment variable validation error:",
// 		parsedEnv.error.format()
// 	);
// 	process.exit(1);
// }

// if (process.env.NODE_ENV !== "production") {
// 	logInfo(`Running in environment: ${process.env.NODE_ENV}`);
// 	logBreak();
// }

// export const env = parsedEnv.data;
