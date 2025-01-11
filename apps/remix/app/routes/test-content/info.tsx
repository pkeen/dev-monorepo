import { LoaderFunction, redirect } from "react-router";
import { withAuth } from "~/lib/remix-auth/irrelevant/withAuth";
import { Form } from "react-router";
// import { Route } from "react-router";

import { User } from "@pete_keen/authentication-core";
import { useAuth } from "~/lib/remix-auth/irrelevant/AuthContext";
import { CsrfHidden } from "~/lib/remix-auth/irrelevant/CsrfHidden";

// export const loader: LoaderFunction = async () => {
// 	return null;
// };

// export const loader = withAuth(
// 	async ({
// 		request,
// 		user,
// 		isLoggedIn,
// 	}: {
// 		request: Request;
// 		user: User;
// 		isLoggedIn: boolean;
// 	}) => {
// 		console.log(" loader user: ", user);
// 		if (!isLoggedIn) {
// 			return redirect("/auth/login");
// 		}
// 		return user;
// 	},
// 	{ csrf: true }
// );

// export const action = withAuth(
// 	async ({ request, user }: { request: Request; user: User }) => {
// 		console.log(" action user: ", user);
// 		console.log("action completed");
// 		return user;
// 	},
// 	{ csrf: true }
// );

export default function Info({ loaderData }: { loaderData: User }) {
	// const user = loaderData.user;
	console.log(loaderData);
	const { csrfToken } = useAuth();
	// console.log("csrfToken: ", csrfToken);
	const { email } = loaderData;
	return (
		<div>
			<h1>Info</h1>
			<p> hello {email}</p>
			<Form method="post">
				<CsrfHidden />
				<button type="submit">Test Csrf</button>
			</Form>
		</div>
	);
}
