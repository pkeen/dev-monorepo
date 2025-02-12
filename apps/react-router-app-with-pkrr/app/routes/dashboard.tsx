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
	return { user };
};

export const loader = withAuth(handler);

export const action = async ({ request }: ActionFunctionArgs) => {
	console.log("ACTION USER: ");
	await new Promise((resolve) => setTimeout(resolve, 1000));
	const { user, headers } = await requireAuth(request, {
		redirectTo: "/auth/login",
	});
	const form = await request.formData();
	const count = form.get("count") || 0;
	console.log("count: ", count);
	return { count };
};

export default function Dashboard() {
	const actionData = useActionData();
	const { user } = useLoaderData();
	const fetcher = useFetcher();
	const navigation = useNavigation();
	const count = actionData?.count ?? 0;
	// const [count, setCount] = useState(0);
	const submit = useSubmit();

	useEffect(() => {
		console.log("fetcher.state:", fetcher.state);
		console.log("navigation.state:", navigation.state);
	}, [fetcher.state, navigation.state]);

	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {user.email} </p>
			<br />
			<div>
				<Form method="post" onSubmit={() => submit(count)}>
					<input type="hidden" name="count" value={count} />
					<button type="submit">Protected Button</button>
				</Form>
			</div>
			<div>
				<p>Count: {count}</p>
			</div>
			<Form action="/auth/logout" method="post">
				<button type="submit">Logout</button>
			</Form>
		</div>
	);
}
