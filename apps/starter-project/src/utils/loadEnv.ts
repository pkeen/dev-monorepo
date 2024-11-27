import { config } from "dotenv";

// DOTENV DOES NOT WORK IN EDGE RUNTIMES SO THIS IS ONLY ADDED TO SCRIPTS
export async function loadEnv() {
	if (!process.env.NODE_ENV) {
		console.error("❌ No NODE_ENV set");
		process.exit(1);
	}
	const envFile = `.env.${process.env.NODE_ENV || "development"}`;
	config({ path: envFile });

	console.log(`🔑 Loaded environment variables from ${envFile}`);
	console.log("JWT_SECRET", process.env.JWT_SECRET);
}
