import { useLoaderData, Form, NavLink } from "react-router";
import { getSession } from "~/lib/remix-auth/sessionStorage";
import { useAuth } from "~/lib/remix-auth/AuthContext";

// // Example loader to check session
// export const loader = async ({ request }: { request: Request }) => {
// 	const session = await getSession(request);
// 	const isAuthenticated = !!session.get("keyCards");
// 	return { isAuthenticated };
// };

// Navbar component
export default function Navbar() {
	// const { isAuthenticated } = useLoaderData();
	const { user, isLoggedIn } = useAuth();

	return (
		<nav className="flex items-center justify-between p-4 bg-gray-800 text-white">
			<div className="flex space-x-4">
				<NavLink to="/" className="hover:text-gray-300">
					Home
				</NavLink>
				<NavLink to="/dashboard" className="hover:text-gray-300">
					Dashboard
				</NavLink>
			</div>

			{/* Show logout button only if authenticated */}
			{isLoggedIn ? (
				<>
					<Form
						method="post"
						action="/auth/logout"
						className="ml-auto"
					>
						<button
							type="submit"
							className="text-red-500 hover:text-red-700"
						>
							Logout
						</button>
					</Form>
					-<p>{user?.email}</p>
				</>
			) : (
				<NavLink
					to="auth/login"
					className="ml-auto hover:text-gray-300"
				>
					Login
				</NavLink>
			)}
		</nav>
	);
}
