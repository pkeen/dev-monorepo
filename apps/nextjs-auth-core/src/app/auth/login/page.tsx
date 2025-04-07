// import { authManager } from "@/auth";
// import type { DisplayProvider } from "@pete_keen/authentication-core";
import { getProviders } from "@/app/auth/login/getProviders";
// import type { DisplayProvider } from "@pete_keen/authentication-core";
import LoginForm from "@/app/auth/login/login";

export default async function Login() {
	const providers = await getProviders();
	return <LoginForm providers={providers} />;
}
