// import Navbar from "~/components/Navbar";
import Navbar from "~/components/NavBar";
import NavMenu from "~/components/NavMenu";
import { Outlet } from "react-router";
import { redirect } from "react-router";
import { Route } from "./+types/_layout";
import { getSessionData } from "@pete_keen/remix-authentication";
// import { useAuth } from "~/lib/remix-auth/AuthContext";

export const loader = async ({ request }: Route.LoaderArgs) => {
	// import here instead
	// const { getSessionData } = await import(
	// 	"@pete_keen/remix-authentication/server"
	// );
	// const user = {
	// 	id: "1",
	// 	email: "pkeen7@gmail.com",
	// };
	const { user, authenticated } = await getSessionData(request);
	console.log("layout loader - user: ", user);
	// if (!user) {
	// 	return redirect("/auth/login");
	// }
	return { user };
};

export default function Layout({ loaderData }: Route.ComponentProps) {
	const { user } = loaderData;
	// const { user } = useAuth();
	return (
		<div className="flex flex-col min-h-screen">
			{/* Persistent Navbar */}
			<NavMenu user={user} />
			<Navbar user={user} />
			<main className="flex-grow p-4">
				<Outlet /> {/* Renders child routes */}
			</main>
			<footer className="p-4 text-center text-gray-500">
				© {new Date().getFullYear()} My Remix App
			</footer>
		</div>
	);
}
