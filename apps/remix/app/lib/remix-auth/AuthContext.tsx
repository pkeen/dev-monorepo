// import { createContext, useContext, useState, useEffect } from "react";
// import { User } from "@pete_keen/authentication-core";
// import { getSession } from "~/lib/remix-auth/sessionStorage";

// interface AuthContextType {
// 	csrfToken: string | null;
// 	user: User | null;
// 	authenticated: boolean;
// }

// const AuthContext = createContext<AuthContextType>({
// 	csrfToken: null,
// 	user: null,
// 	authenticated: false,
// });

// export function AuthProvider({
// 	children,
// 	csrfToken,
// 	user,
// 	authenticated,
// }: {
// 	children: React.ReactNode;
// 	csrfToken: string | null;
// 	user: User | null;
// 	authenticated: boolean;
// }) {
// 	// const [csrfToken, setCsrfToken] = useState<string | null>(null);
// 	// const [user, setUser] = useState<User | null>(null);
// 	// const [isAuthenticated, setIsAuthenticated] = useState(false);

// 	// // Fetch CSRF token and user info on load
// 	// useEffect(() => {
// 	// 	async function fetchAuthData() {
// 	// 		try {
// 	// 			// Fetch CSRF token
// 	// 			const csrfResponse = await fetch("/api/auth/csrf");
// 	// 			const { csrfToken } = await csrfResponse.json();
// 	// 			setCsrfToken(csrfToken);
// 	// 			console.log("csrfToken fetched:", csrfToken);

// 	// 			// Fetch user info

// 	// 			// User and Session Data
// 	// 			const session = await fetch("/api/auth/session");
// 	// 			const { user, isAuthenticated } = await session.json();

// 	// 			console.log("session data:", user);
// 	// 			// const { user, isAuthenticated } = await session.json();

// 	// 			// LEAVE THIS FOR NOW - COULD ALSO YES FETCH THIS DATA
// 	// 			// // Fetch user session
// 	// 			// const sessionResponse = await fetch("/session");
// 	// 			// const { user, isAuthenticated } = await sessionResponse.json();
// 	// 			// setUser(user);
// 	// 			// setIsAuthenticated(isAuthenticated);
// 	// 		} catch (err) {
// 	// 			console.error("Failed to load auth data:", err);
// 	// 		}
// 	// 	}

// 	// 	fetchAuthData();
// 	// }, []);

// 	return (
// 		<AuthContext.Provider value={{ csrfToken, user, authenticated }}>
// 			{children}
// 		</AuthContext.Provider>
// 	);
// }

// export function useAuth() {
// 	return useContext(AuthContext);
// }
