import { stateCookie, commitSession, getSession } from "~/session.server";
import { redirect } from "react-router";
import type { LoaderFunctionArgs } from "react-router";
import authSystem from "~/auth";

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
	const { provider } = params;
	console.log("PROVIDER:", provider);

	// Retrieve the stored state from cookie
	const cookieHeader = request.headers.get("Cookie");
	const storedState = await stateCookie.parse(cookieHeader);
	console.log("STORED STATE:", storedState);
	const url = new URL(request.url);
	const code = url.searchParams.get("code");
	const returnedState = url.searchParams.get("state");
	console.log("RETURNED URL:", url);

	const session = await getSession(request.headers.get("Cookie"));
	const headers = new Headers();

	// validate state
	if (
		!code ||
		!returnedState ||
		!storedState ||
		returnedState !== storedState
	) {
		console.log("RETURNED STATE", returnedState);
		console.log("STORED STATE", storedState);
		// bad request
		return new Response(null, {
			status: 400,
		});
	}

	try {
		// Getting here
		console.log("GETTING HERE");

		const authResult = await authSystem.login({ provider, code });
		// console.log("authResult:", authResult);

		if (authResult.type === "success") {
			console.log("SUCCESS");
			session.set("authState", authResult.authState);
			headers.append("Set-Cookie", await commitSession(session));
			return redirect("/", {
				headers,
			});
		} else if (authResult.type === "redirect") {
			console.log("REDIRECT");
			return redirect(authResult.url);
		} else {
			console.log("UNKNOWN AUTHRESULT TYPE:", authResult);
			throw new Error("Unknown authResult type");
		}
	} catch (e) {
		console.log("ERROR:", e);
	}
};
