import { ActionFunctionArgs, LoaderFunction, redirect } from "react-router";
import { getSessionData } from "@pete_keen/remix-authentication";
import { Form } from "react-router";
import {
	CsrfHidden,
	useAuthState,
} from "@pete_keen/remix-authentication/components";
import { useLoaderData } from "react-router";
import { Route } from "./+types/index";
import {
	WithValidationHandlerArgs,
	HandlerFunction,
} from "@pete_keen/remix-authentication";
import { withValidation } from "~/auth";

export const loader = async ({ request }: Route.LoaderArgs) => {
	console.log("DASHBOARD LOADER called");
	const { user, authenticated } = await getSessionData(request);
	console.log("loader - user: ", user);
	if (!authenticated) {
		return redirect("/auth/login");
	}
	return { user };
};

const actionHandler = async (args: WithValidationHandlerArgs) => {};

export const action = withValidation<void>(actionHandler, {
	csrf: true,
});

// export const action = withValidation(
// 	async ({ request, user, csrf }: ActionFunctionArgs) => {
// 		console.log(" action user: ", user);
// 		console.log("action completed");
// 		return user;
// 	},
// 	{ csrf: true }
// );

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
			<p></p>
		</div>
	);
}
