/**
 * <div style={{display: "flex", justifyContent: "space-between", alignItems: "center", padding: 16}}>
 *  <p>Official <a href="https://orm.drizzle.team">Drizzle ORM</a> adapter for Auth.js / NextAuth.js.</p>
 *  <a href="https://orm.drizzle.team">
 *   <img style={{display: "block"}} src="/img/adapters/drizzle.svg" width="38" />
 *  </a>
 * </div>
 *
 * ## Installation
 *
 * ```bash npm2yarn
 * npm install drizzle-orm @auth/drizzle-adapter
 * npm install drizzle-kit --save-dev
 * ```
 *
 * @module @auth/drizzle-adapter
 */

import { is } from "drizzle-orm"
import { MySqlDatabase } from "drizzle-orm/mysql-core"
import { PgDatabase } from "drizzle-orm/pg-core"
import { BaseSQLiteDatabase } from "drizzle-orm/sqlite-core"
// import { DefaultMySqlSchema, MySqlDrizzleAdapter } from "./lib/mysql.js"
import { DefaultPostgresSchema, PostgresDrizzleAdapter } from "./pg"
// import { DefaultSQLiteSchema, SQLiteDrizzleAdapter } from "./lib/sqlite.js"
import { DefaultSchema, SqlFlavorOptions } from "./lib/utils.js"

import type { Adapter } from "../../core/adapter"

export function DrizzleAdapter<SqlFlavor extends SqlFlavorOptions>(
  db: SqlFlavor,
  schema?: DefaultSchema<SqlFlavor>
): Adapter {
  if (is(db, MySqlDatabase)) {
    return MySqlDrizzleAdapter(db, schema as DefaultMySqlSchema)
  } else if (is(db, PgDatabase)) {
    return PostgresDrizzleAdapter(db, schema as DefaultPostgresSchema)
  } else if (is(db, BaseSQLiteDatabase)) {
    return SQLiteDrizzleAdapter(db, schema as DefaultSQLiteSchema)
  }

  throw new Error(
    `Unsupported database type (${typeof db}) in Auth.js Drizzle adapter.`
  )
}



// // 2. Database Adapters (packages/auth-storage-*)
// // These are like the filing cabinets - they store and retrieve user data
// // packages/auth-storage-postgres/src/PostgresUserRepository.ts

// import { UserRepository } from "../../core/types";


// export const createDrizzleUserRepository = (db: typeof drizzle): UserRepository => {
//     return {
//         findByEmail: async (email: string) => {
//             const result = await db.query.users.findFirst({
//                 where: (users) => users.email === email,
//             });
//             return result || null;
//         },
//         findById: async (id: string) => {
//             const result = await db.query.users.findFirst({
//                 where: (users) => users.id === id,
//             });
//             return result || null;
//         },
//         create: async (user: CreateUserDTO) => {            
//             const result = await db.insert(users).values(user).returning();
//             return result[0];
//         },
//         update: async (id: string, data: UpdateUserDTO) => {
//             const result = await db
//                 .update(users)
//                 .set(data)
//                 .where(eq(users.id, id))
//                 .returning();
//             return result[0];
//         },
//     }
//         // ... other methods
