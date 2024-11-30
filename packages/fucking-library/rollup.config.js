// // import typescript from "@rollup/plugin-typescript";
// // import { nodeResolve } from "@rollup/plugin-node-resolve";
// // import alias from "@rollup/plugin-alias";
// // import path from "path";
// // import { fileURLToPath } from "url";
// // import commonjs from "@rollup/plugin-commonjs";
// // import react from "@vitejs/plugin-react";
// // import json from "@rollup/plugin-json";
// // // import preserveDirectives from "rollup-plugin-preserve-directives";
// // import preserve from "rollup-plugin-preserve-directives";
// // import nodePolyfills from "rollup-plugin-node-polyfills";
// // // import preserveUseClientDirective from "rollup-plugin-preserve-use-client";

// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);

// // export default {
// // 	input: "src/index.ts",
// // 	external: [
// // 		"react",
// // 		"react-dom",
// // 		"next",
// // 		/^next\//, // Matches all modules starting with `next/`
// // 	],

// // 	output: [
// // 		{
// // 			dir: "dist/esm", // Preserve folder structure for ES modules
// // 			format: "esm",
// // 			sourcemap: true,
// // 			preserveModules: true, // Important for preserving "use client"
// // 			preserveModulesRoot: "src", // Maintain structure from `src`
// // 			exports: "named",
// // 		},
// // 		{
// // 			dir: "dist/cjs", // Output folder for CommonJS
// // 			format: "cjs",
// // 			sourcemap: true,
// // 			preserveModules: true, // Same as above
// // 			preserveModulesRoot: "src",
// // 		},
// // 	],
// // 	plugins: [
// // 		alias({
// // 			entries: [
// // 				{
// // 					find: "axios",
// // 					replacement: "axios/dist/axios.js",
// // 				},
// // 				{
// // 					find: "@main",
// // 					replacement: path.resolve(__dirname, "src/index.ts"),
// // 				},
// // 				{
// // 					find: "@utils",
// // 					replacement: path.resolve(
// // 						__dirname,
// // 						"./src/utils/index.ts"
// // 					),
// // 				},
// // 				{
// // 					find: "@utils/",
// // 					replacement: path.resolve(__dirname, "./src/utils/"),
// // 				},
// // 				{
// // 					find: "@components",
// // 					replacement: path.resolve(__dirname, "./src/components"),
// // 				},
// // 				{
// // 					find: "@context",
// // 					replacement: path.resolve(__dirname, "./src/context"),
// // 				},
// // 				{
// // 					find: "@api",
// // 					replacement: path.resolve(__dirname, "./src/api"),
// // 				},
// // 				{
// // 					find: "@db",
// // 					replacement: path.resolve(__dirname, "./src/db"),
// // 				},
// // 				{
// // 					find: "@client",
// // 					replacement: path.resolve(__dirname, "./src/client"),
// // 				},
// // 				{
// // 					find: "@config",
// // 					replacement: path.resolve(
// // 						__dirname,
// // 						"./src/config/index.ts"
// // 					),
// // 				},
// // 				{
// // 					find: "@config/",
// // 					replacement: path.resolve(__dirname, "./src/config/"),
// // 				},
// // 			],
// // 		}),
// // 		// nodePolyfills(), // Add this to polyfill Node.js modules
// // 		nodeResolve(),
// // 		typescript({
// // 			tsconfig: "./tsconfig.json", // Specify your tsconfig.json
// // 			outputToFilesystem: true,
// // 		}),
// // 		preserve({
// // 			// include: [
// // 			// 	"src/components/**/*.ts",
// // 			// 	"src/components/**/*.tsx",
// // 			// 	"src/context/**/*.ts",
// // 			// 	"src/context/**/*.tsx",
// // 			// ],
// // 			directives: ["use client"],
// // 		}),
// // 		commonjs(),
// // 		react(),
// // 		json(),
// // 		// preserveUseClientDirective(),
// // 		// preserveDirectives(),
// // 	],
// // };

// import copy from "rollup-plugin-copy";

// import { createRequire } from "module";
// const require = createRequire(import.meta.url);

// import typescript from "@rollup/plugin-typescript";
// import { nodeResolve } from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import alias from "@rollup/plugin-alias";
// import path from "path";
// import json from "@rollup/plugin-json";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// export default {
// 	input: "src/index.ts", // Entry point for the library
// 	output: [
// 		{
// 			dir: "dist/esm", // ES module output
// 			format: "esm",
// 			preserveModules: true, // Keep file structure intact
// 			preserveModulesRoot: "src", // Maintain structure from `src`
// 			sourcemap: true, // Enable source maps
// 			exports: "named",
// 		},
// 		{
// 			dir: "dist/cjs", // CommonJS output
// 			format: "cjs",
// 			preserveModules: true,
// 			preserveModulesRoot: "src",
// 			sourcemap: true,
// 		},
// 	],
// 	plugins: [
// 		nodeResolve(), // Resolve dependencies
// 		commonjs(), // Convert CommonJS to ES modules
// 		typescript({
// 			tsconfig: "./tsconfig.json",
// 			// declaration: true, // Emit declaration files
// 			// declarationMap: true, // Emit source maps for declaration files
// 			// rootDir: "src", // Ensure TypeScript knows where the sources are
// 			// outDir: "./dist/ts", // Match the outDir in tsconfig.json
// 			// exclude: ["node_modules", "dist"], // Exclude unnecessary files
// 		}), // Use your TypeScript config
// 		copy({
// 			targets: [
// 				{ src: "dist/tmp/**/*.d.ts", dest: "dist/esm" },
// 				{ src: "dist/tmp/**/*.d.ts", dest: "dist/cjs" },
// 			],
// 			hook: "writeBundle", // Copy after Rollup writes output
// 		}),
// 		alias({
// 			entries: [
				// {
				// 	find: "@main",
				// 	replacement: path.resolve(__dirname, "src/index.ts"),
				// },
				// {
				// 	find: "@utils",
				// 	replacement: path.resolve(
				// 		__dirname,
				// 		"./src/utils/index.ts"
				// 	),
				// },
				// {
				// 	find: "@utils/",
				// 	replacement: path.resolve(__dirname, "./src/utils/"),
				// },
				// {
				// 	find: "@components",
				// 	replacement: path.resolve(__dirname, "./src/components"),
				// },
				// {
				// 	find: "@context",
				// 	replacement: path.resolve(__dirname, "./src/context"),
				// },
				// {
				// 	find: "@api",
				// 	replacement: path.resolve(__dirname, "./src/api"),
				// },
				// {
				// 	find: "@db",
				// 	replacement: path.resolve(__dirname, "./src/db"),
				// },
				// {
				// 	find: "@client",
				// 	replacement: path.resolve(__dirname, "./src/client"),
				// },
				// {
				// 	find: "@config",
				// 	replacement: path.resolve(
				// 		__dirname,
				// 		"./src/config/index.ts"
				// 	),
				// },
				// {
				// 	find: "@config/",
				// 	replacement: path.resolve(__dirname, "./src/config/"),
				// },

// 				// Add more aliases as needed
// 			],
// 		}),
// 		json(), // Handle JSON imports if needed
// 	],
// 	external: [
// 		"react",
// 		"react-dom",
// 		/^next\//, // Treat all Next.js modules as external
// 		...Object.keys(require("./package.json").dependencies || {}), // Mark all dependencies as external
// 	],
// };
