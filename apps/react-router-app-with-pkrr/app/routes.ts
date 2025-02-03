import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
	index("routes/home.tsx"),
	route("/auth/:action/:provider?", "routes/auth.tsx"),
] satisfies RouteConfig;
