import {
	type RouteConfig,
	index,
	route,
	layout,
	prefix,
} from "@react-router/dev/routes";

export default [
	layout("routes/layout.tsx", [
		// This is the layout that wraps everything
		index("routes/home.tsx"),
		route("/auth/:action/:provider?", "routes/auth.tsx"),

		// Use prefix for /courses, it can be nested inside the layout
		...prefix("/courses", [
			index("routes/courses/index.tsx"),
			route("/create", "routes/courses/create.tsx"),
			// route("/:id", "routes/courses/show.tsx"),
			// route("/:id/edit", "routes/courses/edit.tsx"),
		]),
	]),
    ...prefix("/admin", [
        ...prefix("/dashboard", [
            layout("routes/admin/dashboard/_layout.tsx", [
                index("routes/admin/dashboard/index.tsx"),

                // Dashboard-specific courses routes
                ...prefix("/courses", [
                    index("routes/admin/dashboard/courses/index.tsx"),
                    // route("/create", "routes/dashboard/courses/create.tsx"),
                    // route("/create", "routes/dashboard/courses/create.tsx"),
                    // route("/:id", "routes/dashboard/courses/show.tsx"),
                    // route("/:id/edit", "routes/dashboard/courses/edit.tsx"),
                ]),
            ]),
        ]),
    ]),
] satisfies RouteConfig;
