// import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgDatabase, type PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as defaultSchema from "./schema";
import type {
	Course,
	ModuleCRUD,
	Module,
	LessonCRUD,
	Lesson,
	CourseCRUD,
	CourseSlotOutline,
} from "../types";
import { and, eq, inArray } from "drizzle-orm";
import {
	CourseOutline,
	CourseSlotUpsert,
	EditCourseUpsertSlots,
	EditModuleUpsertSlots,
	ModuleOutline,
	ModuleSlotOutline,
	UpsertModuleSlot,
} from "validators";

type DefaultSchema = typeof defaultSchema;

type DrizzleDatabase =
	// | NodePgDatabase
	PgDatabase<PgQueryResultHKT, any> | NeonHttpDatabase;

const toDBId = (id: string): number => parseInt(id, 10);

const createModuleRepo = (
	db: DrizzleDatabase,
	schema: DefaultSchema
): ModuleCRUD => {
	/**
	 * Sync moduleSlots for a given moduleId against incomingSlots array.
	 */
	const syncModuleSlots = async (
		moduleId: number,
		incomingSlots: UpsertModuleSlot[]
	) => {
		// 1) Load existing slots from DB
		const existingSlots = await db
			.select()
			.from(schema.moduleSlot)
			.where(eq(schema.moduleSlot.moduleId, moduleId));

		// 2) Build maps for diffing
		const existingMap = new Map(existingSlots.map((s) => [s.id, s]));
		const incomingMap = new Map<number, UpsertModuleSlot>(
			incomingSlots.map((s) => [s.id ?? 0, s])
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
	};

	const list = async () => {
		return db.select().from(schema.module);
	};

	const get = async (id: number) => {
		const [module] = await db
			.select()
			.from(schema.module)
			.where(eq(schema.module.id, id));
		return module;
	};

	const create = async (input: Omit<Module, "id">) => {
		const [module] = await db
			.insert(schema.module)
			.values(input)
			.returning();
		return module;
	};

	const destroy = async (id: number) => {
		await db.delete(schema.module).where(eq(schema.module.id, id));
	};

	const update = async (data: Module) => {
		const [module] = await db
			.update(schema.module)
			.set(data)
			.where(eq(schema.module.id, data.id))
			.returning();
		return module;
	};

	const outline = async (id: number) => {
		const moduleId = id;

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

		const slots: ModuleSlotOutline[] = rows
			.filter((r) => r.moduleSlotId !== null) // filter out “no-slot” row
			.map((row) => ({
				id: row.moduleSlotId!,
				moduleId: row.id,
				lessonId: row.lessonId!,
				order: row.order!,
				content: {
					id: row.lessonId!,
					name: row.lessonName!,
					isPublished: row.lessonIsPublished!,
				},
			}));

		const { name, description, isPublished } = rows[0];

		const outline: ModuleOutline = {
			id: moduleId,
			name,
			description: description ?? undefined,
			isPublished,
			slots,
		};

		return outline;
	};

	const updateWithSlots = async (data: Partial<EditModuleUpsertSlots>) => {
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
		return outline(data.id!);
	};

	return {
		list,
		get,
		create,
		destroy,
		update,
		outline,
		updateWithSlots,
	};
};

const createCourseRepo = (
	db: DrizzleDatabase,
	schema: DefaultSchema
): CourseCRUD => {
	/*
	 * Sync courseSlots for a given courseId against incomingSlots array.
	 */
	const syncCourseSlots = async (
		courseId: number,
		incomingSlots: CourseSlotUpsert[]
	) => {
		// 1) Load existing slots from DB
		const existingSlots = await db
			.select()
			.from(schema.courseSlot)
			.where(eq(schema.courseSlot.courseId, courseId));

		// 2) Build maps for diffing
		const existingMap = new Map(existingSlots.map((s) => [s.id, s]));
		const incomingMap = new Map<number, CourseSlotUpsert>(
			incomingSlots.map((s) => [s.id ?? 0, s])
		);

		console.log("existingMap", existingMap);
		console.log("incomingMap", incomingMap);

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
				!!old &&
				(old.order !== s.order ||
					old.lessonId != s.lessonId ||
					old.moduleId != s.moduleId)
			);
		});

		console.log("toDelete", toDelete);
		console.log("toCreate", toCreate);
		console.log("toUpdate", toUpdate);

		if (toDelete.length) {
			await db
				.delete(schema.courseSlot)
				.where(
					and(
						eq(schema.courseSlot.courseId, courseId),
						inArray(schema.courseSlot.id, toDelete)
					)
				);
		}

		if (toUpdate.length) {
			for (const slot of toUpdate) {
				await db
					.update(schema.courseSlot)
					.set({
						order: slot.order,
						lessonId: slot.lessonId,
						moduleId: slot.moduleId,
					})
					.where(eq(schema.courseSlot.id, slot.id!));
			}
		}

		if (toCreate.length) {
			await db.insert(schema.courseSlot).values(
				toCreate.map((slot) => ({
					courseId,
					lessonId: slot.lessonId,
					moduleId: slot.moduleId,
					order: slot.order,
				}))
			);
		}
	};

	const list = async () => {
		return db.select().from(schema.course);
	};

	const get = async (id: number) => {
		const [course] = await db
			.select()
			.from(schema.course)
			.where(eq(schema.course.id, id));
		return course;
	};

	const outline = async (id: number) => {
		const rows = await db
			.select({
				id: schema.course.id,
				userId: schema.course.userId,
				title: schema.course.title,
				description: schema.course.description,
				isPublished: schema.course.isPublished,
				courseSlotId: schema.courseSlot.id,
				courseSlotOrder: schema.courseSlot.order,
				moduleId: schema.courseSlot.moduleId,
				lessonId: schema.courseSlot.lessonId,
				moduleName: schema.module.name,
				moduleIsPublished: schema.module.isPublished,
				lessonName: schema.lesson.name,
				lessonIsPublished: schema.lesson.isPublished,
			})
			.from(schema.course)
			.leftJoin(
				schema.courseSlot,
				eq(schema.courseSlot.courseId, schema.course.id)
			)
			.leftJoin(
				schema.module,
				eq(schema.module.id, schema.courseSlot.moduleId)
			)
			.leftJoin(
				schema.lesson,
				eq(schema.lesson.id, schema.courseSlot.lessonId)
			)
			.where(eq(schema.course.id, id))
			.orderBy(schema.courseSlot.order);

		if (rows.length === 0) {
			return null; // or throw new Error("Module not found")
		}

		const courseSlots: CourseSlotOutline[] = rows
			.filter((r) => r.courseSlotId !== null) // filter out “no-slot” row
			.map((row) => ({
				id: row.courseSlotId!,
				courseId: row.id,
				order: row.courseSlotOrder!,
				moduleId: row.moduleId ?? undefined,
				lessonId: row.lessonId ?? undefined,
				content: row.lessonId
					? {
							id: row.lessonId!,
							name: row.lessonName!,
							isPublished: row.lessonIsPublished!,
					  }
					: {
							id: row.moduleId!,
							name: row.moduleName!,
							isPublished: row.moduleIsPublished!,
					  },
			}));

		const {
			title,
			description,
			isPublished,
			userId,
			id: courseId,
		} = rows[0];

		const outline: CourseOutline = {
			id: courseId,
			userId,
			title,
			description,
			isPublished,
			slots: courseSlots,
		};

		// console.log("Course outline", outline);

		return outline;
	};

	const create = async (input: Omit<Course, "id">) => {
		const [course] = await db
			.insert(schema.course)
			.values(input)
			.returning();
		return course;
	};

	const update = async (data: Course) => {
		const [course] = await db
			.update(schema.course)
			.set(data)
			.where(eq(schema.course.id, data.id))
			.returning();
		return course;
	};

	const destroy = async (id: number) => {
		await db.delete(schema.course).where(eq(schema.course.id, id));
	};

	const updateWithSlots = async (data: Partial<EditCourseUpsertSlots>) => {
		if (!data.id) {
			throw new Error("Course ID is required");
		}
		// update course details
		const [course] = await db
			.update(schema.course)
			.set(data)
			.where(eq(schema.course.id, data.id))
			.returning();

		// update module slots
		if (data.slots) {
			await syncCourseSlots(data.id!, data.slots);
		}
		return outline(data.id!);
	};

	return {
		list,
		get,
		create,
		update,
		destroy,
		outline,
		updateWithSlots,
	};
};
// what type is this?
export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		course: createCourseRepo(db, schema),
		module: createModuleRepo(db, schema),
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
			destroy: async (id: number) => {
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
	course: CourseCRUD;
	logSchema: () => void;
	module: ModuleCRUD;
	lesson: LessonCRUD;
}
