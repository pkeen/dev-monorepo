import { useAuth } from "./AuthContext";

// TODO: Is this necessary?

export function fetchWithAuth(url: string, options: RequestInit = {}) {
	const { csrfToken } = useAuth();

	// Default headers
	const defaultHeaders = {
		"Content-Type": "application/json",
	};

	// Add CSRF token to headers for non-safe methods
	const authHeaders =
		options.method &&
		!["GET", "HEAD", "OPTIONS"].includes(options.method.toUpperCase())
			? { "X-CSRF-Token": csrfToken ?? "" }
			: {};

	// Merge headers
	const headers = {
		...defaultHeaders,
		...authHeaders,
		...options.headers,
	};

	// Return fetch call with merged options
	return fetch(url, { ...options, headers });
}
