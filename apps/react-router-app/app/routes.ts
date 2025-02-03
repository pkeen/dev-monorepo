import {
	type RouteConfig,
	index,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/auth/login", "routes/auth/login.tsx"),
	route("/auth/callback/google", "routes/auth/callback/google.tsx"),
	route("/auth/redirect/google", "routes/auth/redirect/google.tsx"),
	route("/auth/redirect/github", "routes/auth/redirect/github.tsx"),
	route("/auth/redirect/zoom", "routes/auth/redirect/zoom.tsx"),
	route("/auth/redirect/microsoft", "routes/auth/redirect/microsoft.tsx"),
	route("/auth/redirect/facebook", "routes/auth/redirect/facebook.tsx"),
] satisfies RouteConfig;
