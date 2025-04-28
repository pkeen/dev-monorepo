"use server";
import { thia, userRegistry } from "@/auth";
import { rbac } from "@/authz";
import { cookies } from "next/headers";
import { thiaSessionCookie } from "@pete_keen/thia-next";

type FormValues = {
	name?: string;
	email?: string;
	roleId?: string | null;
};

export const updateUserAndRole = async (userId: string, data: FormValues) => {
	// if (!userRegistry) {
	// 	throw new Error("User registry not found");
	// }
	// TODO: authz check
	const user = await thia();
	// if (!user || user.role.key !== "admin") {
	// 	throw new Error("Unauthorized");
	// }

	await userRegistry.updateUser({
		id: userId,
		name: data.name,
		email: data.email,
	});

	if (data.roleId) {
		await rbac.updateUserRoleById(userId, data.roleId);
	}

	// if editing self refresh session
	if (user?.email === data.email) {
		const session = await thiaSessionCookie.get();
		if (!session) {
			throw new Error("Session not found");
		}
		console.log("session", session);
		session.keyCards[0].value = "";
		console.log("session after", session);
		const cookieStore = await cookies();
		cookieStore.set(thiaSessionCookie.name, JSON.stringify(session));
	}
};
