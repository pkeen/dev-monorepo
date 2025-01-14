// import Navbar from "~/components/Navbar";
import Navbar from "~/components/NavBar";
import NavMenu from "~/components/NavMenu";
import { Outlet } from "react-router";
import { redirect } from "react-router";
import { Route } from "./+types/_layout";
import { getSessionData } from "@pete_keen/remix-authentication";
import { Container, AppShell } from "@mantine/core";
import HeaderMenu from "~/components/HeaderMenu";
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
		<AppShell header={{ height: 60, offset: true }} padding="md">
			<AppShell.Header>
				<HeaderMenu user={user} />
				{/* <Navbar user={user} /> */}
				{/* <NavMenu user={user} /> */}
			</AppShell.Header>
			<AppShell.Main>
				<Outlet /> {/* Renders child routes */}
			</AppShell.Main>
			{/* Persistent Navbar */}
			{/* <NavMenu user={user} /> */}
			{/* <main className="flex-grow p-4">
				<Container size="xl">
				</Container>
			</main> */}
			<AppShell.Footer>
				© {new Date().getFullYear()} Remix Auth Starter
			</AppShell.Footer>
			{/* <footer className="p-4 text-center text-gray-500">
				<Container size="xl">
					© {new Date().getFullYear()} Remix Auth Starter
				</Container>
			</footer> */}
		</AppShell>
	);
}
