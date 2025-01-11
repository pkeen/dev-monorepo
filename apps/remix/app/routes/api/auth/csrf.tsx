import { csrfTokenMiddleware } from "~/lib/remix-auth/irrelevant/csrfMiddleware";
import { LoaderFunctionArgs } from "react-router";
// csrf route for token fetching
export async function loader({ request }: LoaderFunctionArgs) {
	return await csrfTokenMiddleware(request);
}
