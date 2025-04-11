// lib/auth/routeHandler.ts
import { NextRequest } from "next/server";
import { authManager } from "@/auth";
import { IAuthManager } from "@pete_keen/authentication-core";
import { renderSignInPage } from "@/lib/thia/views/signin";
import { redirect } from "next/navigation";
import {
	oauthStateCookie,
	returnToCookie,
	thiaSessionCookie,
} from "@/lib/thia/cookies";
import { getSession, commitSession, destroySession } from "@/session";
// import { AuthConfig } from "./types";
// import { renderSignInPage } from "./views/signin";

export async function handleAuthRoute(
	request: Request,
	method: "GET" | "POST",
	authManager: IAuthManager
): Promise<Response> {
	const url = new URL(request.url);
	// console.log("URL:", url);
	const parts = url.pathname.split("/api/thia/")[1]?.split("/") ?? [];
	// console.log("Parts:", parts);
	const [action, provider] = parts;
	// console.log("Action:", action, "Provider:", provider);

	if (method === "GET") {
		// SignIn HTML Page
		if (action === "signin") {
			const providers = authManager.listProviders();
			return renderSignInPage(providers);
		}

		// SignOut
		if (action === "signout") {
			return new Response("<p>Signed out</p>", {
				headers: { "Content-Type": "text/html" },
				status: 200,
			});
		}

		// Redirect back from OAuth provider
		if (action === "redirect" && provider) {
			const storedState = await oauthStateCookie.get();
			// console.log("STORED STATE:", storedState);

			const url = new URL(request.url);
			const error = url.searchParams.get("error");
			if (error) {
				console.log("ERROR:", error);
				return Response.redirect("/api/thia/signin", 302);
			}
			const code = url.searchParams.get("code");
			const returnedState = url.searchParams.get("state");

			if (
				!code ||
				!returnedState ||
				!storedState ||
				returnedState !== storedState
			) {
				// console.log("RETURNED STATE", returnedState);
				// console.log("STORED STATE", storedState);
				// bad request
				return new Response(null, {
					status: 400,
				});
			}

			try {
				const authResult = await authManager.login({
					provider: provider?.toString()!,
					code,
				});
				if (authResult.type === "success") {
					// console.log("SUCCESS");
					const sessionCookie = thiaSessionCookie.set(
						authResult.authState
					);

					// spoof config - for now
					const config = { redirectAfterLogin: "/" };

					const returnTo = await returnToCookie.get();

					return new Response(null, {
						status: 302,
						headers: {
							Location:
								config.redirectAfterLogin ?? returnTo ?? "/", // for now but add returnTo logic
							"Set-Cookie": sessionCookie,
						},
					});
				} else if (authResult.type === "redirect") {
					// Add the Content-Type header here too.
					return Response.redirect(authResult.url, 302);
				} else {
					throw new Error("Unknown authResult type");
				}
			} catch (e) {
				console.log("ERROR:", e);
			}
		}
	}

	if (method === "POST") {
		if (action === "signin") {
			const formData = await request.formData();
			const provider = formData.get("provider");
			console.log("Provider:", provider);
			if (!provider || typeof provider !== "string") {
				return Response.redirect("/api/thia/signin", 302); // or manually build a 302 if cookie is needed
			}
			const authResult = await authManager.login({
				provider: provider?.toString()!,
			});

			if (authResult.type === "redirect") {
				const cookieHeader = await oauthStateCookie.set(
					authResult.state
				);
				return new Response(null, {
					status: 302,
					headers: {
						Location: authResult.url,
						"Set-Cookie": cookieHeader,
						"Content-Type": "text/html",
					},
				});
			}
		}

		if (action === "signout") {
			return new Response("<p>Signed out</p>", {
				headers: { "Content-Type": "text/html" },
				status: 200,
			});
		}
	}

	return new Response("Not Found", { status: 404 });
}

const handlers = {
	GET: (req: Request) => handleAuthRoute(req, "GET", authManager),
	POST: (req: Request) => handleAuthRoute(req, "POST", authManager),
};

export const { GET, POST } = handlers;
