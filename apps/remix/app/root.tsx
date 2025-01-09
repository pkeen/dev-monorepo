import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { AuthProvider } from "~/lib/remix-auth/AuthContext";
import { Route } from "./+types/root";
import {
	withValidation,
	WithValidationArgs,
	HandlerFunction,
} from "./lib/remix-auth/withAuth";
import { User } from "@pete_keen/authentication-core";

import "./tailwind.css";

export const links: LinksFunction = () => [
	{ rel: "preconnect", href: "https://fonts.googleapis.com" },
	{
		rel: "preconnect",
		href: "https://fonts.gstatic.com",
		crossOrigin: "anonymous",
	},
	{
		rel: "stylesheet",
		href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
	},
];

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

// export const loader = async ({ request }: LoaderFunctionArgs) => {
// 	console.log("ROOT LOADER called");
// 	const csrfResponse = await csrfTokenMiddleware(request);
// 	const { csrfToken } = await csrfResponse.json();
// 	const setCookieHeader = csrfResponse.headers.get("Set-Cookie");
// 	// const csrf = await fetchCsrfToken(request);
// 	// console.log("csrf: ", csrf);
// 	const session = await getSession(request);
// 	const user = (await session.get("user")) || null;
// 	console.log("user: ", user);
// 	const isAuthenticated = session.get("isLoggedIn") || false;

// 	return new Response(
// 		JSON.stringify({
// 			csrf: csrfToken,
// 			user,
// 			isAuthenticated,
// 		}),
// 		{
// 			headers: {
// 				"Set-Cookie": setCookieHeader,
// 			},
// 		}
// 	);
// };

// export const loader = async ({ request }: LoaderFunctionArgs) => {
// 	console.log("ROOT LOADER called");
// 	return await middleware(request);
// };

interface LoaderData {
	csrf: string | null;
	user: User | null;
	isLoggedIn: boolean;
}

interface HandlerArgs {
	csrf: string | null;
	user: User | null;
	isLoggedIn: boolean;
}

const loaderHandler: HandlerFunction<HandlerArgs> = async ({
	request,
	user,
	isLoggedIn,
	csrf,
}: WithValidationArgs): Promise<LoaderData> => {
	console.log("ROOT LOADER called");
	return {
		user,
		isLoggedIn,
		csrf,
	};
};

export const loader = withValidation(loaderHandler, {
	csrf: true,
});

const parseLoaderData = (data: string | any) => {
	return JSON.parse(data);
};

export default function App({ loaderData }: Route.ComponentProps) {
	// const { csrf, user, isLoggedIn } = JSON.parse(loaderData);
	// const { csrf, user, isLoggedIn } = JSON.parse(loaderData);
	const { csrf, user, isLoggedIn } = parseLoaderData(loaderData);
	console.log("loaderData: ", loaderData);
	console.log("csrf in root: ", csrf);
	// console.log("loaderData: ", loaderData);
	// console.log("csrf (server): ", csrf);
	// console.log("user: ", user);
	// console.log("isAuthenticated: ", isAuthenticated);
	return (
		<Layout>
			<AuthProvider csrfToken={csrf} user={user} isLoggedIn={isLoggedIn}>
				<Outlet />
			</AuthProvider>
		</Layout>
	);
}
