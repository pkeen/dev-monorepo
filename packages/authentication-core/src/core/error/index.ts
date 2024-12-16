// packages/auth-core/src/errors/auth-error.ts
export class AuthError extends Error {
	constructor(
		message: string,
		public code: AuthErrorCode,
		public httpStatus: number = 400
	) {
		super(message);
		this.name = "AuthError";
	}
}

export enum AuthErrorCode {
	// Configuration/Programming Errors (500s)
	INVALID_CONFIG = "INVALID_CONFIG",
	INVALID_ARGUMENT = "INVALID_ARGUMENT",

	// Security Errors (400s)
	TOKEN_TAMPERED = "TOKEN_TAMPERED",
	TOKEN_EXPIRED = "TOKEN_EXPIRED",
	INVALID_SIGNATURE = "INVALID_SIGNATURE",

	// Authentication Errors (400s)
	INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
	USER_NOT_FOUND = "USER_NOT_FOUND",
	ACCOUNT_LOCKED = "ACCOUNT_LOCKED",

	// Authorization Errors (403s)
	INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS",
	INVALID_SCOPE = "INVALID_SCOPE",
}

// Specific error classes for different categories
export class SecurityError extends AuthError {
	constructor(
		message: string,
		code: AuthErrorCode = AuthErrorCode.TOKEN_TAMPERED
	) {
		super(message, code, 401);
		this.name = "SecurityError";
	}
}

export class ConfigurationError extends AuthError {
	constructor(message: string) {
		super(message, AuthErrorCode.INVALID_CONFIG, 500);
		this.name = "ConfigurationError";
	}
}

// Define specific error types
export class TokenError extends AuthError {
	constructor(message: string, code: AuthErrorCode) {
		super(message, code);
		this.name = "TokenError";
	}
}

export class TokenExpiredError extends TokenError {
	constructor(message: string) {
		super(message, AuthErrorCode.TOKEN_EXPIRED);
		this.name = "TokenExpiredError";
	}
}

export class TokenTamperedError extends TokenError {
	constructor(message: string) {
		super(message, AuthErrorCode.TOKEN_TAMPERED);
		this.name = "TokenTamperedError";
	}
}

// export class InvalidSignatureError extends TokenError {
// 	constructor(message: string) {
// 		super(message, AuthErrorCode.INVALID_SIGNATURE);
// 		this.name = "InvalidSignatureError";
// 	}
// }
