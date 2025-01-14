import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from "react";
const AuthContext = createContext({
    csrf: null,
    authState: {
        user: null,
        authenticated: false,
        keyCards: null,
    },
});
export function AuthProvider({ children, csrf, authState, }) {
    return (_jsx(AuthContext.Provider, { value: { csrf, authState }, children: children }));
}
export function useAuthState() {
    return useContext(AuthContext);
}
