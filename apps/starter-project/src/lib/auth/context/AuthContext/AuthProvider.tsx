// import { CsrfTokenProvider } from "./CsrfTokenContext";
// import { AccessTokenProvider } from "./AccessTokenContext";
"use client";
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useLayoutEffect,
} from "react";
import { authClient, publicClient } from "@/lib/auth/utils";

const AccessTokenContext = createContext<{
	accessToken: string | null;
	setAccessToken: (token: string | null) => void;
}>({
	accessToken: null,
	setAccessToken: () => {},
});

export const useAccessToken = () => useContext(AccessTokenContext);

interface CsrfTokenContextType {
	csrfToken: string | null;
	setCsrfToken: Dispatch<SetStateAction<string | null>>;
}

const CsrfTokenContext = createContext<{
	csrfToken: string | null;
	setCsrfToken: (token: string | null) => void;
}>({
	csrfToken: null,
	setCsrfToken: () => {},
});

export const useCsrfToken = () => {
	const context = useContext(CsrfTokenContext);
	if (!context) {
		throw new Error("useCsrfToken must be used within a CsrfTokenProvider");
	}
	return context;
};

// export const CsrfTokenProvider: React.FC<{ children: React.ReactNode }> = ({
// 	children,
// }) => {
// 	console.log("Initializing CsrfTokenProvider");

// 	const [csrfToken, setCsrfToken] = useState<string | null>(null);

// 	useEffect(() => {
// 		console.log("CSRF use Effect hook triggered");
// 		// Fetch the CSRF token on app initialization
// 		async function fetchCsrfToken() {
// 			const response = await fetch("/api/auth/csrf");
// 			const data = await response.json();
// 			// const response = await publicClient.get("/auth/csrf");
// 			setCsrfToken(data.csrf);
// 		}
// 		fetchCsrfToken();
// 	}, []);

// 	useLayoutEffect(() => {
// 		console.log("CSRF useLayout hook triggered");
// 		const publicInterceptor = publicClient.interceptors.request.use(
// 			(config) => {
// 				console.log("CSRF Token in Interceptor:", csrfToken); // Log the token
// 				config.headers["csrf-token"] = csrfToken;
// 				return config;
// 			},
// 			(error) => {
// 				return Promise.reject(error);
// 			}
// 		);
// 		console.log("CSRF Interceptor Registered:", publicInterceptor);
// 		return () => publicClient.interceptors.request.eject(publicInterceptor);
// 	}, [csrfToken]);

// 	console.log("Initialized CsrfTokenProvider");
// 	return (
// 		<CsrfTokenContext.Provider value={{ csrfToken, setCsrfToken }}>
// 			{children}
// 		</CsrfTokenContext.Provider>
// 	);
// };

export default function AuthProvider({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	console.log("Initializing CsrfTokenProvider");

	const [csrfToken, setCsrfToken] = useState<string | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);

	useEffect(() => {
		console.log("CSRF use Effect hook triggered");
		// Fetch the CSRF token on app initialization
		async function fetchCsrfToken() {
			const response = await fetch("/api/auth/csrf");
			const data = await response.json();
			// const response = await publicClient.get("/auth/csrf");
			setCsrfToken(data.csrf);
		}
		fetchCsrfToken();
	}, []);

	useLayoutEffect(() => {
		console.log("CSRF useLayout hook triggered");
		const publicInterceptor = publicClient.interceptors.request.use(
			(config) => {
				console.log("CSRF Token in Interceptor:", csrfToken); // Log the token
				config.headers["csrf-token"] = csrfToken;
				return config;
			},
			(error) => {
				return Promise.reject(error);
			}
		);
		console.log("CSRF Interceptor Registered:", publicInterceptor);
		return () => publicClient.interceptors.request.eject(publicInterceptor);
	}, [csrfToken]);

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
			console.log("Fetching access token...");
			try {
				// const response = await fetch("/api/auth/csrf");
				// const data = await response.json();
				const response = await publicClient.post("/auth/refresh");
				console.log("Access Token Response:", response);
				setAccessToken(response.data.accessToken);
			} catch (error) {
				console.log("Error fetching access token:", error);
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

	return (
		<CsrfTokenContext.Provider value={{ csrfToken, setCsrfToken }}>
			<AccessTokenContext.Provider
				value={{ accessToken, setAccessToken }}
			>
				{children}
			</AccessTokenContext.Provider>
		</CsrfTokenContext.Provider>
	);
}
