import type { ActionFunctionArgs } from "react-router";
import { authSystem } from "~/auth";

export const action = async ({ request }: ActionFunctionArgs) => {
	const keyCards = await request.json();

	await authSystem.logout(keyCards);

	return new Response();
};
