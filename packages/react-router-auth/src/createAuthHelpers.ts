import { IAuthManager, User } from "@pete_keen/authentication-core";
import {
	ActionFunctionArgs,
	LoaderFunctionArgs,
	SessionStorage,
	redirect,
} from "react-router";

export function createAuthHelpers<Extra>(
	authManager: IAuthManager<Extra>,
	s: SessionStorage
) {
	type EnrichedUser = User & Extra;

	/**
	 * This function will check authentication and return the User and headers
	 * The headers are there to be appended to the response to update the cookies
	 * @param request
	 * @param { redirectTo?: string } options
	 * @returns { user: EnrichedUser | null; headers?: Headers }
	 */
	const requireAuth = async (
		request: Request,
		options: { redirectTo?: string } = {}
	): Promise<{ user: EnrichedUser | null; headers?: Headers }> => {
		const session = await s.getSession(request.headers.get("Cookie"));
		const sessionState = session.get("authState");

		if (!sessionState) {
			if (options.redirectTo) throw redirect(options.redirectTo);
			return { user: null };
		}

		const authResult = await authManager.validate(sessionState.keyCards!);

		if (authResult.type === "error" || authResult.type === "redirect") {
			if (options.redirectTo) throw redirect(options.redirectTo);
			return { user: null };
		} else if (authResult.type === "refresh") {
			const headers = new Headers();
			session.set("authState", authResult.authState);
			headers.append("Set-Cookie", await s.commitSession(session));
			return { user: authResult.authState.user, headers };
		}

		return { user: authResult.authState.user };
	};

	/**
	 * this function is a wrapper to check authorization
	 * TODO: add an options object argument used to set the redirect url, check vs roles, permissions etc
	 * I still feel theres going to be some problems with this, so far and may need adjusting
	 * @param handler
	 * @returns Response.json({ ...result, user })
	 */
	const withAuth = <T>(
		handler: (
			args: (LoaderFunctionArgs | ActionFunctionArgs) & {
				user: EnrichedUser;
			}
		) => Promise<T>,
		options: { redirectTo?: string } = { redirectTo: "/" }
	) => {
		return async (args: LoaderFunctionArgs | ActionFunctionArgs) => {
			const { request } = args;
			const { user, headers } = await requireAuth(request, {
				redirectTo: options.redirectTo,
			});

			if (!user) {
				if (options.redirectTo) {
					throw redirect(options.redirectTo);
				}
				return Response.json({ user }, { headers });
			}

			const result = await handler({ ...args, user });

			// Support returning headers (e.g. refreshed session cookies)
			if (result instanceof Response) {
				for (let [key, value] of headers?.entries() || []) {
					result.headers.append(key, value);
				}
				return result;
			}

			return Response.json({ ...result, user }, { headers });
		};
	};

	return { requireAuth, withAuth };
}
