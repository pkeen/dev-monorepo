import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import { AuthProvider } from "~/lib/remix-auth/AuthContext";
import { Route } from "./+types/root";
import {
	withValidation,
	WithValidationHandlerArgs,
	HandlerFunction,
} from "./lib/remix-auth/withAuth";
import { User, AuthState } from "@pete_keen/authentication-core";

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

// interface LoaderData {
// 	csrf: string | null;
// 	authState: AuthState;
// 	user: User | null;
// 	authenticated: boolean;
// }

const loaderHandler = async (args: WithValidationHandlerArgs) => {
	console.log("ROOT LOADER CALLED");
	// console.log("args: ", args);
	return "hello";
};

export const loader = withValidation<string>(loaderHandler, {
	csrf: true,
});

const parseLoaderData = (data: string | any) => {
	return JSON.parse(data);
};

export default function App({ loaderData }: Route.ComponentProps) {
	const { csrf, user, authenticated, data } = parseLoaderData(loaderData);
	// const { csrf, user, isLoggedIn } = loaderData;
	console.log("ROOT LOADER DATA: ", data);

	return (
		<Layout>
			<AuthProvider
				csrfToken={csrf}
				user={user}
				authenticated={authenticated}
			>
				<Outlet />
			</AuthProvider>
		</Layout>
	);
}
