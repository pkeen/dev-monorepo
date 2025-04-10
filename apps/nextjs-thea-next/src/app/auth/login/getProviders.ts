import { authManager } from "@/auth";

export async function getProviders() {
	const providers = authManager.listProviders();
	return providers;
}
