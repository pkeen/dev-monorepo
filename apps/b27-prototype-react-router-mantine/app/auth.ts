import { Auth, type RRAuthConfig } from "@pete_keen/react-router-auth";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import {
	Google,
	Zoom,
	Microsoft,
	Facebook,
	LinkedIn,
} from "@pete_keen/authentication-core/providers";
import db from "./lib/db";

const databaseAdapter = DrizzleAdapter(db);

const jwtOptions = {
	access: {
		name: "access",
		secretKey:
			process.env.JWT_ACCESS_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "30 minutes",
		fields: ["id", "email"],
	},
	refresh: {
		name: "refresh",
		secretKey:
			process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || "",
		algorithm: "HS256",
		expiresIn: "7 days",
		fields: ["id"],
	},
};

export const { authLoader, authAction, requireAuth, withAuth } = Auth({
	strategy: "jwt",
	jwtConfig: jwtOptions,
	adapter: databaseAdapter,
	providers: [
		new Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/google",
		}),
		new Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/facebook",
		}),
		new Zoom({
			clientId: process.env.ZOOM_CLIENT_ID!,
			clientSecret: process.env.ZOOM_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/zoom",
		}),
		new Microsoft({
			clientId: process.env.MICROSOFT_CLIENT_ID!,
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/microsoft",
		}),
		new LinkedIn({
			clientId: process.env.LINKEDIN_CLIENT_ID!,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/linkedin",
		}),
	],
	loggerOptions: {
		level: "debug",
		prefix: "RRAuth",
	},
	redirectAfterLogin: "/",
	redirectAfterLogout: "/",
	sessionSecret: process.env.SESSION_SECRET!,
});
