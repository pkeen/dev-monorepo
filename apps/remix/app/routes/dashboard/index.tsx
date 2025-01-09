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

// import { Route } from "react-router";

// import { User } from "@pete_keen/authentication-core";

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

// export const loader: LoaderFunction = async () => {
// 	console.log("dashboard loader called");
// 	const { user, isLoggedIn } = useAuth();
// 	if (isLoggedIn) {
// 		return user;
// 	} else {
// 		return redirect("/auth/login");
// 	}
// };

// export const loader = withRemixAuth(
// 	async ({
// 		request,
// 		user,
// 		isLoggedIn,
// 	}: {
// 		request: Request;
// 		user: User;
// 		isLoggedIn: boolean;
// 	}) => {
// 		console.log("DASHBOARD LOADER called");
// 		if (!isLoggedIn) {
// 			return redirect("/auth/login");
// 		}
// 		return user;
// 	},
// 	{ csrf: true }
// );

// export const loader = withSession(
// 	async ({
// 		request,
// 		user,
// 		isLoggedIn,
// 	}: {
// 		request: Request;
// 		user: User;
// 		isLoggedIn: boolean;
// 	}) => {
// 		console.log("DASHBOARD LOADER called");
// 		if (!isLoggedIn) {
// 			return redirect("/auth/login");
// 		}
// 		return user;
// 	}
// );

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("DASHBOARD LOADER called");
	const { user, isLoggedIn } = await getSessionData(request);
	console.log("loader - user: ", user);
	if (!isLoggedIn) {
		return redirect("/auth/login");
	}
	return { user };
};

export const action = withAuth(
	async ({ request, user }: { request: Request; user: User }) => {
		console.log(" action user: ", user);
		console.log("action completed");
		return user;
	},
	{ csrf: true }
);

export default function Info() {
	const loaderData = useLoaderData();
	// const user = loaderData.user;
	console.log(loaderData);
	const { csrfToken } = useAuth();
	// console.log("csrfToken: ", csrfToken);
	const { user } = loaderData;
	return (
		<div>
			<h1>Dashboard</h1>
			<p> Hi 🖐🏻, {user.email} </p>
			<Form method="post">
				<CsrfHidden />
				<button type="submit">Test Csrf</button>
			</Form>
		</div>
	);
}
