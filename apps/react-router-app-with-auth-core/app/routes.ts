import {
	type RouteConfig,
	index,
	prefix,
	route,
} from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/auth/login", "routes/auth/login.tsx"),
	route("/auth/redirect/:provider", "routes/auth/redirect.tsx"),
	route("/auth/logout", "routes/auth/logout.tsx"),
	route("/dashboard", "routes/dashboard.tsx"),
] satisfies RouteConfig;
