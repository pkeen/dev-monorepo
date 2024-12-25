// "use server";
import { SessionStateStorage } from "@pete_keen/authentication-core";
import { NextSessionStateStorage } from "session-state-storage/NextSessionStateStorage";
import { AuthSystem, AuthConfig } from "@pete_keen/authentication-core";
// import {
// 	createLogoutAction,
// 	createLoginAction,
// 	createSignupAction,
// } from "./action-factory";
// import { login } from "./actions/login";
export * from "./actions";
export * from "./session-state-storage";
export { login } from "./actions/login";

export function NextAuthentication(
	config: AuthConfig,
	sessionStateStorage?: SessionStateStorage
) {
	if (!sessionStateStorage) {
		sessionStateStorage = new NextSessionStateStorage();
	}

	const authSystem = AuthSystem.create({
		...config,
	});

	// const logout = createLogoutAction(authSystem, sessionStateStorage);
	// const login = createLoginAction(authSystem, sessionStateStorage);
	// const signup = createSignupAction(authSystem, sessionStateStorage);

	return {
		authSystem,
		sessionStateStorage,
		// logout,
		// signup,
		// login,
		// also the actions and route handlers
		// handlers
		// signIn
		// signOut
	};
}
