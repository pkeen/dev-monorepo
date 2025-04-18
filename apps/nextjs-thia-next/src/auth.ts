// import {
// 	GitHub,
// 	Google,
// 	Zoom,
// 	Microsoft,
// 	Facebook,
// } from "@pete_keen/authentication-core/providers";
// import {
// 	createAuthManager,
// 	IAuthManager,
// } from "@pete_keen/authentication-core";
// import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
// import db from "@/db";
// import { authz } from "./authz";

// export const authManager = createAuthManager({
// 	strategy: "jwt",
// 	jwtConfig: {
// 		access: {
// 			name: "access", // for now the names NEED to be access and refresh
// 			secretKey: "asfjsdkfj",
// 			algorithm: "HS256",
// 			expiresIn: "30 minutes",
// 			fields: ["id", "email"], // TODO: this currently does nothing
// 		},
// 		refresh: {
// 			name: "refresh",
// 			secretKey: "jldmff",
// 			algorithm: "HS256",
// 			expiresIn: "30 days",
// 			fields: ["id"],
// 		},
// 	},
// 	adapter: DrizzleAdapter(db),
// 	providers: [
// 		new GitHub({
// 			clientId: process.env.GITHUB_CLIENT_ID!,
// 			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
// 			redirectUri: process.env.GITHUB_REDIRECT_URI!,
// 		}),

// 		new Zoom({
// 			clientId: process.env.ZOOM_CLIENT_ID!,
// 			clientSecret: process.env.ZOOM_CLIENT_SECRET!,
// 			redirectUri: process.env.ZOOM_REDIRECT_URI!,
// 		}),

// 		new Google({
// 			clientId: process.env.GOOGLE_CLIENT_ID!,
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
// 			redirectUri: process.env.GOOGLE_REDIRECT_URI!,
// 		}),

// 		new Microsoft({
// 			clientId: process.env.MICROSOFT_CLIENT_ID!,
// 			clientSecret: process.env.MICROSOFT_CLIENT_SECRET!,
// 			redirectUri: process.env.MICROSOFT_REDIRECT_URI!,
// 		}),

// 		new Facebook({
// 			clientId: process.env.FACEBOOK_CLIENT_ID!,
// 			clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
// 			redirectUri: process.env.FACEBOOK_REDIRECT_URI!,
// 		}),
// 	],
// 	loggerOptions: {
// 		level: "debug",
// 		prefix: "Auth",
// 	},
// 	callbacks: {
// 		augmentUserData: authz.getAuthzData,
// 		onUserCreated: authz.onUserCreated,
// 		onUserUpdated: authz.onUserDeleted,
// 		onUserDeleted: authz.onUserDeleted,
// 	},
// 	// enrichUser: enrich,
// });

// import type { NextApiRequest, NextApiResponse } from "next";
// import type { GetServerSidePropsContext } from "next";
// import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
// // import {
// // 	commitSession,
// // 	getSession,
// // 	SESSION_COOKIE_NAME,
// // 	parseCookieValue,
// // } from "./session";
// import { returnToCookie, thiaSessionCookie } from "@/lib/thia/cookies";
// // import type { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/types";

// // Replace with your enriched user type
// type User = { id: string; email: string };

// // Return type for most auth calls
// type AuthReturn<Extra> = Promise<(User & Extra) | null>;

// // Minimal compatible context for middleware
// type MiddlewareContext = {
// 	params: Record<string, string | string[]>;
// };

// // Middleware-style handler function
// type MiddlewareHandler = (
// 	req: NextRequest,
// 	ctx: MiddlewareContext
// ) => NextResponse | Promise<NextResponse>;

// // Core unified type
// type AuthFunction<Extra> = {
// 	(...args: []): AuthReturn<Extra>; // RSC
// 	(...args: [NextApiRequest, NextApiResponse]): AuthReturn<Extra>; // API Route (Pages Router)
// 	(...args: [GetServerSidePropsContext]): AuthReturn<Extra>; // GSSP (Pages Router)
// 	(...args: [MiddlewareHandler]): MiddlewareHandler; // Middleware wrapper
// 	(...args: [NextRequest, NextFetchEvent]): Promise<NextResponse>;
// };

