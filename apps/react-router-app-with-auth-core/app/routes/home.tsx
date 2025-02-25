import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { getSession } from "~/session.server";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "New React Router App" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export const loader = async ({ request }: { request: Request }) => {
	const session = await getSession(request.headers.get("Cookie"));
	const authState = session.get("authState");
	console.log("session: ", authState);
};

export default function Home() {
	return <Welcome />;
}
