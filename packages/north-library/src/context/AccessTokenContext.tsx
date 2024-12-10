"use client";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useLayoutEffect,
} from "react";
import { authClient, publicClient } from "../client";
import { useCsrfToken } from "./CsrfTokenContext";

const AccessTokenContext = createContext<{
	accessToken: string | null;
	setAccessToken: (token: string | null) => void;
}>({
	accessToken: null,
	setAccessToken: () => {},
});

export const useAccessToken = () => useContext(AccessTokenContext);

export const AccessTokenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const { csrfToken } = useCsrfToken(); // Ensure CSRF token is ready
	console.log("Initializing AccessTokenProvider");

	useEffect(() => {
		console.log("Fetching access token...");
		if (!csrfToken) {
			console.log(
				"CSRF Token not available, delaying access token fetch..."
			);
			return;
		}
		// Fetch the Access token on app initialization
		async function fetchAccessToken() {
			try {
				// const response = await fetch("/api/auth/csrf");
				// const data = await response.json();
				const response = await publicClient.post("/auth/refresh");
				setAccessToken(response.data.accessToken);
			} catch (error) {
				setAccessToken(null);
			}
		}

		fetchAccessToken();
	}, [csrfToken]);

	useLayoutEffect(() => {
		console.log("Registering Access Token interceptor...");
		const authInterceptor = authClient.interceptors.request.use(
			(config) => {
				config.headers.Authorization = `Bearer ${accessToken}`;
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		return () => authClient.interceptors.request.eject(authInterceptor);
	}, [accessToken]);

	console.log("Initialized AccessTokenProvider");

	return (
		<AccessTokenContext.Provider value={{ accessToken, setAccessToken }}>
			{children}
		</AccessTokenContext.Provider>
	);
};
