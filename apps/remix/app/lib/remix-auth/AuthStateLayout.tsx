import { Outlet, LoaderFunctionArgs } from "react-router";
import { withValidation } from "~/auth";
import { AuthProvider } from "@pete_keen/remix-authentication/components";

export const loader = withValidation(async () => null, {
	csrf: true,
});

const parseLoaderData = (data: string | any) => {
	return JSON.parse(data);
};

export function AuthStateProvider({ loaderData }: { loaderData: any }) {
	const { csrf, authState } = parseLoaderData(loaderData);

	return (
		<AuthProvider csrf={csrf} authState={authState}>
			<Outlet />
		</AuthProvider>
	);
}
