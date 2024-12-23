import { json } from "@remix-run/node";

// Loader (GET request handler)
export const loader = async () => {
	return json({ message: "Hello, World!" });
};

// Action (POST request handler)
export const action = async ({ request }) => {
	const data = await request.json(); // Parse JSON body
	return json({ received: data });
};
