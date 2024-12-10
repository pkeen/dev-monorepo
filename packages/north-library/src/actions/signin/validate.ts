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

type loginSchema = z.infer<typeof loginSchema>;

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

export const validate = (data: loginSchema) => {
	// Validate the data
	const result = loginSchema.parse(data);

	return result;
};
