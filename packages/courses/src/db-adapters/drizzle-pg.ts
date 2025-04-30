// import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgDatabase, type PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as defaultSchema from "./schema";
import type {
	CourseInput,
	Course,
	ModuleCRUD,
	Module,
	LessonCRUD,
	Lesson,
	ModuleOutline,
	ModuleSlotOutline,
} from "../types";
import { eq } from "drizzle-orm";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

const toDBId = (id: string): number => parseInt(id, 10);

// what type is this?
export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		createCourse: async (input: CourseInput): Promise<Course> => {
			const [course] = await db
				.insert(schema.course)
				.values(input)
				.returning();
			return course;
		},
		getCourse: async (id: string) => {
			const [course] = await db
				.select()
				.from(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
			return course;
		},
		updateCourse: async (
			id: string,
			data: Partial<CourseInput>
		): Promise<Course> => {
			const [course] = await db
				.update(schema.course)
				.set(data)
				.where(eq(schema.course.id, toDBId(id)))
				.returning();
			return course;
		},
		deleteCourse: async (id: string): Promise<void> => {
			await db
				.delete(schema.course)
				.where(eq(schema.course.id, toDBId(id)));
		},
		logSchema: () => {
			console.log(schema);
		},
		listCourses: async () => {
			return db.select().from(schema.course);
		},
		module: {
			list: async () => {
				return db.select().from(schema.module);
			},
			get: async (id: string) => {
				const [module] = await db
					.select()
					.from(schema.module)
					.where(eq(schema.module.id, toDBId(id)));
				return module;
			},
			create: async (input: Omit<Module, "id">) => {
				const [module] = await db
					.insert(schema.module)
					.values(input)
					.returning();
				return module;
			},
			outline: async (id: string) => {
				const moduleId = toDBId(id);

				const rows = await db
					.select({
						id: schema.module.id,
						name: schema.module.name,
						description: schema.module.description,
						isPublished: schema.module.isPublished,
						moduleSlotId: schema.moduleSlot.id,
						order: schema.moduleSlot.order,
						lessonName: schema.lesson.name,
						lessonId: schema.lesson.id,
						lessonIsPublished: schema.lesson.isPublished,
					})
					.from(schema.module)
					// use LEFT JOIN so modules without slots still return one “module” row
					.leftJoin(
						schema.moduleSlot,
						eq(schema.moduleSlot.moduleId, schema.module.id)
					)
					.leftJoin(
						schema.lesson,
						eq(schema.lesson.id, schema.moduleSlot.lessonId)
					)
					.where(eq(schema.module.id, moduleId))
					.orderBy(schema.moduleSlot.order);

				if (rows.length === 0) {
					return null; // or throw new Error("Module not found")
				}

				const lessonSlots: ModuleSlotOutline[] = rows
					.filter((r) => r.moduleSlotId !== null) // filter out “no-slot” row
					.map((row) => ({
						id: row.moduleSlotId!,
						moduleId: row.id,
						lessonId: row.lessonId!,
						order: row.order!,
						lesson: {
							id: row.lessonId!,
							name: row.lessonName!,
							isPublished: row.lessonIsPublished!,
						},
					}));

				const { name, description, isPublished } = rows[0];

				const outline: ModuleOutline = {
					id: moduleId,
					name,
					description,
					isPublished,
					lessonSlots: lessonSlots,
				};

				console.log("OUTLINE", outline);

				return outline;
			},

			update: async (id: string, data: Partial<Module>) => {
				const [module] = await db
					.update(schema.module)
					.set(data)
					.where(eq(schema.module.id, toDBId(id)))
					.returning();
				return module;
			},
			delete: async (id: string) => {
				await db
					.delete(schema.module)
					.where(eq(schema.module.id, toDBId(id)));
			},
		},
		lesson: {
			list: async () => {
				return db.select().from(schema.lesson);
			},
			get: async (id: string) => {
				const [lesson] = await db
					.select()
					.from(schema.lesson)
					.where(eq(schema.lesson.id, toDBId(id)));
				return lesson;
			},
			create: async (input: Omit<Lesson, "id">) => {
				const [lesson] = await db
					.insert(schema.lesson)
					.values(input)
					.returning();
				return lesson;
			},
			update: async (id: string, data: Partial<Lesson>) => {
				const [lesson] = await db
					.update(schema.lesson)
					.set(data)
					.where(eq(schema.lesson.id, toDBId(id)))
					.returning();
				return lesson;
			},
			delete: async (id: string) => {
				await db
					.delete(schema.lesson)
					.where(eq(schema.lesson.id, toDBId(id)));
			},
		},
	};
};

export const createCoursesDBAdapter = (db: DrizzleDatabase) => {
	return {
		adapter: DrizzlePGAdapter(db),
		schema: defaultSchema.createSchema(),
	};
};

export interface DBAdapter {
	createCourse: (input: CourseInput) => Promise<Course>;
	getCourse: (id: string) => Promise<Course | null>;
	updateCourse: (id: string, data: Partial<CourseInput>) => Promise<Course>;
	deleteCourse: (id: string) => Promise<void>;
	logSchema: () => void;
	listCourses: () => Promise<Course[]>;
	module: ModuleCRUD;
	lesson: LessonCRUD;
}
