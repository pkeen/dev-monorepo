import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";

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
				{ find: "@main", replacement: "./src/index.ts" },
				{ find: "@utils", replacement: "./src/utils" },
				{ find: "@components", replacement: "./src/components" },
				{ find: "@context", replacement: "./src/context" },
				{ find: "@api", replacement: "./src/api" },
				{ find: "@db", replacement: "./src/db" },
				{ find: "client", replacement: "./src/client" },
			],
		}),
		nodeResolve(),
		typescript(),
	],
	external: ["react", "next"],
};
