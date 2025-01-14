import {
	JwtConfig,
	// createAuthSystem,
} from "@pete_keen/authentication-core";
import {
	TestAdapter,
	DrizzleAdapter,
} from "@pete_keen/authentication-core/adapters";
import db from "./lib/db/db";
import { RemixAuth, RemixAuthConfig } from "@pete_keen/remix-authentication";

if (!process.env.JWT_ACCESS_SECRET) {
	// throw new Error("JWT_ACCESS_SECRET not found in process.env");
	console.log(
		"process.env.JWT_ACCESS_SECRET:",
		process.env.JWT_ACCESS_SECRET
	);
}

if (!process.env.JWT_REFRESH_SECRET) {
	// throw new Error("JWT_REFRESH_SECRET not found in process.env");
	console.log(
		"process.env.JWT_REFRESH_SECRET:",
		process.env.JWT_REFRESH_SECRET
	);
}

const jwtOptions: JwtConfig = {
	access: {
		key: "access",
		secretKey:
			process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		key: "refresh",
		secretKey:
			process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "7 days",
		fields: ["id"],
	},
};

const databaseAdapter = DrizzleAdapter(db);

const remixAuthConfig: RemixAuthConfig = {
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	logger: {
		level: "debug",
	},
	redirectAfterLogin: "/",
	redirectAfterLogout: "/",
};

export const {
	authSystem,
	login,
	logout,
	signup,
	withValidation,
	authLoader,
	// withCsrf,
	// useAuthState,
	// AuthProvider,
} = RemixAuth(remixAuthConfig);

// export const sessionStateStorage = new NextSessionStateStorage();
