import axios from "axios";

export const authClient = axios.create({
	baseURL: "/api",
	// baseURL: "https://localhost:3000/api",
	timeout: 10000, // Timeout in milliseconds
	headers: { "Content-Type": "application/json" },
});