// function isNextRequest(arg: any): arg is NextRequest {
// 	return (
// 		arg instanceof Request && // web standard base
// 		typeof (arg as NextRequest).cookies?.get === "function"
// 	);
// }

// function isMiddlewareContext(arg: any): arg is MiddlewareContext {
// 	return arg && typeof arg === "object" && "params" in arg;
// }

// function isNextFetchEvent(arg: any): arg is NextFetchEvent {
// 	return typeof arg?.waitUntil === "function";
// }

// function isApiRequest(arg1: any, arg2: any): arg1 is NextApiRequest {
// 	return arg1?.method && typeof arg2?.statusCode === "number";
// }

// function isGSSPContext(arg: any): arg is GetServerSidePropsContext {
// 	return arg?.req && arg?.res;
// }

// /// TODO: need to make this configurable
// // const PUBLIC_ROUTES = ["/", "/about", "/api/thia/signin", "/api/thia/signup"];

// export const PUBLIC_ROUTES = [
// 	{ pattern: "/", match: "exact" },
// 	{ pattern: "/about", match: "exact" },
// 	{ pattern: "/api/thia/signin", match: "exact" },
// 	{ pattern: "/api/thia/signup", match: "exact" },
// 	{ pattern: "/api/public/*", match: "prefix" },
// 	{ pattern: "/static/**", match: "wildcard" },
// ];

// export function isPublicRoute(
// 	path: string,
// 	routes: typeof PUBLIC_ROUTES
// ): boolean {
// 	return routes.some(({ pattern, match }) => {
// 		if (match === "exact") return path === pattern;

// 		if (match === "prefix")
// 			return path.startsWith(pattern.replace(/\*$/, ""));

// 		if (match === "wildcard") {
// 			// turn /api/** into regex ^/api/.*$
// 			const regex = new RegExp(
// 				"^" +
// 					pattern.replace(/\*\*/g, ".*").replace(/\*/g, "[^/]+") +
// 					"$"
// 			);
// 			return regex.test(path);
// 		}

// 		return false;
// 	});
// }

// export function createAuth<Extra>(authSystem: IAuthManager<Extra>) {
// 	// Now authSystem is strongly typed, and Extra is inferred

// 	type EnrichedUser = User & Extra;

// 	async function getUserFromRSC(): Promise<(User & Extra) | null> {
// 		const session = await thiaSessionCookie.get();

// 		if (!session) return null;

// 		const result = await authSystem.validate(session.keyCards);
// 		if (result.type === "error" || result.type === "redirect") return null;

// 		return result.authState.user;
// 	}

// 	async function handleMiddlewareRequest(
// 		req: NextRequest
// 	): Promise<NextResponse> {
// 		const url = req.nextUrl.clone();
// 		const path = url.pathname;
// 		console.log("PATH:", path);

// 		// Allow public routes
// 		if (isPublicRoute(path, PUBLIC_ROUTES)) {
// 			console.log("PUBLIC ROUTE");
// 			return NextResponse.next();
// 		}

// 		const session = await thiaSessionCookie.get();
// 		console.log("THIA SESSION COOKIE:", session);
// 		if (!session) {
// 			console.log("NO SESSION");
// 			// Save the attempted path in a cookie before redirecting
// 			const res = NextResponse.redirect(
// 				new URL("/api/thia/signin", req.url)
// 			);
// 			res.headers.append("Set-Cookie", returnToCookie.set(path));
// 			return res;
// 		}

// 		const result = await authSystem.validate(session.keyCards);
// 		if (result.type === "error" || result.type === "redirect") {
// 			const res = NextResponse.redirect(
// 				new URL("/api/thia/signin", req.url)
// 			);
// 			res.headers.append("Set-Cookie", returnToCookie.set(path));
// 			return res;
// 		}

