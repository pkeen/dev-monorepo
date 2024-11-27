/* Validate the field on Log in form
    Return a useable response object
    */

// "use client";

import { z } from "zod";

// Zod schema for login form data
const loginSchema = z.object({
	email: z.string().email({ message: "Email address invalid" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }), // make min 3 for now
});

const responseSchema = z.object({
	validated: z.boolean(),
    authorized: z.boolean().optional(),
	data: z.object({
		email: z.string(),
		password: z.string(),
	}),
	errors: z
		.object({
			email: z.array(z.string()).optional(),
			password: z.array(z.string()).optional(),
			db: z.string().optional(),
		})
		.optional(),
});

const data = z.object({
	email: z.string(),
	password: z.string(),
});

export type data = z.infer<typeof data>;

export type response = z.infer<typeof responseSchema>;

export const validate = (data: data) => {
	// Validate the data
	const result = loginSchema.safeParse(data);

	// Create relevant response object
	if (!result.success) {
		// Zod error handling
		// Extract errors from result.error
		const fieldErrors = result.error.flatten().fieldErrors;
		// Create meaningful feedback
		const response: response = {
			validated: false,
			data: data,
			errors: fieldErrors,
		};
		console.log(response);
		return response;
	} else {
		// Send response back with success and the data
		const response: response = {
			validated: true,
			data: data,
		};
		return response;
	}
};
