import { Form, NavLink } from "react-router";
import { useAuthState } from "@pete_keen/remix-authentication/components";

// Navbar component
export default function Navbar() {
	const {
		authState: { user, authenticated },
	} = useAuthState();

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
			{authenticated ? (
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
					-<p>{user.email}</p>
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
