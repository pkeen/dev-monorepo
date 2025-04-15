import {
	Google,
	Zoom,
	Microsoft,
	Facebook,
	LinkedIn,
} from "@pete_keen/authentication-core/providers";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import db from "@/db";
import { authz } from "./authz";
import Thia from "@pete_keen/thia-next";

export const { thia, handlers } = Thia({
	strategy: "jwt",
	jwtConfig: {
		access: {
			name: "access", // for now the names NEED to be access and refresh
			secretKey: "asfjsdkfj",
			algorithm: "HS256",
			expiresIn: "30 minutes",
			fields: ["id", "email"], // TODO: this currently does nothing
		},
		refresh: {
			name: "refresh",
			secretKey: "jldmff",
			algorithm: "HS256",
			expiresIn: "30 days",
			fields: ["id"],
		},
	},
	adapter: DrizzleAdapter(db),
	providers: [
		new Zoom({
			clientId: process.env.ZOOM_CLIENT_ID!,
			clientSecret: process.env.ZOOM_CLIENT_SECRET!,
			redirectUri: process.env.ZOOM_REDIRECT_URI!,
		}),
		new Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: process.env.GOOGLE_REDIRECT_URI!,
		}),
		new Microsoft({
			clientId: process.env.MICROSOFT_CLIENT_ID!,
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
			redirectUri: process.env.MICROSOFT_REDIRECT_URI!,
		}),
		new Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			redirectUri: process.env.FACEBOOK_REDIRECT_URI!,
		}),
		new LinkedIn({
			clientId: process.env.LINKEDIN_CLIENT_ID!,
			clientSecret: process.env.LINKEDIN_CLIENT_SECRET!,
			redirectUri: process.env.LINKEDIN_REDIRECT_URI!,
		}),
	],
	loggerOptions: {
		level: "debug",
		prefix: "Thia",
	},
	callbacks: {
		augmentUserData: authz.getAuthzData,
		onUserCreated: authz.onUserCreated,
		onUserUpdated: authz.onUserDeleted,
		onUserDeleted: authz.onUserDeleted,
	},
	middleware: {
		publicRoutes: [
			{ pattern: "/", match: "exact" },
			{ pattern: "/about", match: "exact" },
			{ pattern: "/api/thia/signin", match: "exact" },
			{ pattern: "/api/thia/signup", match: "exact" },
			{ pattern: "/api/public/*", match: "prefix" },
			{ pattern: "/static/**", match: "wildcard" },
		],
	},
});
