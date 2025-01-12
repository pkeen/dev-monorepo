import { ActionFunctionArgs, LoaderFunction, redirect } from "react-router";
import { getSessionData } from "@pete_keen/remix-authentication";
import { Form } from "react-router";
import {
	CsrfHidden,
	useAuthState,
} from "@pete_keen/remix-authentication/components";
import { useLoaderData } from "react-router";
import { Route } from "./+types/info";
import {
	WithValidationHandlerArgs,
	HandlerFunction,
} from "@pete_keen/remix-authentication";
import { withValidation } from "~/auth";

export const loader = async ({ request }: Route.LoaderArgs) => {
	const { user, authenticated } = await getSessionData(request);
	if (!authenticated) {
		return redirect("/auth/login");
	}
	return { user };
};

const actionHandler = async (args: WithValidationHandlerArgs) => {
	console.log("INFO ACTION HANDLER");
};

export const action = withValidation<void>(actionHandler, {
	csrf: true,
});

export default function Info({ loaderData }: Route.ComponentProps) {
	// const user = loaderData.user;
	console.log(loaderData);
	const { csrf } = useAuthState();
	// console.log("csrfToken: ", csrfToken);
	const { user } = loaderData;
	return (
		<div>
			<h1>Info</h1>
			<p> hello {user?.email}</p>
			<Form method="post">
				<CsrfHidden />
				<button type="submit">Test Csrf</button>
			</Form>
		</div>
	);
}
