import Navbar from "~/components/Navbar";
import { Outlet } from "react-router";

export default function Layout() {
	return (
		<div className="flex flex-col min-h-screen">
			{/* Persistent Navbar */}
			<Navbar />
			<main className="flex-grow p-4">
				<Outlet /> {/* Renders child routes */}
			</main>
			<footer className="p-4 text-center text-gray-500">
				© {new Date().getFullYear()} My Remix App
			</footer>
		</div>
	);
}
