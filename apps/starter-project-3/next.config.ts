import type { NextConfig } from "next";
import withTM from "next-transpile-modules";

// Add the name of your package(s) here
const withTranspilation = withTM(["@pete_keen/north"]);

const nextConfig: NextConfig = {
	/* config options here */
	eslint: {
		ignoreDuringBuilds: true,
	},
};

// export default withTranspilation(nextConfig);
export default nextConfig;
