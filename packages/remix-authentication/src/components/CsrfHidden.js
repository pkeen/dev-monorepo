import { jsx as _jsx } from "react/jsx-runtime";
import { useAuthState } from "./AuthContext";
export const CsrfHidden = () => {
    const { csrf } = useAuthState();
    return _jsx("input", { type: "hidden", name: "csrfToken", value: csrf || "" });
};
