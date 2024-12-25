import { defineConfig } from "vite";
import { reactRouter } from "@react-router/dev/vite"; // React Router plugin
import tsconfigPaths from "vite-tsconfig-paths"; // Handles TypeScript path aliases

export default defineConfig({
	plugins: [
		reactRouter(), // React Router-specific plugin for Vite
		tsconfigPaths(), // Supports paths in tsconfig.json
	],
});
