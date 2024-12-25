import type { ActionFunctionArgs } from "react-router";
// Loader (GET request handler)
export const loader = async () => {
	return new Response(JSON.stringify({ message: "Hello, World!" }));
};

// Action (POST request handler)
export const action = async ({ request }: ActionFunctionArgs) => {
	const data = await request.json(); // Parse JSON body
	return new Response(JSON.stringify({ received: data }));
};
