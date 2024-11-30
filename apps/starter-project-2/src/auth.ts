// import { initAuth } from "@lib/auth/config";
// import type { AuthConfig } from "@pete_keen/north";
// import { initAuth } from "@pete_keen/north";
// import { initAuth, AuthConfig } from "@pete_keen/fuck-off";
import { initAuth } from "@pete_keen/north";
import { AuthConfig } from "@pete_keen/fuck-off";

import db from "./app/db";

const authConfig: AuthConfig = {
	db: db,
	databaseUrl: process.env.DATABASE_URL as string,
	secretKey: process.env.JWT_SECRET as string,
};

export const { handlers, auth } = await initAuth(authConfig);
