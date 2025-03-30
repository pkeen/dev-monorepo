/**
 * Protected Route for demonstrating how to use a protected route
 * Should not be accessed by unauthenticated users
 * Demo AuthZ by making it only available to admin users
 */

import { Form, useFetcher, useLoaderData, redirect } from "react-router";
import { requireAuth } from "~/lib/requireAuth";
import type { LoaderFunctionArgs, ActionFunctionArgs } from "react-router";
import { rbac } from "~/authz";
import authManager from "~/auth";
import { cb } from "~/auth";

// import { Route } from "+types/dashboard";

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { user, headers } = await requireAuth(request, {
		redirectTo: "/auth/login",
	});
	const enrichedUser = await authManager.callbacks.enrichUser(user);
	// const enrichedUser = await enrich(user);
    

	console.log("LOADER USER: ", user);
	if (user) {
		if (!rbac.policies.min(user, { key: "user" })) {
			return redirect("/auth/login");
		}
	}

	// if (rbac.policies.min(user, { key: "admin" })) {
	// }

	// console.log("USER ROLES", user.roles);
	return Response.json({ ...user }, { headers });
};

export const action = async ({ request }: ActionFunctionArgs) => {
	const user = await requireAuth(request, {
		redirectTo: "/auth/login",
	});
	console.log("ACTION USER: ", user);
};

export default function Dashboard() {
	const loaderData = useLoaderData();
	// console.log("LOADER DATA: ", loaderData);
	// console.log("Loader data roles", loaderData.roles);
	const fetcher = useFetcher();
	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {loaderData.email} </p>
			<br />
			<div>
				<button
					onClick={() => fetcher.submit(null, { method: "post" })}
				>
					Protected Button
				</button>
			</div>
			<div>
				{/* <ul>
					Your roles are:
					{loaderData.roles.map(
						(role: { level: number; name: string }) => (
							<li key={role.level}>{role.name}</li>
						)
					)}
				</ul> */}
				<p>Role: {loaderData.role.name} </p>
			</div>
			<Form action="/auth/logout" method="post">
				<button type="submit">Logout</button>
			</Form>
		</div>
	);
}
