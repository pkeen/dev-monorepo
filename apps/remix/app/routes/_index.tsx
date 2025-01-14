import type { MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
	return [
		{ title: "Auth Starter for Remix/React-Router" },
		{
			name: "Auth Starter for Remix/React-Router",
			content: "Welcome to Remix Auth!",
		},
	];
};

export default function Index() {
	return (
		<div>
			<h1>Auth Starter for Remix/React-Router</h1>
			<p> Welcome to Remix Auth! </p>
		</div>
	);
}
