import { useAuth } from "~/lib/remix-auth/AuthContext";

export const CsrfHidden = () => {
	const { csrfToken } = useAuth();
	console.log("CsrfHidden: ", csrfToken);
	return <input type="hidden" name="csrfToken" value={csrfToken || ""} />;
};
