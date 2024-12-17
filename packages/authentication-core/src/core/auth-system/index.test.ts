import { AuthSystem } from "./index";
import { AuthStrategy, KeyCards, AuthValidationResult } from "../types";
import { Adapter, AdapterUser } from "../adapter";
import { PasswordService } from "../password-service";
import { MultiTransportLogger } from "@pete_keen/logger";

describe("AuthSystem Integration", () => {
	// Mock dependencies
	let mockStrategy: jest.Mocked<AuthStrategy>;
	let mockAdapter: jest.Mocked<Adapter>;
	let mockPasswordService: jest.Mocked<PasswordService>;
	let mockLogger: jest.Mocked<MultiTransportLogger>;
	let authSystem: AuthSystem;

	// Mock data
	const mockUser: AdapterUser = {
		id: "123",
		email: "test@example.com",
		password: "hashedPassword123",
		emailVerified: null,
		name: "Test User",
	};

	const mockKeyCards: KeyCards = [
		{ name: "access", value: "access-token", storageOptions: {} },
		{ name: "refresh", value: "refresh-token", storageOptions: {} },
	];

	beforeEach(() => {
		// Complete mock strategy implementation
		mockStrategy = {
			createKeyCards: jest.fn(),
			validateAll: jest.fn(),
			validateRefresh: jest.fn(),
			validate: jest.fn(),
			logout: jest.fn(),
			supportsRefresh: jest.fn(),
		} as jest.Mocked<AuthStrategy>;

		// Complete mock adapter implementation
		mockAdapter = {
			getUser: jest.fn(),
			getUserByEmail: jest.fn(),
			createUserWithoutId: jest.fn(),
			createUser: jest.fn(), // Add required method
		} as jest.Mocked<Adapter>;

		// Setup mock password service
		mockPasswordService = {
			hash: jest.fn(),
			verify: jest.fn(),
		} as jest.Mocked<PasswordService>;

		// Setup mock logger
		mockLogger = {
			info: jest.fn(),
			warn: jest.fn(),
			error: jest.fn(),
			debug: jest.fn(),
		} as unknown as jest.Mocked<MultiTransportLogger>;

		// Create AuthSystem instance
		authSystem = new AuthSystem(
			mockStrategy,
			mockAdapter,
			mockPasswordService,
			mockLogger
		);
	});

	describe("authenticate", () => {
		it("successfully authenticates valid credentials", async () => {
			// Setup mocks for successful authentication
			mockAdapter.getUserByEmail.mockResolvedValue(mockUser);
			mockPasswordService.verify.mockResolvedValue(true);
			mockStrategy.createKeyCards.mockResolvedValue(mockKeyCards);

			const result = await authSystem.authenticate({
				email: "test@example.com",
				password: "correctPassword",
			});

			// Verify successful authentication
			expect(result).toEqual({
				isLoggedIn: true,
				keyCards: mockKeyCards,
				user: mockUser,
			});

			// Verify the flow of operations
			expect(mockAdapter.getUserByEmail).toHaveBeenCalledWith(
				"test@example.com"
			);
			expect(mockPasswordService.verify).toHaveBeenCalledWith(
				"correctPassword",
				mockUser.password
			);
			expect(mockStrategy.createKeyCards).toHaveBeenCalledWith(mockUser);
			expect(mockLogger.info).toHaveBeenCalledWith(
				"Authentication successful",
				expect.any(Object)
			);
		});

		it("fails authentication with invalid credentials", async () => {
			mockAdapter.getUserByEmail.mockResolvedValue(mockUser);
			mockPasswordService.verify.mockResolvedValue(false);

			const result = await authSystem.authenticate({
				email: "test@example.com",
				password: "wrongPassword",
			});

			expect(result).toEqual({
				isLoggedIn: false,
			});

			expect(mockStrategy.createKeyCards).not.toHaveBeenCalled();
		});

		it("handles user not found", async () => {
			mockAdapter.getUserByEmail.mockResolvedValue(null);

			const result = await authSystem.authenticate({
				email: "nonexistent@example.com",
				password: "password",
			});

			expect(result).toEqual({
				isLoggedIn: false,
			});

			expect(mockPasswordService.verify).not.toHaveBeenCalled();
			expect(mockStrategy.createKeyCards).not.toHaveBeenCalled();
		});
	});

	describe("refresh", () => {
		it("successfully refreshes valid keyCards", async () => {
			mockStrategy.validateRefresh.mockResolvedValue({
				valid: true,
				user: mockUser,
			});
			mockAdapter.getUser.mockResolvedValue(mockUser);
			mockStrategy.createKeyCards.mockResolvedValue(mockKeyCards);

			const result = await authSystem.refresh(mockKeyCards);

			expect(result).toEqual({
				isLoggedIn: true,
				keyCards: mockKeyCards,
				user: mockUser,
			});
		});

		it("fails refresh with invalid keyCards", async () => {
			mockStrategy.validateRefresh.mockResolvedValue({
				valid: false,
				user: null,
			});

			const result = await authSystem.refresh(mockKeyCards);

			expect(result).toEqual({
				isLoggedIn: false,
			});
		});
	});

	describe("signup", () => {
		it("successfully creates new user account", async () => {
			const signupCredentials = {
				email: "new@example.com",
				password: "newPassword",
				name: "New User",
			};

			mockAdapter.getUserByEmail.mockResolvedValue(null);
			mockPasswordService.hash.mockResolvedValue("hashedNewPassword");
			mockAdapter.createUserWithoutId.mockResolvedValue(mockUser);
			mockStrategy.createKeyCards.mockResolvedValue(mockKeyCards);

			const result = await authSystem.signup(signupCredentials);

			expect(result).toEqual({
				isLoggedIn: true,
				keyCards: mockKeyCards,
				user: mockUser,
			});

			expect(mockPasswordService.hash).toHaveBeenCalledWith(
				"newPassword"
			);
			expect(mockAdapter.createUserWithoutId).toHaveBeenCalledWith({
				email: "new@example.com",
				password: "hashedNewPassword",
				name: "New User",
			});
		});

		it("prevents duplicate email registration", async () => {
			mockAdapter.getUserByEmail.mockResolvedValue(mockUser);

			await expect(
				authSystem.signup({
					email: "test@example.com",
					password: "password",
					name: "Test User",
				})
			).rejects.toThrow(
				"An account with that email is already registered"
			);
		});
	});
});
