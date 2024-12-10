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
		/@pete_keen\/.*/, // If you have other workspace packages
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

// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
// import { defineConfig } from "rollup";
// import preserveDirectives from "rollup-plugin-preserve-directives";

// export default defineConfig({
// 	input: "src/index.ts",
// 	output: {
// 		dir: "dist",
// 		format: "esm",
// 		preserveModules: true,
// 		preserveModulesRoot: "src",
// 		entryFileNames: "[name].mjs",
// 	},
// 	external: ["react", "react-dom", "next"],
// 	plugins: [
// 		// The order of these plugins matters
// 		preserveDirectives(),
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 			declaration: true,
// 			rootDir: "src",
// 			outDir: "dist",
// 			jsx: "react-jsx", // Override the tsconfig jsx setting
// 		}),
// 		resolve(),
// 		commonjs(),
// 	],
// });
// // packages/ui/rollup.config.js
// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
// import { defineConfig } from "rollup";
// // import preserve from "rollup-plugin-preserve-directives";
// import preserveDirectives from "rollup-plugin-preserve-directives";

// export default defineConfig({
// 	input: "src/index.ts",
// 	// dir: "dist",
// 	output: {
// 		dir: "dist",
// 		format: "esm",
// 		preserveModules: true,
// 		preserveModulesRoot: "src",
// 		entryFileNames: "[name].mjs",
// 	},
// 	// output: [
// 	// 	{
// 	// 		dir: "dist/cjs",
// 	// 		format: "cjs",
// 	// 		sourcemap: true,
// 	// 		preserveModules: true,
// 	// 	},
// 	// 	{
// 	// 		dir: "dist/esm",
// 	// 		format: "es",
// 	// 		sourcemap: true,
// 	// 		preserveModules: true,
// 	// 	},
// 	// ],
// 	external: ["react", "react-dom", "next", /^next\//],
// 	plugins: [
// 		resolve(),
// 		commonjs(),
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 			declaration: true,
// 			declarationDir: "dist",
// 			rootDir: "src",
// 			outDir: "dist",
// 		}),
// 		preserveDirectives(),
// 		// preserve({
// 		// 	directives: ["use client", "use server"],
// 		// }),
// 	],
// });

// export default defineConfig([
// 	// ESM build
// 	{
// 		input: "src/index.ts",
// 		output: {
// 			dir: "dist/esm",
// 			format: "esm",
// 			preserveModules: true,
// 			preserveModulesRoot: "src",
// 			entryFileNames: "[name].mjs",
// 		},
// 		external: ["react", "react-dom"],
// 		plugins: [
// 			resolve(),
// 			commonjs(),
// 			typescript({
// 				tsconfig: "tsconfig.json",
// 				declaration: true,
// 				declarationDir: "dist/types",
// 				rootDir: "src",
// 				outDir: "dist/esm",
// 			}),
// 			preserve({
// 				directives: ["use client"],
// 			}),
// 		],
// 	},
// 	// CJS build
// 	{
// 		input: "src/index.ts",
// 		output: {
// 			dir: "dist/cjs",
// 			format: "cjs",
// 			preserveModules: true,
// 			preserveModulesRoot: "src",
// 			entryFileNames: "[name].js",
// 		},
// 		external: ["react", "react-dom"],
// 		plugins: [
// 			resolve(),
// 			commonjs(),
// 			typescript({
// 				tsconfig: "tsconfig.json",
// 				declaration: false,
// 				rootDir: "src",
// 				outDir: "dist/cjs",
// 			}),
// 			preserve({
// 				directives: ["use client"],
// 			}),
// 		],
// 	},
// ]);

// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
// import { defineConfig } from "rollup";
// import preserveDirectives from "rollup-plugin-preserve-directives";

// // ESM build with types
// const esmConfig = {
// 	input: "src/index.ts",
// 	output: {
// 		dir: "dist/esm",
// 		format: "esm",
// 		preserveModules: true,
// 		preserveModulesRoot: "src",
// 		entryFileNames: "[name].mjs",
// 	},
// 	external: ["react", "react-dom"],
// 	plugins: [
// 		resolve(),
// 		commonjs(),
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 			outDir: "dist/esm",
// 			declaration: true,
// 			declarationDir: "dist/esm", // Keep declarations with ESM output
// 			rootDir: "src",
// 		}),
// 		preserveDirectives(),
// 	],
// };

// // CJS build without types
// const cjsConfig = {
// 	input: "src/index.ts",
// 	output: {
// 		dir: "dist/cjs",
// 		format: "cjs",
// 		preserveModules: true,
// 		preserveModulesRoot: "src",
// 		entryFileNames: "[name].js",
// 	},
// 	external: ["react", "react-dom"],
// 	plugins: [
// 		resolve(),
// 		commonjs(),
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 			outDir: "dist/cjs",
// 			declaration: false,
// 			rootDir: "src",
// 		}),
// 		preserveDirectives(),
// 	],
// };

// export default defineConfig([esmConfig, cjsConfig]);

// import resolve from "@rollup/plugin-node-resolve";
// import commonjs from "@rollup/plugin-commonjs";
// import typescript from "@rollup/plugin-typescript";
// import { defineConfig } from "rollup";
// import preserveDirectives from "rollup-plugin-preserve-directives";

// export default defineConfig({
// 	input: "src/index.ts",
// 	output: {
// 		dir: "dist",
// 		format: "esm",
// 		preserveModules: true,
// 		preserveModulesRoot: "src",
// 		entryFileNames: "[name].mjs",
// 	},
// 	external: ["react", "react-dom"],
// 	plugins: [
// 		resolve(),
// 		commonjs(),
// 		typescript({
// 			tsconfig: "tsconfig.json",
// 			declaration: true,
// 			rootDir: "src",
// 			outDir: "dist",
// 		}),
// 		preserveDirectives(),
// 	],
// });
