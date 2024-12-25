import { authSystem } from "~/auth";
import type { ActionFunctionArgs } from "react-router";

export const action = async ({ request }: ActionFunctionArgs) => {
	const credentials = await request.json();

	console.log("credentials: ", credentials);

	const authState = await authSystem.authenticate(credentials);

	return new Response(JSON.stringify(authState));
};
