"use server";

import { NextSessionStateStorage } from "session-state-storage";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

// Async function only
export async function login(
	options: {
		redirect?: boolean;
		redirectTo?: string;
		provider?: string | undefined;
	},
	previousFormData: FormData,
	formData: FormData
): Promise<{ data: { email: string; password: string }; error?: string }> {
	"use server";

	// Simplified session storage
	const sessionStateStorage = new NextSessionStateStorage();

	// Provider check
	if (!options.provider) {
		throw new Error("Provider not specified");
	}

	// Retrieve headers (safe method)
	const origin = headers().get("origin");

	// Collect credentials
	const credentials = {
		email: formData.get("email") as string,
		password: formData.get("password") as string,
	};

	// Clear session state
	await sessionStateStorage.clear();

	// Authenticate directly (replace fetch with logic or call a service)
	const authState = await fetch(`${origin}/api/auth/login`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(credentials),
	}).then((res) => res.json());

	// Validate authentication
	if (!authState.isLoggedIn) {
		return {
			error: "Sign in failed",
			data: credentials,
		};
	}

	// Store session state
	await sessionStateStorage.store(authState.keyCards);

	// Redirect
	const redirectTo = options.redirectTo ?? "/";
	redirect(redirectTo);
	return { data: credentials };
}

// "use server";
// import { NextSessionStateStorage } from "session-state-storage";
// import { headers as nextHeaders, cookies } from "next/headers";
// import { redirect } from "next/navigation";

// export async function login(
// 	// authSystem: AuthSystem, // Accept dependency as a parameter
// 	// sessionStateStorage: SessionStateStorage,
// 	options: {
// 		redirect?: boolean;
// 		redirectTo?: string;
// 		provider?: string | undefined;
// 	}, // Accept dependency as a parameter
// 	previousFormData: FormData,
// 	formData: FormData
// ): Promise<{ data: { email: string; password: string }; error?: string }> {
// 	// "use server";

// 	const sessionStateStorage = new NextSessionStateStorage();
// 	// Redirect if provider isn't set
// 	if (!options.provider) {
// 		throw new Error("Provider not specified");
// 	}

// 	const headers = new Headers(await nextHeaders());

// 	console.log("headers", headers);

// 	console.log("headers.get('Origin')", headers.get("Origin"));

// 	// const apiUrl = headers.get('Referer');

// 	// console.log("apiUrl",   apiUrl);

// 	// Collect form data
// 	const credentials = {
// 		email: formData.get("email") as string,
// 		password: formData.get("password") as string,
// 	};

// 	// Clear session state
// 	await sessionStateStorage.clear();

// 	// Authenticate
// 	// call to the auth system through api route
// 	const authState = await fetch(headers.get("Origin") + "/api/auth/login", {
// 		method: "POST",
// 		headers: {
// 			"Content-Type": "application/json",
// 		},
// 		body: JSON.stringify(credentials),
// 	}).then((res) => res.json());

// 	// const authState = await authSystem.authenticate(credentials);

// 	if (!authState.isLoggedIn) {
// 		return {
// 			error: "Sign in failed",
// 			data: credentials,
// 		};
// 	}

// 	// Store session state
// 	await sessionStateStorage.store(authState.keyCards);

// 	// Redirect after login
// 	const redirectTo = options.redirectTo ?? "/";
// 	redirect(redirectTo);
// 	return { data: credentials };
// }

// // // "use server";
// // import {
// // 	AuthSystem,
// // 	SessionStateStorage,
// // } from "@pete_keen/authentication-core";
// // import { headers as nextHeaders, cookies } from "next/headers";
// // import { redirect } from "next/navigation";

// // export async function createLoginAction(
// // 	authSystem: AuthSystem,
// // 	sessionStateStorage: SessionStateStorage
// // ) {
// // 	// "use server";
// // 	return async function login(
// // 		// options: {
// // 		// 	redirect?: boolean;
// // 		// 	redirectTo?: string;
// // 		// 	provider?: string | undefined;
// // 		// } = {
// // 		// 	redirect: true,
// // 		// 	redirectTo: "/",
// // 		// },
// // 		previousFormData: FormData,
// // 		formData: FormData
// // 	): Promise<{ data: {email: string; password: string}; error?: string } {
// // 		"use server";

// //         const options = {
// //             provider: "credentials",
// //             redirect: true,
// //             redirectTo: "/",
// //         }
// // 		// if no provider go to signup
// // 		if (!options.provider) {
// // 			redirect("/auth/login");
// // 		}

// // 		// create credentials
// // 		const credentials = {
// // 			email: formData.get("email") as string,
// // 			password: formData.get("password") as string,
// // 		};
// // 		console.log("credentials:", credentials);

// // 		// get headers - not sure they're really even needed
// // 		const headers = new Headers(await nextHeaders());
// // 		console.log(headers);

// // 		// get cookies - not sure they're really even needed - or delete them
// // 		await sessionStateStorage.clear();

// // 		const {
// // 			redirect: shouldRedirect = true, // Default to redirecting after sign-in.
// // 			redirectTo, // Custom URL to redirect to after sign-in.
// // 			...rest // Any additional options passed.
// // 		} = options;

// // 		const callbackUrl =
// // 			redirectTo?.toString() ?? headers.get("Referer") ?? "/";

// // 		const authState = await authSystem.authenticate(credentials);

// // 		if (!authState.isLoggedIn) {
// // 			console.log("Sign in failed");
// // 			return {
// // 				error: "Sign in failed",
// // 				data: credentials,
// // 			};
// // 		}

// // 		console.log("authState (after signin):", authState);

// // 		if (!authState.keyCards) {
// // 			throw new Error("No key cards found");
// // 		}
// // 		await sessionStateStorage.store(authState.keyCards);

// // 		redirect(callbackUrl);
// // 	};
// // }
