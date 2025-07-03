import { defineTables } from "@pete_keen/authentication-core/adapters";
import { createSchema } from "@pete_keen/authz/adapters";
import { schema as coursesSchema } from "@/courses";

export const { usersTable, authSchema, accountsTable } = defineTables();

export const { rbacSchema, rolesTable, userRolesTable } = createSchema();

export const {
	courses,
	course,
	contentItem,
	courseNode,
	lessonDetail,
	videoProviderEnum,
	videoDetail,
	contentType,
} = coursesSchema;
