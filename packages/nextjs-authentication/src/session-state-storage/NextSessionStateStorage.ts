import {
	SessionStateStorage,
	SessionState,
	CookieOptions,
	SessionElements,
	SessionElement,
	KeyCards,
	KeyCard,
} from "@pete_keen/authentication-core";
import { cookies } from "next/headers";

export class NextSessionStateStorage implements SessionStateStorage {
	// these options for sure will need to be not hard coded here
	private options: CookieOptions = {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		path: "/",
		maxAge: 3600,
		sameSite: "lax",
	};
	constructor(options?: CookieOptions) {
		if (options) {
			this.options = options;
		}
	}

	async store(keyCards: KeyCards, _response?: any): Promise<void> {
		const cookieStore = await cookies(); // Await the promise to get the cookies object
		keyCards.forEach((keyCard: KeyCard) => {
			// Ensure all required fields are present
			if (!keyCard.name || !keyCard.value) {
				throw new Error(
					`Missing required fields in sessionElement: ${JSON.stringify(
						keyCard
					)}`
				);
			}
			console.log("keyCard.name", keyCard.name);

			cookieStore.set(
				keyCard.name, // Ensure name is a string
				keyCard.value, // Ensure value is a string
				keyCard.storageOptions // Must match Partial<ResponseCookie>
			);
		});
	}

	async retrieve(_request: any): Promise<KeyCards | null> {
		const cookieStore = await cookies();
		const keyCards: KeyCards = [];

		// console.log("cookieStore", cookieStore);

		Object.entries(cookieStore.getAll()).forEach(([name, value]) => {
			console.log("name ===", name);
			console.log("value ===", value);
			// Filter only cookies that start with 'KeyCard'
			if (value.name.startsWith("KeyCard")) {
				const keyCardName = value.name.replace("KeyCard-", ""); // Strip the prefix if needed
				keyCards.push({
					name: keyCardName,
					value: value.value,
					type: undefined, // Optionally map type if you have additional logic
					storageOptions: {}, // Leave empty or populate as required
				});
			}
		});

		return keyCards;
	}

	async clear(_response?: any): Promise<void> {
		const cookieStore = await cookies();

		// console.log("cookieStore", cookieStore);

		Object.entries(cookieStore.getAll()).forEach(([name, value]) => {
			console.log("name ===", name);
			console.log("value ===", value);
			// Filter only cookies that start with 'KeyCard'
			if (value.name.startsWith("KeyCard")) {
				cookieStore.delete(value.name);
			}
		});
	}
}
