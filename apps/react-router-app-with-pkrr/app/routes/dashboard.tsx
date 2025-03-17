/**
 * Protected Route for demonstrating how to use a protected route
 * Should not be accessed by unauthenticated users
 */

import {
	Form,
	useFetcher,
	useLoaderData,
	useActionData,
	useNavigation,
	useSubmit,
} from "react-router";
import { useEffect } from "react";
import { requireAuth, withAuth, logout } from "../auth";
import { authz } from "../auth";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import type { User } from "@pete_keen/authentication-core";
import type { WithAuthHandlerArgs } from "@pete_keen/react-router-auth";

// import { Route } from "+types/dashboard";

// export const loader = async ({ request }: LoaderFunctionArgs) => {
// 	const { user, headers } = await requireAuth(request, {
// 		redirectTo: "/auth/login",
// 	});
// 	// if (!authenticated) {
// 	// 	return redirect("/auth/login");
// 	// }

// 	return Response.json({ user }, { headers });
// };

const handler = async ({ request, user }: WithAuthHandlerArgs) => {
	if (user) {
		if (!authz.policies.minRole(user, { name: "User" })) {
			throw new Response("Unauthorized", { status: 401 });
		}
	}
	return { user };
};

export const loader = withAuth(handler);

export const action = async ({ request }: ActionFunctionArgs) => {
	return null;
};

export default function Dashboard() {
	// const actionData = useActionData();
	const { user } = useLoaderData();

	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {user.email} </p>
			<br />
			<div>
				<ul>
					Your roles are:
					{user.roles.map((role: { level: number; name: string }) => (
						<li key={role.level}>{role.name}</li>
					))}
				</ul>
			</div>
			<Form action="/auth/logout" method="post">
				<button type="submit">Logout</button>
			</Form>
		</div>
	);
}
