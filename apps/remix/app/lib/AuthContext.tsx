import { createContext, useContext, useState, useEffect } from "react";
import { User } from "@pete_keen/authentication-core";

interface AuthContextType {
	csrfToken: string | null;
	user: User | null;
	isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
	csrfToken: null,
	user: null,
	isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [isAuthenticated, setIsAuthenticated] = useState(false);

	// Fetch CSRF token and user info on load
	useEffect(() => {
		async function fetchAuthData() {
			try {
				// Fetch CSRF token
				const csrfResponse = await fetch("/auth/csrf");
				const { csrfToken } = await csrfResponse.json();
				setCsrfToken(csrfToken);
				console.log("csrfToken fetched:", csrfToken);

				// Fetch user info

				// LEAVE THIS FOR NOW - COULD ALSO YES FETCH THIS DATA
				// // Fetch user session
				// const sessionResponse = await fetch("/session");
				// const { user, isAuthenticated } = await sessionResponse.json();
				// setUser(user);
				// setIsAuthenticated(isAuthenticated);
			} catch (err) {
				console.error("Failed to load auth data:", err);
			}
		}

		fetchAuthData();
	}, []);

	return (
		<AuthContext.Provider value={{ csrfToken, user, isAuthenticated }}>
			{children}
		</AuthContext.Provider>
	);
}

export function useAuth() {
	return useContext(AuthContext);
}
