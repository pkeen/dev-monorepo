import { redirect } from "react-router";
import authSystem from "~/auth";
import { getSession } from "~/session.server";
import { commitSession } from "~/session.server";

export const action = async ({ request }: { request: Request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const previousAuthState = await session.get("authState");
	const headers = new Headers();

	// call the auth system method
	if (!previousAuthState) {
		return new Response(null, {
			status: 400,
		});
	}
	const authState = await authSystem.signOut(previousAuthState.keyCards);

	session.set("authState", authState);
	headers.append("Set-Cookie", await commitSession(session));

	return redirect("/", {
		headers,
	});
};
