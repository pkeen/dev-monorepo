import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { Jumbo } from "./home/home";

export function meta({}: Route.MetaArgs) {
	return [
		{ title: "Birth to Seven Matters" },
		{ name: "description", content: "Welcome to React Router!" },
	];
}

export default function Home() {
	return <Jumbo />;
}
