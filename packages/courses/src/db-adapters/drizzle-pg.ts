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
	ModuleSlot,
	ModuleWithSlots,
} from "../types";
import { and, eq, inArray } from "drizzle-orm";

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
	/**
	 * Sync moduleSlots for a given moduleId against incomingSlots array.
	 */
	const syncModuleSlots = async (
		moduleId: number,
		incomingSlots: ModuleSlot[]
	) => {
		// 1) Load existing slots from DB
		const existingSlots = await db
			.select()
			.from(schema.moduleSlot)
			.where(eq(schema.moduleSlot.moduleId, moduleId));

		// 2) Build maps for diffing
		const existingMap = new Map(existingSlots.map((s) => [s.id, s]));
		const incomingMap = new Map<number, ModuleSlot>(
			incomingSlots.map((s) => [s.id!, s])
		);
		console.log("existingMap", existingMap);
		console.log("incomingMap", incomingMap);

		// TODO: sort error in this logic

		// 3) Determine which slots to delete, update, create
		const toDelete = existingSlots
			.filter((s) => !incomingMap.has(s.id))
			.map((s) => s.id);

		const toCreate = incomingSlots.filter((s) => !s.id);

		const toUpdate = incomingSlots.filter((s) => {
			if (!s.id) return false;
			const old = existingMap.get(s.id);
			// update if order or lessonId changed
			return (
				!!old && (old.order !== s.order || old.lessonId !== s.lessonId)
			);
		});

		console.log("toDelete", toDelete);
		console.log("toCreate", toCreate);
		console.log("toUpdate", toUpdate);

		if (toDelete.length) {
			await db
				.delete(schema.moduleSlot)
				.where(
					and(
						eq(schema.moduleSlot.moduleId, moduleId),
						inArray(schema.moduleSlot.id, toDelete)
					)
				);
		}

		if (toUpdate.length) {
			for (const slot of toUpdate) {
				await db
					.update(schema.moduleSlot)
					.set({ order: slot.order, lessonId: slot.lessonId })
					.where(eq(schema.moduleSlot.id, slot.id!));
			}
		}

		if (toCreate.length) {
			await db.insert(schema.moduleSlot).values(
				toCreate.map((slot) => ({
					moduleId,
					lessonId: slot.lessonId,
					order: slot.order,
				}))
			);
		}

		// // 4) Execute all operations in a transaction
		// await db.transaction(async (tx) => {
		// 	// Delete removed slots
		// 	if (toDelete.length > 0) {
		// 		await tx
		// 			.delete(schema.moduleSlot)
		// 			.where(
		// 				and(
		// 					eq(schema.moduleSlot.moduleId, moduleId),
		// 					inArray(schema.moduleSlot.id, toDelete)
		// 				)
		// 			);
		// 	}

		// 	// Update modified slots
		// 	for (const slot of toUpdate) {
		// 		await tx
		// 			.update(schema.moduleSlot)
		// 			.set({ order: slot.order, lessonId: slot.lessonId })
		// 			.where(eq(schema.moduleSlot.id, slot.id!));
		// 	}

		// 	// Insert new slots
		// 	for (const slot of toCreate) {
		// 		await tx.insert(schema.moduleSlot).values({
		// 			moduleId,
		// 			lessonId: slot.lessonId,
		// 			order: slot.order,
		// 		});
		// 	}
		// });
	};

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
					slots: lessonSlots,
				};

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
			updateWithSlots: async (data: Partial<ModuleWithSlots>) => {
				if (!data.id) {
					throw new Error("Module ID is required");
				}
				// const moduleId = data.id);
				// update module details
				const [module] = await db
					.update(schema.module)
					.set(data)
					.where(eq(schema.module.id, data.id))
					.returning();

				// update module slots
				if (data.slots) {
					await syncModuleSlots(data.id!, data.slots);
				}
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
			get: async (id: number) => {
				const [lesson] = await db
					.select()
					.from(schema.lesson)
					.where(eq(schema.lesson.id, id));
				return lesson;
			},
			create: async (input: Omit<Lesson, "id">) => {
				const [lesson] = await db
					.insert(schema.lesson)
					.values(input)
					.returning();
				return lesson;
			},
			update: async (data: Lesson) => {
				const [lesson] = await db
					.update(schema.lesson)
					.set(data)
					.where(eq(schema.lesson.id, data.id))
					.returning();
				return lesson;
			},
			delete: async (id: number) => {
				await db.delete(schema.lesson).where(eq(schema.lesson.id, id));
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
