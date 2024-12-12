import { BaseUserRepository } from "../core/UserRegistry";
import {
	UserRepository,
	DatabaseUser,
	CreateUserDTO,
	UpdateUserDTO,
} from "../core/types";

interface DrizzleDbConfig {
    db: any;
}

export class DrizzleUserRepository implements UserRepository {
	constructor() {
		this.storage = storage;
	}

	async findByEmail(email: string): Promise<DatabaseUser | null> {
		const [userRow] = await this.storage
			.select()
			.from(users)
			.where(eq(users.email, email));
		if (!userRow) return null;

		// Map userRow to DatabaseUser if needed
		const dbUser: DatabaseUser = {
			id: userRow.id,
			email: userRow.email,
			hashedPassword: userRow.hashedPassword,
			roles: userRow.roles,
			// Omit or transform any additional fields
		};

		return dbUser;
	}
	async findById(id: string): Promise<DatabaseUser | null> {
		return null;
	}
	async create(data: CreateUserDTO): Promise<DatabaseUser> {
		return Promise.resolve({} as DatabaseUser);
	}
	async update(id: string, data: UpdateUserDTO): Promise<DatabaseUser> {
		return Promise.resolve({} as DatabaseUser);
	}
}

export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
	db: SqlFlavor,
	schema?: DefaultSchema<SqlFlavor>
): Adapter {
	if (is(db, MySqlDatabase)) {
		return MySqlDrizzleAdapter(db, schema as DefaultMySqlSchema);
	} else if (is(db, PgDatabase)) {
		return PostgresDrizzleAdapter(db, schema as DefaultPostgresSchema);
	} else if (is(db, BaseSQLiteDatabase)) {
		return SQLiteDrizzleAdapter(db, schema as DefaultSQLiteSchema);
	}

	throw new Error(
		`Unsupported database type (${typeof db}) in Auth.js Drizzle adapter.`
	);
}

// export class DrizzleUserRepository<S>
// 	extends BaseUserRepository<S>
// 	implements UserRepository
// {
// 	constructor(storage: S, tenantId?: string) {
// 		super(storage, tenantId);
// 	}

// 	async findByEmail(email: string): Promise<DatabaseUser | null> {
// 		const [user] = await (this.storage as any)
// 			.select()
// 			.from(users)
// 			.where(eq(users.email, email));
// 		return null;
// 	}

// 	async findById(id: string): Promise<DatabaseUser | null> {
// 		return null;
// 	}

// 	async create(data: CreateUserDTO): Promise<DatabaseUser> {
// 		return Promise.resolve({} as DatabaseUser);
// 	}

// 	async update(id: string, data: UpdateUserDTO): Promise<DatabaseUser> {
// 		return Promise.resolve({} as DatabaseUser);
// 	}
// }
