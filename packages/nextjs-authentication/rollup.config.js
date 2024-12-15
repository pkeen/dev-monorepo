import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-plugin-preserve-directives";

export default defineConfig({
	input: "src/index.ts",
	output: {
		dir: "dist",
		format: "esm",
		preserveModules: true,
		preserveModulesRoot: "src",
		entryFileNames: "[name].mjs",
	},
	external: [
		"react",
		"react-dom",
		// Ensure all Next.js imports are treated as external
		"next",
		"next/*",
		/^next\/.*/,
		// Add any other dependencies that should be external
	],
	plugins: [
		preserveDirectives(),
		typescript({
			tsconfig: "tsconfig.json",
			declaration: true,
			rootDir: "src",
			outDir: "dist",
			jsx: "react-jsx",
		}),
		resolve({
			// Prevent bundling node_modules
			preferBuiltins: true,
			// Only bundle source files
			moduleDirectories: ["src"],
		}),
		commonjs(),
	],
});
