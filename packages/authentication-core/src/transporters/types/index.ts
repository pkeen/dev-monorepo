import { AuthState } from "../../core/types";

export interface TransportAdapter {
	storeAuthState(response: any, authState: AuthState): Promise<void>;
	retrieveAuthState(request: any): Promise<AuthState | null>;
	clearAuthState(response: any): Promise<void>;
	// refreshAuthState?(response: any, authState: AuthState): void;
	// hasAuthState?(request: any): boolean;
}
