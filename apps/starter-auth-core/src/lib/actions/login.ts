"use server";
import { headers as nextHeaders, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authSystem } from "@/app/auth";
import { sessionStateStorage } from "@/app/auth";

interface SignInCredentials {
	email: string;
	password: string;
}

export async function login(
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
) {
	// debugger
	console.log("options:", options);
	console.log("previousFormData:", previousFormData);
	console.log("formData:", formData);

	// if no provider go to signup
	if (!options.provider) {
		redirect("/auth/login");
	}

	// create credentials
	const credentials: SignInCredentials = {
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

	const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/";

	const authState = await authSystem.authenticate(credentials);

	if (!authState.isLoggedIn) {
		console.log("Sign in failed");
		return {
			message: "Sign in failed",
			...credentials,
		};
	}

	console.log("authState (after signin):", authState);

	if (!authState.keyCards) {
		throw new Error("No key cards found");
	}
	await sessionStateStorage.store(authState.keyCards);

	redirect(callbackUrl);
}
