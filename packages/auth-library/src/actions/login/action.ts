import { validate, data } from "./validate";
import { authorize } from "./authorize";

export const login = async (previous: unknown, formData: FormData) => {
	const data = Object.fromEntries(formData) as data;

	let result = validate(data);

	// If validation fails return the result object containing the error
	if (!result.validated) {
		return result;
	}

	// Send data to authorize function
	const user = await authorize(data);

	console.log("user:", user);
	// If user is not found return an error

	if (!user) {
		console.log("user not found");
		result = {
			...result,
			authorized: false,
			errors: {
				db: "Email or password incorrect",
			},
		};
		return result;
	} else {
		console.log("user found");
		result = {
			...result,
			authorized: true,
		};
		// return result;
	}
};
