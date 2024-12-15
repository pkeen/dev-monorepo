"use server";
import { headers as nextHeaders, cookies } from "next/headers";
import { redirect } from "next/navigation";

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
	console.log("options:", options);
	console.log("previousFormData:", previousFormData);
	console.log("formData:", formData);
	const headers = new Headers(await nextHeaders());
	console.log(headers);

	const {
		redirect: shouldRedirect = true, // Default to redirecting after sign-in.
		redirectTo, // Custom URL to redirect to after sign-in.
		...rest // Any additional options passed.
	} = options instanceof FormData ? Object.fromEntries(options) : options;

	const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/";

	console.log("callbackUrl:", callbackUrl);

	const signInURL = new URL("/auth/signin", headers.get("Origin") ?? "");

	/**
	 * OK I think this is for when the action is called without a provider and it just directs to the sign up page
	 */
	if (!options.provider) {
		signInURL.searchParams.append("callbackUrl", callbackUrl); // Add the callback URL to the query string.

		if (shouldRedirect) redirect(signInURL.toString()); // Redirect if required.
		return signInURL.toString(); // Return the sign-in URL for client-side navigation.
	}

	/**
	 * constructing a provider URL
	 */
	// let url = `${signInURL}/${provider}?${new URLSearchParams(
	// 	authorizationParams
	// )}`;

	try {
		const response = await fetch("/api/auth/signup", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(formData),
		});
		const data = await response.json();
		return data;
	} catch (err) {
		const errMessage = err instanceof Error ? err.message : err;

		const returnValue = {
			data: formData,
			error: errMessage,
		};
		console.log(returnValue);
		return returnValue;
	}
}
