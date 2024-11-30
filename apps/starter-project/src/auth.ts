// import { initAuth } from "@lib/auth/config";
// import type { AuthConfig } from "@pete_keen/north";
import { config } from "./lib/auth";
import db from "./app/db";

const authConfig: config.AuthConfig = {
	db: db,
	databaseUrl: process.env.DATABASE_URL as string,
	secretKey: process.env.JWT_SECRET as string,
};

export const { handlers, auth } = await config.initAuth(authConfig);
