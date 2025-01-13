import { Outlet, LoaderFunctionArgs, useLoaderData } from "react-router";
// import { withValidation, authLoader } from "~/auth";
// import { AuthProvider } from "@pete_keen/remix-authentication/components";
import { AuthProvider } from "@pete_keen/remix-authentication/client";
import type { WithValidationHandlerArgs } from "@pete_keen/remix-authentication";

// const loaderHandler = async (args: WithValidationHandlerArgs) => {
// 	console.log("AUTH STATE LOADER SUCCESSS");
// 	return "hello";
// };
// export const loader = withValidation<string>(loaderHandler, {
// 	csrf: true,
// });

// export const loader = authLoader;
export { authLoader as loader } from "~/auth";

const parseLoaderData = (data: string | any) => {
	return JSON.parse(data);
};

export default function AuthStateProvider({
	loaderData,
}: {
	loaderData: string | any;
}) {
	// console.log("AuthStateProvider - loaderData: ", loaderData);
	const { csrf, authState } = parseLoaderData(loaderData);

	return (
		<AuthProvider csrf={csrf} authState={authState}>
			<Outlet />
		</AuthProvider>
	);
}

// // Add this default export
// export default function AuthStateLayout() {
// 	const data = useLoaderData();
// 	return <AuthStateProvider loaderData={data} />;
// }
