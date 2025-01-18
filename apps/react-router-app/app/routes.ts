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
] satisfies RouteConfig;
