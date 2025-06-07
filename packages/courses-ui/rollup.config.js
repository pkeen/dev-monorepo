import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import preserveDirectives from "rollup-preserve-directives";
import postcss from "rollup-plugin-postcss";
import sass from "sass";
import esbuild from "rollup-plugin-esbuild";

export default defineConfig({
	// input: ["src/index.ts", "src/client/index.ts"],
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
		"next",
		"react-hook-form",
		"@dnd-kit/core",
		"@dnd-kit/sortable",
		"@dnd-kit/utilities",
		"@hookform/resolvers",
		"@radix-ui/react-slot",
		"classnames",
		"clsx",
		"lucide-react",
		"rollup-preserve-directives",
		"tailwind-merge",
		"tailwindcss-animate",
		"typescript",
		"zod",
		"react/jsx-runtime",
	],
	plugins: [
		preserveDirectives(),
		resolve({
			// Prevent bundling node_modules
			preferBuiltins: true,
			// Only bundle source files
			moduleDirectories: ["src"],
		}),
		commonjs(),
		postcss({
			use: sass,
			modules: true,
			extract: true,
		}),
		typescript({
			tsconfig: "./tsconfig.json",
			declaration: true,
			rootDir: "src",
			outDir: "dist",
			jsx: "react-jsx",
		}),
		// esbuild({
		// 	minify: false,
		// 	target: "es2019",
		// 	jsx: "automatic",
		// 	sourceMap: true,
		// }),
	],
});
