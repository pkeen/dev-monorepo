import { withAuth } from "~/auth.server";

export const loader = withAuth(async ({ user }) => {
	// const { user } = await requireAuth(request);
	return { user };
});
