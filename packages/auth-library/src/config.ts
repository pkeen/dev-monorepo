enum Roles {
	Admin = "admin",
	User = "user",
	Guest = "guest",
	// Add more roles as needed
}

const config = {
	jwtOptions: {
		access: {
			algorithm: "HS256",
			expiresIn: "10 seconds",
		},
		refresh: {
			algorithm: "HS256",
			expiresIn: "30 days",
		},
		// maxTokenAge: "1h", // thats on the verifyToken side
	},
	cookies: {
		namePrefix: "pk-auth",
	},
	roles: Roles,
};

export default config;

export { Roles };
