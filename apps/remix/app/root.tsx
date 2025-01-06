import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { AuthProvider } from "~/lib/remix-auth/AuthContext";
import {
	csrfTokenMiddleware,
	fetchCsrfToken,
} from "~/lib/remix-auth/csrfMiddleware";
import { LoaderFunctionArgs } from "react-router";
import { getSession } from "~/lib/remix-auth/sessionStorage";
import { Route } from "react-router";

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

export const loader = async ({ request }: LoaderFunctionArgs) => {
	console.log("loader called");
	const csrfResponse = await csrfTokenMiddleware(request);
	const { csrfToken } = await csrfResponse.json();
	const setCookieHeader = csrfResponse.headers.get("Set-Cookie");
	// const csrf = await fetchCsrfToken(request);
	// console.log("csrf: ", csrf);
	const session = await getSession(request);
	const user = (await session.get("user")) || null;
	console.log("user: ", user);
	const isAuthenticated = session.get("isLoggedIn") || false;

	return new Response(
		JSON.stringify({
			csrf: csrfToken,
			user,
			isAuthenticated,
		}),
		{
			headers: {
				"Set-Cookie": setCookieHeader,
			},
		}
	);
};

export default function App({ loaderData }: Route.ComponentProps) {
	const { csrf, user, isAuthenticated } = JSON.parse(loaderData);
	// console.log("loaderData: ", loaderData);
	// console.log("csrf (server): ", csrf);
	// console.log("user: ", user);
	// console.log("isAuthenticated: ", isAuthenticated);
	return (
		<AuthProvider
			csrfToken={csrf}
			user={user}
			isAuthenticated={isAuthenticated}
		>
			<Outlet />
		</AuthProvider>
	);
}
