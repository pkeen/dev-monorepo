"use client";
// import { logout } from "./actions/logout";
import { logout } from "./functions/logout";
import { useActionState } from "react";

const LogoutButton = ({ children }: { children: React.ReactNode }) => {
	// const [state, action, isPending] = useActionState(
	// 	logout.bind(null, { redirectTo: "/" }),
	// 	undefined
	// );
	return (
		// <form action={action}>
		<button onClick={() => logout({ redirectTo: "/" })}>{children}</button>
		// </form>
	);
};

export default LogoutButton;
