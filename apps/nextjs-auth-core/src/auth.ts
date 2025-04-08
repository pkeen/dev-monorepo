import {
	GitHub,
	Google,
	Zoom,
	Microsoft,
	Facebook,
} from "@pete_keen/authentication-core/providers";
import {
	createAuthManager,
	IAuthManager,
} from "@pete_keen/authentication-core";
import { DrizzleAdapter } from "@pete_keen/authentication-core/adapters";
import db from "./db";

export const authManager = createAuthManager({
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
			redirectUri: "http://localhost:3000/api/auth/redirect/github",
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
	// callbacks: {
	// 	augmentUserData: authz.getAuthzData,
	// 	onUserCreated: authz.onUserCreated,
	// 	onUserUpdated: authz.onUserDeleted,
	// 	onUserDeleted: authz.onUserDeleted,
	// },
	// enrichUser: enrich,
});

import type { NextApiRequest, NextApiResponse } from "next";
import type { GetServerSidePropsContext } from "next";
import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { commitSession, getSession } from "./session";
// import type { AppRouteHandlerFn } from "next/dist/server/future/route-modules/app-route/types";

// Replace with your enriched user type
type User = { id: string; email: string };

// Return type for most auth calls
type AuthReturn = Promise<User | null>;

// Minimal compatible context for middleware
type MiddlewareContext = {
	params: Record<string, string | string[]>;
};

// Middleware-style handler function
type MiddlewareHandler = (
	req: NextRequest,
	ctx: MiddlewareContext
) => NextResponse | Promise<NextResponse>;

// Core unified type
type AuthFunction = {
	(...args: []): AuthReturn; // RSC
	(...args: [NextApiRequest, NextApiResponse]): AuthReturn; // API Route
	(...args: [GetServerSidePropsContext]): AuthReturn; // GSSP
	(...args: [MiddlewareHandler]): MiddlewareHandler; // Middleware wrapper
	(...args: [NextRequest, MiddlewareContext]): Promise<NextResponse>; // ✅ Needed for real middleware usage
	(...args: [NextRequest, NextFetchEvent]): Promise<NextResponse>;
};

function isNextRequest(arg: any): arg is NextRequest {
	return (
		arg instanceof Request && // web standard base
		typeof (arg as NextRequest).cookies?.get === "function"
	);
}

function isMiddlewareContext(arg: any): arg is MiddlewareContext {
	return arg && typeof arg === "object" && "params" in arg;
}

function isNextFetchEvent(arg: any): arg is NextFetchEvent {
	return typeof arg?.waitUntil === "function";
}

export function createAuth<Extra>(authSystem: IAuthManager<Extra>) {
	// Now authSystem is strongly typed, and Extra is inferred

	type EnrichedUser = User & Extra;

	async function getUserFromRSC(): Promise<(User & Extra) | null> {
		const session = await getSession(); // <-- your helper
		const authState = session?.get("authState");

		if (!authState) return null;

		const result = await authSystem.validate(authState.keyCards);
		if (result.type === "error" || result.type === "redirect") return null;

		return result.authState.user;
	}

	async function handleMiddlewareRequest(
		req: NextRequest
	): Promise<NextResponse> {
		const session = await getSession();
		const sessionState = session?.data.authState;

		if (!sessionState) {
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}

		const result = await authSystem.validate(sessionState.keyCards);

		if (result.type === "error" || result.type === "redirect") {
			return NextResponse.redirect(new URL("/auth/login", req.url));
		}

		if (result.type === "refresh") {
			const cookieHeader = commitSession({ authState: result.authState });
			const res = NextResponse.next();
			res.headers.set("Set-Cookie", cookieHeader);
			return res;
		}

		return NextResponse.next();
	}

	const auth: AuthFunction = ((...args: any[]): any => {
		// console.log("args: ", args);
		if (args.length === 0) {
			// Server Component usage: auth()
			return getUserFromRSC();
		}

		// if (isApiRequest(args[0], args[1])) {
		// 	return getUserFromApiRoute(args[0], args[1]);
		// }

		// if (isGSSPContext(args[0])) {
		// 	return getUserFromGSSP(args[0]);
		// }

		// if (typeof args[0] === "function") {
		// 	// Middleware wrapper usage: auth((req, ctx) => ...)
		// 	return (req: NextRequest, ctx: MiddlewareContext) => {
		// 		return args[0](req, ctx);
		// 	};
		// }
		// if (args.length === 1) {
		// 	console.log("args[0]: ", args[0]);
		// }
		// if (args.length === 2) {
		// 	console.log("args[0]: ", args[0]);
		// }
		if (args.length === 1 && isNextRequest(args[0])) {
			return handleMiddlewareRequest(args[0]);
		}
		if (
			args.length === 2 &&
			isNextRequest(args[0]) &&
			isMiddlewareContext(args[1])
		) {
			// this is `export const middleware = auth` usage
			return handleMiddlewareRequest(args[0]);
		}
		if (
			args.length === 2 &&
			isNextRequest(args[0]) &&
			isNextFetchEvent(args[1])
		) {
			// Middleware called as: auth(req, event)
			return handleMiddlewareRequest(args[0]);
		}

		throw new Error("Invalid usage of auth()");
	}) as AuthFunction;

	return auth;
}

export const auth = createAuth(authManager);
