import { LoaderFunctionArgs } from "react-router";
import { getSession } from "~/lib/remix-auth/sessionStorage";
// csrf route for token fetching
export async function loader({ request }: LoaderFunctionArgs) {
	// return await getSession(request);
	const session = await getSession(request);
	console.log("session: ", session);
	return new Response(JSON.stringify(session), {
		headers: {
			"Content-Type": "application/json",
		},
	});
}
