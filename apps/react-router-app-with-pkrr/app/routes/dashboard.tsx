/**
 * Protected Route for demonstrating how to use a protected route
 * Should not be accessed by unauthenticated users
 */

import { Form, useFetcher, useLoaderData, useNavigation } from "react-router";
import { useEffect } from "react";
import { requireAuth } from "../auth";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";

// import { Route } from "+types/dashboard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	// TODO: Check if user is authenticated
	// const user = await useAuth({ request });
	const user = await requireAuth(request, { redirectTo: "/auth/login" });
	// if (!authenticated) {
	// 	return redirect("/auth/login");
	// }

	return { user };
};

export const action = async ({ request }: ActionFunctionArgs) => {
	await new Promise((resolve) => setTimeout(resolve, 3000));
	const user = await requireAuth(request, { redirectTo: "/auth/login" });
	console.log("ACTION USER: ", user);
};

export default function Dashboard() {
	const loaderData = useLoaderData();
	const fetcher = useFetcher();
	const navigation = useNavigation();

	useEffect(() => {
		console.log("fetcher.state:", fetcher.state);
		console.log("navigation.state:", navigation.state);
	}, [fetcher.state, navigation.state]);
	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {loaderData.user.email} </p>
			<br />
			<div>
				<button
					onClick={() => fetcher.submit(null, { method: "post" })}
				>
					Protected Button
				</button>
			</div>
		</div>
	);
}
