import {
	GitHub,
	Google,
	Zoom,
	Microsoft,
	Facebook,
} from "@pete_keen/authentication-core/providers";
import { createLogger } from "@pete_keen/logger";
import {
	AuthSystem,
	AuthManager,
	createAuthManager,
	type AuthNCallbacks,
	type AuthConfig,
} from "@pete_keen/authentication-core";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import { RolesDrizzlePGAdapter } from "@pete_keen/authentication-core/authorization";
// import { JwtStrategy, JwtStrategyFn } from "@pete_keen/authentication-core";
// import { RBAC } from "@pete_keen/authentication-core/authorization";
import db from "~/db";
import { authz, rbac } from "./authz";

// const logger = createLogger({
// 	level: "debug",
// });

// const roles = [
// 	{
// 		name: "Guest",
// 		level: 0,
// 	},
// 	{
// 		name: "User",
// 		level: 1,
// 	},
// 	{
// 		name: "Editor",
// 		level: 2,
// 	},
// 	{
// 		name: "Admin",
// 		level: 3,
// 	},
// 	{
// 		name: "Super Admin",
// 		level: 4,
// 	},
// ] as const; // marking as const allows Typescript to infer elements as literal types

// export const authz = RBAC(RolesDrizzlePGAdapter(db), {
// 	roles,
// 	defaultRole: {
// 		name: "User",
// 	},
// });

const authConfig: AuthConfig = {
	strategy: "jwt",
	jwtConfig: {
		access: {
			name: "access", // for now the names NEED to be access and refresh
			secretKey: "asfjsdkfj",
			algorithm: "HS256",
			expiresIn: "30 minutes",
			fields: ["id", "email"],
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
		new GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/github",
		}),

		new Zoom({
			clientId: process.env.ZOOM_CLIENT_ID!,
			clientSecret: process.env.ZOOM_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/zoom",
		}),

		new Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/google",
		}),

		new Microsoft({
			clientId: process.env.MICROSOFT_CLIENT_ID!,
			clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/microsoft",
		}),

		new Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
			redirectUri: "http://localhost:5173/auth/redirect/facebook",
		}),
	],
	loggerOptions: {
		level: "debug",
		prefix: "Auth",
	},
	callbacks: {
		enrichUser: async (user) => {
			const roles = await rbac.enrichUser(user.id);
			console.log("ENRICH USER roles: ", roles);
			return { ...user, roles };
		},
		onUserCreated: async (user) => {
			return await rbac.createUserRole(user.id);
		},
	},
};

const authManager = createAuthManager(authConfig);

// const authSystem = new AuthSystem(
// 	JwtStrategyFn(
// 		{
// 			access: {
// 				name: "access", // for now the names NEED to be access and refresh
// 				secretKey: "asfjsdkfj",
// 				algorithm: "HS256",
// 				expiresIn: "30 minutes",
// 				fields: ["id", "email"],
// 			},
// 			refresh: {
// 				name: "refresh",
// 				secretKey: "jldmff",
// 				algorithm: "HS256",
// 				expiresIn: "30 days",
// 				fields: ["id"],
// 			},
// 		}
// 		// RBAC(db, {
// 		// 	name: "User",
// 		// })
// 	),
// 	DrizzleAdapter(db),
// 	RBAC(db, {
// 		roles: [
// 			{
// 				name: "Guest",
// 				level: 0,
// 			},
// 			{
// 				name: "User",
// 				level: 1,
// 			},
// 			{
// 				name: "Editor",
// 				level: 2,
// 			},
// 			{
// 				name: "Admin",
// 				level: 3,
// 			},
// 			{
// 				name: "Super Admin",
// 				level: 4,
// 			},
// 		],
// 		defaultRole: {
// 			name: "User",
// 		},
// 	}),
// 	logger
// );

// authSystem.registerProvider(
// 	"github",
// 	new GitHub({
// 		clientId: process.env.GITHUB_CLIENT_ID!,
// 		clientSecret: process.env.GITHUB_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/github",
// 	})
// );

// authSystem.registerProvider(
// 	"zoom",
// 	new Zoom({
// 		clientId: process.env.ZOOM_CLIENT_ID!,
// 		clientSecret: process.env.ZOOM_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/zoom",
// 	})
// );

// authSystem.registerProvider(
// 	"google",
// 	new Google({
// 		clientId: process.env.GOOGLE_CLIENT_ID!,
// 		clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/google",
// 	})
// );

// authSystem.registerProvider(
// 	"microsoft",
// 	new Microsoft({
// 		clientId: process.env.MICROSOFT_CLIENT_ID!,
// 		clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/microsoft",
// 	})
// );

// authSystem.registerProvider(
// 	"facebook",
// 	new Facebook({
// 		clientId: process.env.FACEBOOK_CLIENT_ID!,
// 		clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
// 		redirectUri: "http://localhost:5173/auth/redirect/facebook",
// 	})
// );
// TODO: improve authSystem.registerProvider method - I dont want the key defined by user
// console.log("Roles:", authSystem.rolesManager.listRoles());

export default authManager;