// 		if (result.type === "refresh") {
// 			const cookieHeader = thiaSessionCookie.set(result.authState);
// 			const res = NextResponse.next();
// 			res.headers.set("Set-Cookie", cookieHeader);
// 			return res;
// 		}

// 		// Valid session
// 		return NextResponse.next();
// 	}

// 	async function getUserFromApiRoute(
// 		req: NextApiRequest,
// 		res: NextApiResponse
// 	): Promise<(User & Extra) | null> {
// 		const session = await thiaSessionCookie.get();

// 		if (!session) return null;

// 		const result = await authSystem.validate(session.keyCards);
// 		if (result.type === "error" || result.type === "redirect") return null;

// 		// (Optional) Refresh cookie here too
// 		if (result.type === "refresh") {
// 			const cookie = thiaSessionCookie.set(result.authState);
// 			res.setHeader("Set-Cookie", cookie);
// 		}

// 		return result.authState.user;
// 	}

// 	async function getUserFromGSSP(
// 		ctx: GetServerSidePropsContext
// 	): Promise<(User & Extra) | null> {
// 		const raw = ctx.req.cookies?.[thiaSessionCookie.name];
// 		const session = raw ? JSON.parse(raw) : null;

// 		if (!session) return null;

// 		const result = await authSystem.validate(session.keyCards);
// 		if (result.type === "error" || result.type === "redirect") return null;

// 		if (result.type === "refresh") {
// 			const cookie = thiaSessionCookie.set(result.authState);
// 			ctx.res.setHeader("Set-Cookie", cookie);
// 		}

// 		return result.authState.user;
// 	}

// 	const auth: AuthFunction<Extra> = ((...args: any[]): any => {
// 		// Server Component usage: auth()
// 		if (args.length === 0) {
// 			return getUserFromRSC();
// 		}

// 		// Middleware usage: auth(req) or auth(req, event)
// 		if (args.length === 1 && isNextRequest(args[0])) {
// 			return handleMiddlewareRequest(args[0]);
// 		}
// 		if (
// 			args.length === 2 &&
// 			isNextRequest(args[0]) &&
// 			isNextFetchEvent(args[1])
// 		) {
// 			return handleMiddlewareRequest(args[0]);
// 		}

// 		// API Route usage: auth(req, res) (Pages)
// 		if (args.length === 2 && isApiRequest(args[0], args[1])) {
// 			return getUserFromApiRoute(args[0], args[1]);
// 		}

// 		// GSSP usage: auth(ctx) (Pages)
// 		if (args.length === 1 && isGSSPContext(args[0])) {
// 			return getUserFromGSSP(args[0]);
// 		}

// 		// Middleware callback usage: auth(handler)
// 		if (typeof args[0] === "function") {
// 			const handler = args[0];
// 			return async (req: NextRequest, ctx: MiddlewareContext) => {
// 				await handleMiddlewareRequest(req); // validate user or refresh
// 				return handler(req, ctx); // pass control
// 			};
// 		}

// 		throw new Error("Invalid usage of auth()");
// 	}) as AuthFunction<Extra>;

// 	return auth;
// }

// export const auth = createAuth(authManager);

// export interface handlers {
// 	GET: (req: NextRequest) => Promise<NextResponse>;
// 	POST: (req: NextRequest) => Promise<NextResponse>;
// }

import {
	GitHub,
	Google,
	Zoom,
	Microsoft,
	Facebook,
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
		new GitHub({
			clientId: process.env.GITHUB_CLIENT_ID!,
			clientSecret: process.env.GITHUB_CLIENT_SECRET!,
			redirectUri: process.env.GITHUB_REDIRECT_URI!,
		}),
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
	],
	loggerOptions: {
		level: "debug",
		prefix: "Auth",
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
	secret: "asfjsdkfj",
	// enrichUser: enrich,
});
