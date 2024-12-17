import { KeyCard, KeyCards } from "../types";

export interface SessionStateStorage {
	store(keyCards: KeyCards, response?: any): Promise<void>;
	retrieve(request?: any): Promise<KeyCards | null>;
	clear(response?: any): Promise<void>;
	// create(key: string, value: string, response?: any): Promise<void>;
}
