"use client";

import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	Dispatch,
	SetStateAction,
	useLayoutEffect,
} from "react";

import { publicClient } from "@client/publicClient";

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

export const CsrfTokenProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	console.log("Initializing CsrfTokenProvider");

	const [csrfToken, setCsrfToken] = useState<string | null>(null);

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

	console.log("Initialized CsrfTokenProvider");
	return (
		<CsrfTokenContext.Provider value={{ csrfToken, setCsrfToken }}>
			{children}
		</CsrfTokenContext.Provider>
	);
};
