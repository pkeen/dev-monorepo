import {
	type RouteConfig,
	index,
	route,
	layout,
} from "@react-router/dev/routes";

export default [
	// index("routes/home.tsx"),
	layout("routes/layout.tsx", [
		index("routes/home.tsx"),
		route("/auth/:action/:provider?", "routes/auth.tsx"),
	]),
] satisfies RouteConfig;
