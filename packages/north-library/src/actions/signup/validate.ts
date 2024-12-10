import { z } from "zod";

// add ts doc to this
/* Validate the field on Signup form
    Return a useable response object
*/

const signUpSchema = z.object({
	name: z.string().min(1, { message: "Name must be at least 1 character" }),
	email: z.string().email({ message: "Email address invalid" }),
	password: z
		.string()
		.min(8, { message: "Password must be at least 8 characters" }), // make min 3 for now
});

type signUpSchema = z.infer<typeof signUpSchema>;

export const validate = (data: signUpSchema) => {
	// Validate the data
	return signUpSchema.parse(data);
};
