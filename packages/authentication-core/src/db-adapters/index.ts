// 2. Database Adapters (packages/auth-storage-*)
// These are like the filing cabinets - they store and retrieve user data
// packages/auth-storage-postgres/src/PostgresUserRepository.ts

import { UserRepository } from "../core/types";


export const createDrizzleUserRepository = (db: typeof drizzle): UserRepository => {
    return {
        findByEmail: async (email: string) => {
            const result = await db.query.users.findFirst({
                where: (users) => users.email === email,
            });
            return result || null;
        },
        findById: async (id: string) => {
            const result = await db.query.users.findFirst({
                where: (users) => users.id === id,
            });
            return result || null;
        },
        create: async (user: CreateUserDTO) => {            
            const result = await db.insert(users).values(user).returning();
            return result[0];
        },
        update: async (id: string, data: UpdateUserDTO) => {
            const result = await db
                .update(users)
                .set(data)
                .where(eq(users.id, id))
                .returning();
            return result[0];
        },
    }
        // ... other methods
