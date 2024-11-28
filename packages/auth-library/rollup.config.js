import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import alias from "@rollup/plugin-alias";
import path from "path";
import { fileURLToPath } from "url";
import commonjs from "@rollup/plugin-commonjs";
import react from "@vitejs/plugin-react";
import json from "@rollup/plugin-json";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
	input: "src/index.ts",
	output: [
		{
			file: "dist/index.esm.js",
			format: "esm",
			sourcemap: true,
		},
		{
			file: "dist/index.cjs.js",
			format: "cjs",
			sourcemap: true,
		},
	],
	plugins: [
		alias({
			entries: [
				{
					find: "@main",
					replacement: path.resolve(__dirname, "src/index.ts"),
				},
				{
					find: "@utils",
					replacement: path.resolve(__dirname, "./src/utils"),
				},
				{
					find: "@components",
					replacement: path.resolve(__dirname, "./src/components"),
				},
				{
					find: "@context",
					replacement: path.resolve(__dirname, "./src/context"),
				},
				{
					find: "@api",
					replacement: path.resolve(__dirname, "./src/api"),
				},
				{
					find: "@db",
					replacement: path.resolve(__dirname, "./src/db"),
				},
				{
					find: "@client",
					replacement: path.resolve(__dirname, "./src/client"),
				},
			],
		}),
		nodeResolve(),
		typescript({
			tsconfig: "./tsconfig.json", // Specify your tsconfig.json
		}),
		commonjs(),
		react(),
		json(),
	],
	external: ["react", "next", "tslib"],
};
