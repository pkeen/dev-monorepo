const secret = new TextEncoder().encode(process.env.JWT_SECRET);

if (!secret) {
	throw new Error("Missing secret for verifying the token.");
}

export { secret };
