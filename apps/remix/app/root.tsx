import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import type { LinksFunction } from "react-router";
import "@mantine/core/styles.css";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
// import { AuthProvider } from "~/lib/remix-auth/AuthContext";
// import { Route } from "./+types/root";
// import {
// 	// withValidation,
// 	WithValidationHandlerArgs,
// 	HandlerFunction,
// } from "@pete_keen/remix-authentication";
// import { withValidation } from "~/auth";
// import {
// 	AuthProvider,
// 	useAuthState,
// } from "@pete_keen/remix-authentication/components";
// import { User, AuthState } from "@pete_keen/authentication-core";

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
				<ColorSchemeScript />
			</head>
			<body>
				<MantineProvider>{children}</MantineProvider>
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

// const loaderHandler = async (args: WithValidationHandlerArgs) => {
// 	console.log("ROOT LOADER CALLED");
// 	// console.log("args: ", args);
// 	return "hello";
// };

// export const loader = withValidation<string>(loaderHandler, {
// 	csrf: true,
// });

// const parseLoaderData = (data: string | any) => {
// 	return JSON.parse(data);
// };

// export default function App({ loaderData }: Route.ComponentProps) {
// 	console.log("ROOT LOADER DATA: ", loaderData);
// 	const { csrf, authState, data } = parseLoaderData(loaderData);
// 	// const { csrf, user, isLoggedIn } = loaderData;
// 	console.log("ROOT LOADER CSRF: ", csrf);

// 	return (
// 		<Layout>
// 			<AuthProvider csrf={csrf} authState={authState}>
// 				<Outlet />
// 			</AuthProvider>
// 		</Layout>
// 	);
// }

export default function App() {
	// Not sure if layout should be wrapped here
	return (
		// <Layout>
			<Outlet />
		// {/* </Layout> */}
	);
}
