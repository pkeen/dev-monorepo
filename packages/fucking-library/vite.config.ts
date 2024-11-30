// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import dts from "vite-plugin-dts";
// import path from "path";
// import cryptobrowserify from "crypto-browserify";

// export default defineConfig({
// 	plugins: [
// 		react(), // For React support
// 		dts({
// 			// tsConfigFilePath: "./tsconfig.json", // Use your TypeScript config
// 			tsconfigPath: "./tsconfig.json",
// 			outDir: "dist/types",
// 			// outputDir: "dist/types", // Generate declaration files here
// 			insertTypesEntry: true, // Create `types` entry in package.json
// 		}),
// 	],
// 	resolve: {
// 		alias: {
// 			"@main": path.resolve(__dirname, "src/index.ts"),
// 			"@utils": path.resolve(__dirname, "./src/utils/index.ts"),
// 			"@utils/": path.resolve(__dirname, "./src/utils/"),
// 			"@components": path.resolve(__dirname, "./src/components"),
// 			"@context": path.resolve(__dirname, "./src/context"),
// 			"@api": path.resolve(__dirname, "./src/api"),
// 			"@db": path.resolve(__dirname, "./src/db"),
// 			"@client": path.resolve(__dirname, "./src/client"),
// 			"@config": path.resolve(__dirname, "./src/config/index.ts"),
// 			"@config/": path.resolve(__dirname, "./src/config/"),
// 			"@actions": path.resolve(__dirname, "./src/actions/"),
// 			crypto: "crypto-browserify",
// 		},
// 	},
// 	build: {
// 		lib: {
// 			entry: "src/index.ts", // Your library entry point
// 			name: "Fuck Off", // Global variable name (if needed for UMD/IIFE builds)
// 			formats: ["es", "cjs"], // Build ESM and CJS outputs
// 			fileName: (format) => `fo.${format}.js`, // Output file name pattern
// 		},
// 		rollupOptions: {
// 			external: [
// 				"react",
// 				"react-dom",
// 				/^@?node:/, // Exclude Node.js built-in modules
// 				/^next\//, // Exclude Next.js modules
// 				/^node_modules/, // Exclude everything from `node_modules`
// 			],
// 			output: {
// 				// preserveModules: true,
// 				// preserveModulesRoot: "src",
// 				// entryFileNames: "[name].js", // File name pattern
// 				// dir: "dist", // Output directory
// 				// Important for preserving individual file paths
// 				// dir: "dist", // Output directory for compiled files
// 				// entryFileNames: "[name].js", // File name pattern
// 				globals: {
// 					react: "React",
// 					"react-dom": "ReactDOM",
// 				},
// 			},
// 		},
// 	},
// });

// import { defineConfig } from "vite";
// import react from "@vitejs/plugin-react";
// import dts from "vite-plugin-dts";
// import path from "path";

// export default defineConfig({
// 	plugins: [
// 		react(),
// 		dts({
// 			insertTypesEntry: true, // Ensures `types` entry is added to package.json
// 			tsconfigPath: "./tsconfig.json",
// 			outDir: "dist/types", // Types output directory
// 		}),
// 	],
// 	resolve: {
// 		alias: {
// 			"@main": path.resolve(__dirname, "src/index.ts"),
// 			"@utils": path.resolve(__dirname, "./src/utils/index.ts"),
// 			"@utils/": path.resolve(__dirname, "./src/utils/"),
// 			"@components": path.resolve(__dirname, "./src/components"),
// 			"@context": path.resolve(__dirname, "./src/context"),
// 			"@api": path.resolve(__dirname, "./src/api"),
// 			"@db": path.resolve(__dirname, "./src/db"),
// 			"@client": path.resolve(__dirname, "./src/client"),
// 			"@config": path.resolve(__dirname, "./src/config/index.ts"),
// 			"@config/": path.resolve(__dirname, "./src/config/"),
// 			"@actions": path.resolve(__dirname, "./src/actions/"),
// 			crypto: "crypto-browserify",
// 		},
// 	},
// 	build: {
// 		lib: {
// 			entry: "src/index.ts", // Your library's main entry
// 			name: "MyLibrary", // Global variable name for UMD/IIFE
// 			formats: ["es", "cjs"], // Build both ES and CJS
// 			fileName: (format) => `${format}/index.js`, // Organize by format
// 		},
// 		rollupOptions: {
// 			external: [
// 				"react",
// 				"react-dom",
// 				/^@?node:/, // Exclude Node.js built-ins
// 			],
// 			output: {
// 				preserveModules: true, // Preserve module structure
// 				preserveModulesRoot: "src", // Keep `src/` structure in `dist/`
// 				entryFileNames: "[name].js", // File naming convention
// 				dir: "dist", // Output directory
// 				globals: {
// 					react: "React",
// 					"react-dom": "ReactDOM",
// 				},
// 			},
// 		},
// 	},
// });

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";
import path from "path";

export default defineConfig({
	plugins: [
		react(),
		dts({
			insertTypesEntry: true,
			tsconfigPath: "./tsconfig.json",
			outDir: "dist/types",
		}),
	],
	resolve: {
		alias: {
			"@main": path.resolve(__dirname, "src/index.ts"),
			"@utils": path.resolve(__dirname, "./src/utils/index.ts"),
			"@utils/": path.resolve(__dirname, "./src/utils/"),
			"@components": path.resolve(__dirname, "./src/components"),
			"@context": path.resolve(__dirname, "./src/context"),
			"@api": path.resolve(__dirname, "./src/api"),
			"@db": path.resolve(__dirname, "./src/db"),
			"@client": path.resolve(__dirname, "./src/client"),
			"@config": path.resolve(__dirname, "./src/config/index.ts"),
			"@config/": path.resolve(__dirname, "./src/config/"),
			"@actions": path.resolve(__dirname, "./src/actions/"),
			crypto: "crypto-browserify",
		},
	},
	build: {
		lib: {
			entry: "src/index.ts",
			name: "MyLibrary",
			formats: ["es", "cjs"],
			fileName: (format) => `index.js`, // Remove format from filename
		},
		rollupOptions: {
			external: ["react", "react-dom", /^@?node:/],
			output: [
				{
					format: "es",
					dir: "dist/es",
					preserveModules: true,
					preserveModulesRoot: "src",
					entryFileNames: "[name].js",
				},
				{
					format: "cjs",
					dir: "dist/cjs",
					preserveModules: true,
					preserveModulesRoot: "src",
					entryFileNames: "[name].js",
				},
			],
		},
	},
});