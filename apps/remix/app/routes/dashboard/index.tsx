import { LoaderFunction, redirect } from "react-router";
import {
	withAuth,
	withRemixAuth,
	withSession,
	getSessionData,
} from "~/lib/remix-auth/withAuth";
import { Form } from "react-router";
import { CsrfHidden } from "~/lib/remix-auth/CsrfHidden";
import { useAuth } from "~/lib/remix-auth/AuthContext";
import { useLoaderData } from "react-router";
import { Route } from "./+types/index";
import { withValidation } from "~/lib/remix-auth/withAuth";

export const loader = async ({ request }: Route.LoaderArgs) => {
	console.log("DASHBOARD LOADER called");
	const { user, isLoggedIn } = await getSessionData(request);
	console.log("loader - user: ", user);
	if (!isLoggedIn) {
		return redirect("/auth/login");
	}
	return { user };
};

export const action = withValidation(
	async ({ request, user }: { request: Request; user: User }) => {
		console.log(" action user: ", user);
		console.log("action completed");
		return user;
	},
	{ csrf: true }
);

export default function Info({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {user?.email} </p>
			<Form method="post">
				<CsrfHidden />
				<button type="submit">Test Csrf</button>
			</Form>
		</div>
	);
}
