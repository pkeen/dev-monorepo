// "use server";
// import { headers as nextHeaders, cookies } from "next/headers";
// import { redirect } from "next/navigation";
// import { authSystem } from "@/app/auth";
// import { sessionStateStorage } from "@/app/auth";

// export const logout = async (
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
// ) => {
// 	// debugger
// 	console.log("options:", options);

// 	const {
// 		redirect: shouldRedirect = true, // Default to redirecting after sign-in.
// 		redirectTo, // Custom URL to redirect to after sign-in.
// 		...rest // Any additional options passed.
// 	} = options;

// 	// get headers - not sure they're really even needed
// 	const headers = new Headers(await nextHeaders());
// 	console.log(headers);
// 	const callbackUrl = redirectTo?.toString() ?? headers.get("Referer") ?? "/";

// 	// get the cookies
// 	const keyCards = await sessionStateStorage.retrieve(headers);
// 	const authState = await authSystem.logout(keyCards ?? undefined);
// 	// Clear the cookies
// 	await sessionStateStorage.clear();

// 	redirect(callbackUrl);
// };

"use server";
import { headers as nextHeaders, cookies } from "next/headers";
import { redirect } from "next/navigation";
import {
	AuthSystem,
	SessionStateStorage,
} from "@pete_keen/authentication-core";

export const createLogoutAction = (
	authSystem: AuthSystem,
	sessionStateStorage: SessionStateStorage
) => {
	return async function logout(
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

		const {
			redirect: shouldRedirect = true, // Default to redirecting after sign-in.
			redirectTo, // Custom URL to redirect to after sign-in.
			...rest // Any additional options passed.
		} = options;

		// get headers - not sure they're really even needed
		const headers = new Headers(await nextHeaders());
		console.log(headers);
		const callbackUrl =
			redirectTo?.toString() ?? headers.get("Referer") ?? "/";

		// get the cookies
		const keyCards = await sessionStateStorage.retrieve(headers);
		const authState = await authSystem.logout(keyCards ?? undefined);
		// Clear the cookies
		await sessionStateStorage.clear();

		redirect(callbackUrl);
	};
};
