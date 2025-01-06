import { useAuth } from "~/lib/remix-auth/AuthContext";

export const CsrfHidden = () => {
	const { csrfToken } = useAuth();
	return <input type="hidden" name="csrfToken" value={csrfToken || ""} />;
};
