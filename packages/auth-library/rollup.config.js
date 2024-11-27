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
	plugins: [nodeResolve(), typescript()],
	external: ["react", "next"],
};
