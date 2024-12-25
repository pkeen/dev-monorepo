"use server";
import { headers as nextHeaders, cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	AuthSystem,
	SessionStateStorage,
} from "@pete_keen/authentication-core";

interface SignUpCredentials {
	name: string;
	email: string;
	password: string;
}

export interface ErrorResult {
	error: string;
	data: SignUpCredentials;
}

export function createSignupAction(
	authSystem: AuthSystem,
	sessionStateStorage: SessionStateStorage
) {
	return async function signup(
		options: {
			redirect?: boolean;
			redirectTo?: string;
			provider?: string | undefined;
		} = {
			redirect: true,
			redirectTo: "/",
		},
		previousFormData: FormData,
		formData: FormData
	): Promise<ErrorResult | void> {
		// create credentials
		const credentials: SignUpCredentials = {
			name: formData.get("name") as string,
			email: formData.get("email") as string,
			password: formData.get("password") as string,
		};
		console.log("credentials:", credentials);

		// get headers - not sure they're really even needed
		const headers = new Headers(await nextHeaders());
		console.log(headers);

		// get cookies - not sure they're really even needed - or delete them
		await sessionStateStorage.clear();

		const {
			redirect: shouldRedirect = true, // Default to redirecting after sign-in.
			redirectTo, // Custom URL to redirect to after sign-in.
			...rest // Any additional options passed.
		} = options;

		const callbackUrl =
			redirectTo?.toString() ?? headers.get("Referer") ?? "/";

		const authState = await authSystem.signup(credentials);

		console.log("authState (after signup):", authState);

		if (!authState.keyCards) {
			throw new Error("No key cards found");
		}
		await sessionStateStorage.store(authState.keyCards);

		redirect(callbackUrl);
	};
}

// export async function signup(
// 	options: {
// 		redirect?: boolean;
// 		redirectTo?: string;
// 		provider?: string | undefined;
// 	} = {
// 		redirect: true,
// 		redirectTo: "/",
// 	},
// 	previousFormData: FormData,
// 	formData: FormData
// ) {
// 	// if no provider go to signup
// 	if (!options.provider) {
// 		redirect("/auth/signup");
// 	}

// 	// create credentials
// 	const credentials: SignUpCredentials = {
// 		name: formData.get("name") as string,
// 		email: formData.get("email") as string,
// 		password: formData.get("password") as string,
// 	};
// 	console.log("credentials:", credentials);

// 	// get headers - not sure they're really even needed
// 	const headers = new Headers(await nextHeaders());
// 	console.log(headers);

// 	// get cookies - not sure they're really even needed - or delete them
// 	await sessionStateStorage.clear();

// 	const {
// 		redirect: shouldRedirect = true, // Default to redirecting after sign-in.
// 		redirectTo, // Custom URL to redirect to after sign-in.
// 		...rest // Any additional options passed.
// 	} = options;

// 	const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/";

// 	const authState = await authSystem.signup(credentials);

// 	console.log("authState (after signup):", authState);

// 	if (!authState.keyCards) {
// 		throw new Error("No key cards found");
// 	}
// 	await sessionStateStorage.store(authState.keyCards);

// 	redirect(callbackUrl);
// }
