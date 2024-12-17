"use server";
import { headers as nextHeaders, cookies } from "next/headers";
import { redirect } from "next/navigation";
import { authSystem } from "@/app/auth";
import { sessionStateStorage } from "@/app/auth";

interface SignUpCredentials {
	name: string;
	email: string;
	password: string;
}

export async function signup(
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
		redirect("/auth/signup");
	}

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

	const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/";

	const authState = await authSystem.signup(credentials);

	console.log("authState (after signup):", authState);

	if (!authState.keyCards) {
		throw new Error("No key cards found");
	}
	await sessionStateStorage.store(authState.keyCards);

	redirect(callbackUrl);

	// console.log("callbackUrl:", callbackUrl);

	// const signInURL = new URL("/auth/signin", headers.get("Origin") ?? "");

	/**
	 * OK I think this is for when the action is called without a provider and it just directs to the sign up page
	 */
	// if (!options.provider) {
	// 	signInURL.searchParams.append("callbackUrl", callbackUrl); // Add the callback URL to the query string.

	// 	if (shouldRedirect) redirect(signInURL.toString()); // Redirect if required.
	// 	return signInURL.toString(); // Return the sign-in URL for client-side navigation.
	// }

	/**
	 * constructing a provider URL
	 */
	// let url = `${signInURL}/${provider}?${new URLSearchParams(
	// 	authorizationParams
	// )}`;

	// try {
	// 	// dont need to call api can handle it here
	// 	// const response = await fetch(signInURL, {
	// 	// 	method: "POST",
	// 	// 	headers: {
	// 	// 		"Content-Type": "application/json",
	// 	// 	},
	// 	// 	body: JSON.stringify(credentials),
	// 	// });
	// 	// const data = await response.json();
	// 	// return data;
	// } catch (err) {
	// 	const errMessage = err instanceof Error ? err.message : err;

	// 	const returnValue = {
	// 		data: credentials,
	// 		error: errMessage,
	// 	};
	// 	console.log(returnValue);
	// 	return returnValue;
	// }
}
