// import { NodePgDatabase } from "drizzle-orm/node-postgres";
import { PgDatabase, type PgQueryResultHKT } from "drizzle-orm/pg-core";
import { NeonHttpDatabase } from "drizzle-orm/neon-http";
// import * as defaultSchema from "./schema";
import { createSchema } from "./schema";
import type {
	Course,
	ModuleCRUD,
	Module,
	LessonCRUD,
	Lesson,
	CourseCRUD,
	// CourseSlotOutline,
	CourseSlot,
	ModuleSlot,
	VideoCRUD,
	CreateVideoDTO,
	EditVideoDTO,
} from "../types";
import { and, eq, inArray } from "drizzle-orm";
import {
	CourseOutline,
	CourseSlotUpsert,
	CreateCourseDTO,
	CreateModuleDTO,
	EditCourseDTO,
	EditModuleDTO,
	ModuleOutline,
	ModuleSlotOutline,
	UpsertModuleSlot,
	CourseSlotOutline,
	createModuleDTO,
	DeepModuleSlotOutline,
	CourseSlotDeepOutline,
	CourseDeepOutline,
} from "validators";

const defaultSchema = createSchema();
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
		const results = await db
			.select({
				module: schema.module,
				slot: schema.moduleSlot,
			})
			.from(schema.module)
			.leftJoin(
				schema.moduleSlot,
				eq(schema.module.id, schema.moduleSlot.moduleId)
			);

		const moduleMap = new Map<
			number,
			Omit<Module, "slots"> & { slots: ModuleSlot[] }
		>();

		for (const row of results) {
			const { module, slot } = row;

			if (!moduleMap.has(module.id)) {
				moduleMap.set(module.id, { ...module, slots: [] });
			}

			if (slot) {
				moduleMap.get(module.id)!.slots.push(slot);
			}
		}

		return Array.from(moduleMap.values());
	};

	const get = async (id: number) => {
		const results = await db
			.select({
				module: schema.module,
				slot: schema.moduleSlot,
			})
			.from(schema.module)
			.leftJoin(
				schema.moduleSlot,
				eq(schema.module.id, schema.moduleSlot.moduleId)
			)
			.where(eq(schema.module.id, id));

		if (results.length === 0) return null;

		const { module } = results[0];

		const slots = results
			.map((r) => r.slot)
			.filter((slot): slot is ModuleSlot => slot !== null); // ← 🔑 this makes sure slot is NOT null

		return {
			...module,
			slots,
		};
	};

	const create = async (input: CreateModuleDTO) => {
		// validate
		const validatedInput = createModuleDTO.parse(input);
		// Step 1: Create the course
		const [createdModule] = await db
			.insert(schema.module)
			.values({
				name: validatedInput.name,
				description: validatedInput.description,
				isPublished: validatedInput.isPublished ?? false,
			})
			.returning();

		if (!createdModule) {
			throw new Error("Failed to create module");
		}

		// Step 2: Create the slots, if any
		const slots = validatedInput.slots ?? [];

		let createdSlots: ModuleSlot[] = [];

		if (slots.length > 0) {
			createdSlots = await db
				.insert(schema.moduleSlot)
				.values(
					slots.map((slot) => ({
						...slot,
						moduleId: createdModule.id,
					}))
				)
				.returning();
		}

		// Step 3: Return full course with attached slots
		return {
			...createdModule,
			slots: createdSlots,
		};
	};

	const destroy = async (id: number) => {
		await db.delete(schema.module).where(eq(schema.module.id, id));
	};

	const update = async (data: EditModuleDTO) => {
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

		const updated = await get(data.id);
		if (!updated) {
			throw new Error("Failed to fetch updated module");
		}

		return updated;
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

	// const updateWithSlots = async (data: Partial<EditModuleUpsertSlots>) => {
	// 	if (!data.id) {
	// 		throw new Error("Module ID is required");
	// 	}
	// 	// const moduleId = data.id);
	// 	// update module details
	// 	const [module] = await db
	// 		.update(schema.module)
	// 		.set(data)
	// 		.where(eq(schema.module.id, data.id))
	// 		.returning();

	// 	// update module slots
	// 	if (data.slots) {
	// 		await syncModuleSlots(data.id!, data.slots);
	// 	}
	// 	return outline(data.id!);
	// };

	const findUsage = async (id: number) => {
		const courseSlots = await db
			.select()
			.from(schema.courseSlot)
			.where(eq(schema.courseSlot.moduleId, id));
		return {
			inCourseSlots: courseSlots,
			totalCount: courseSlots.length,
		};
	};

	return {
		list,
		get,
		create,
		destroy,
		update,
		outline,
		// updateWithSlots,
		findUsage,
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
		const results = await db
			.select({
				course: schema.course,
				slot: schema.courseSlot,
			})
			.from(schema.course)
			.leftJoin(
				schema.courseSlot,
				eq(schema.course.id, schema.courseSlot.courseId)
			);

		const courseMap = new Map<
			number,
			Omit<Course, "slots"> & { slots: CourseSlot[] }
		>();

		for (const row of results) {
			const { course, slot } = row;

			if (!courseMap.has(course.id)) {
				courseMap.set(course.id, { ...course, slots: [] });
			}

			if (slot) {
				courseMap.get(course.id)!.slots.push(slot);
			}
		}

		return Array.from(courseMap.values());
	};

	const get = async (id: number) => {
		const results = await db
			.select({
				course: schema.course,
				slot: schema.courseSlot,
			})
			.from(schema.course)
			.leftJoin(
				schema.courseSlot,
				eq(schema.course.id, schema.courseSlot.courseId)
			)
			.where(eq(schema.course.id, id));

		if (results.length === 0) return null;

		const { course } = results[0];

		const slots = results
			.map((r) => r.slot)
			.filter((slot): slot is CourseSlot => slot !== null); // ← 🔑 this makes sure slot is NOT null

		return {
			...course,
			slots,
		};
	};

	// const outline = async (id: number) => {
	// 	const rows = await db
	// 		.select({
	// 			id: schema.course.id,
	// 			userId: schema.course.userId,
	// 			title: schema.course.title,
	// 			description: schema.course.description,
	// 			isPublished: schema.course.isPublished,
	// 			courseSlotId: schema.courseSlot.id,
	// 			courseSlotOrder: schema.courseSlot.order,
	// 			moduleId: schema.courseSlot.moduleId,
	// 			lessonId: schema.courseSlot.lessonId,
	// 			moduleName: schema.module.name,
	// 			moduleIsPublished: schema.module.isPublished,
	// 			lessonName: schema.lesson.name,
	// 			lessonIsPublished: schema.lesson.isPublished,
	// 		})
	// 		.from(schema.course)
	// 		.leftJoin(
	// 			schema.courseSlot,
	// 			eq(schema.courseSlot.courseId, schema.course.id)
	// 		)
	// 		.leftJoin(
	// 			schema.module,
	// 			eq(schema.module.id, schema.courseSlot.moduleId)
	// 		)
	// 		.leftJoin(
	// 			schema.lesson,
	// 			eq(schema.lesson.id, schema.courseSlot.lessonId)
	// 		)
	// 		.where(eq(schema.course.id, id))
	// 		.orderBy(schema.courseSlot.order);

	// 	if (rows.length === 0) {
	// 		return null; // or throw new Error("Module not found")
	// 	}

	// 	const courseSlots: CourseSlotOutline[] = rows
	// 		.filter((r) => r.courseSlotId !== null) // filter out “no-slot” row
	// 		.map((row) => ({
	// 			id: row.courseSlotId!,
	// 			courseId: row.id,
	// 			order: row.courseSlotOrder!,
	// 			moduleId: row.moduleId ?? undefined,
	// 			lessonId: row.lessonId ?? undefined,
	// 			content: row.lessonId
	// 				? {
	// 						id: row.lessonId!,
	// 						name: row.lessonName!,
	// 						isPublished: row.lessonIsPublished!,
	// 				  }
	// 				: {
	// 						id: row.moduleId!,
	// 						name: row.moduleName!,
	// 						isPublished: row.moduleIsPublished!,
	// 				  },
	// 		}));

	// 	const {
	// 		title,
	// 		description,
	// 		isPublished,
	// 		userId,
	// 		id: courseId,
	// 	} = rows[0];

	// 	const outline: CourseOutline = {
	// 		id: courseId,
	// 		userId,
	// 		title,
	// 		description,
	// 		isPublished,
	// 		slots: courseSlots,
	// 	};

	// 	// console.log("Course outline", outline);

	// 	return outline;
	// };

	const deepOutline = async (id: number) => {
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

		if (rows.length === 0) return null;

		console.log("Course slots", rows);

		const moduleIds = new Set<number>();
		rows.forEach((row) => {
			if (row.moduleId !== null) moduleIds.add(row.moduleId);
		});

		console.log("Module IDs", moduleIds);

		// ✅ Fetch all module slots in one query
		const moduleLessons = await db
			.select({
				moduleSlotId: schema.moduleSlot.id,
				order: schema.moduleSlot.order,
				moduleId: schema.moduleSlot.moduleId,
				lessonId: schema.moduleSlot.lessonId,
				lessonName: schema.lesson.name,
				lessonIsPublished: schema.lesson.isPublished,
			})
			.from(schema.moduleSlot)
			.leftJoin(
				schema.lesson,
				eq(schema.lesson.id, schema.moduleSlot.lessonId)
			)
			.where(inArray(schema.moduleSlot.moduleId, [...moduleIds]))
			.orderBy(schema.moduleSlot.moduleId, schema.moduleSlot.order);

		console.log("Module lessons", moduleLessons);

		// 🔁 Group by moduleId
		const moduleSlotMap = new Map<number, DeepModuleSlotOutline[]>();
		for (const row of moduleLessons) {
			if (!moduleSlotMap.has(row.moduleId)) {
				moduleSlotMap.set(row.moduleId, []);
			}
			moduleSlotMap.get(row.moduleId)!.push({
				id: row.moduleSlotId,
				order: row.order,
				content: {
					id: row.lessonId,
					name: row.lessonName ?? "",
					isPublished: row.lessonIsPublished ?? false,
				},
			});
		}

		const courseSlots: CourseSlotDeepOutline[] = rows
			.filter((r) => r.courseSlotId !== null)
			.map((row) => {
				const isModule = !!row.moduleId;
				return {
					id: row.courseSlotId!,
					courseId: row.id,
					order: row.courseSlotOrder!,
					moduleId: row.moduleId ?? null,
					lessonId: row.lessonId ?? null,
					content: isModule
						? {
								id: row.moduleId!,
								name: row.moduleName!,
								isPublished: row.moduleIsPublished!,
								type: "module" as const,
								slots: moduleSlotMap.get(row.moduleId!) ?? [],
						  }
						: {
								id: row.lessonId!,
								name: row.lessonName!,
								isPublished: row.lessonIsPublished!,
								type: "lesson" as const,
						  },
				};
			});

		// 🔁 Attach nested lessons to modules in courseSlots
		for (const slot of courseSlots) {
			if (slot.moduleId && slot.content.type === "module") {
				slot.content.slots = moduleSlotMap.get(slot.moduleId) ?? [];
			}
		}

		const {
			title,
			description,
			isPublished,
			userId,
			id: courseId,
		} = rows[0];

		const deepOutline: CourseDeepOutline = {
			id: courseId,
			userId,
			title,
			description,
			isPublished,
			slots: courseSlots,
		};

		return deepOutline;
	};

	const outline = deepOutline;

	const create = async (input: CreateCourseDTO) => {
		// Step 1: Create the course
		const [createdCourse] = await db
			.insert(schema.course)
			.values({
				userId: input.userId,
				title: input.title,
				description: input.description,
				isPublished: input.isPublished ?? false,
			})
			.returning();

		if (!createdCourse) {
			throw new Error("Failed to create course");
		}

		// Step 2: Create the slots, if any
		const slots = input.slots ?? [];

		let createdSlots: CourseSlot[] = [];

		if (slots.length > 0) {
			createdSlots = await db
				.insert(schema.courseSlot)
				.values(
					slots.map((slot) => ({
						...slot,
						courseId: createdCourse.id,
					}))
				)
				.returning();
		}

		// Step 3: Return full course with attached slots
		return {
			...createdCourse,
			slots: createdSlots,
		};
	};

	const update = async (data: EditCourseDTO) => {
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

		const updated = await get(data.id);
		if (!updated) {
			throw new Error("Failed to fetch updated course");
		}

		return updated;
	};

	const destroy = async (id: number) => {
		await db.delete(schema.course).where(eq(schema.course.id, id));
	};

	// const updateWithSlots = async (data: Partial<EditCourseUpsertSlots>) => {
	// 	if (!data.id) {
	// 		throw new Error("Course ID is required");
	// 	}
	// 	// update course details
	// 	const [course] = await db
	// 		.update(schema.course)
	// 		.set(data)
	// 		.where(eq(schema.course.id, data.id))
	// 		.returning();

	// 	// update module slots
	// 	if (data.slots) {
	// 		await syncCourseSlots(data.id!, data.slots);
	// 	}
	// 	return outline(data.id!);
	// };

	return {
		list,
		get,
		create,
		update,
		destroy,
		outline,
		deepOutline,
		// updateWithSlots,
	};
};

const createLessonRepo = (
	db: DrizzleDatabase,
	schema: DefaultSchema
): LessonCRUD => {
	const list = async () => {
		return db.select().from(schema.lesson);
	};
	const get = async (id: number) => {
		const [lesson] = await db
			.select()
			.from(schema.lesson)
			.where(eq(schema.lesson.id, id));
		return lesson;
	};
	const create = async (input: Omit<Lesson, "id">) => {
		const [lesson] = await db
			.insert(schema.lesson)
			.values(input)
			.returning();
		return lesson;
	};
	const update = async (data: Lesson) => {
		const [lesson] = await db
			.update(schema.lesson)
			.set(data)
			.where(eq(schema.lesson.id, data.id))
			.returning();
		return lesson;
	};
	const destroy = async (id: number) => {
		const deleted = await db
			.delete(schema.lesson)
			.where(eq(schema.lesson.id, id))
			.returning();

		if (deleted.length === 0) {
			throw new Error(`Record with id ${id} not found`);
		}
	};

	const findUsage = async (id: number) => {
		const [courseSlots, moduleSlots] = await Promise.all([
			db
				.select()
				.from(schema.courseSlot)
				.where(eq(schema.courseSlot.lessonId, id)),
			db
				.select()
				.from(schema.moduleSlot)
				.where(eq(schema.moduleSlot.lessonId, id)),
		]);
		return {
			inCourseSlots: courseSlots,
			inModuleSlots: moduleSlots,
			totalCount: courseSlots.length + moduleSlots.length,
		};
	};
	return {
		list,
		get,
		create,
		update,
		destroy,
		findUsage,
	};
};

const createVideoRepo = (
	db: DrizzleDatabase,
	schema: DefaultSchema
): VideoCRUD => {
	const list = async () => {
		return db.select().from(schema.video);
	};
	const get = async (id: number) => {
		const [video] = await db
			.select()
			.from(schema.video)
			.where(eq(schema.video.id, id));
		return video;
	};
	const create = async (input: CreateVideoDTO) => {
		const [video] = await db.insert(schema.video).values(input).returning();
		return video;
	};
	const update = async (data: EditVideoDTO) => {
		const [video] = await db
			.update(schema.video)
			.set(data)
			.where(eq(schema.video.id, data.id))
			.returning();
		return video;
	};
	const destroy = async (id: number) => {
		const deleted = await db
			.delete(schema.video)
			.where(eq(schema.video.id, id))
			.returning();

		if (deleted.length === 0) {
			throw new Error(`Record with id ${id} not found`);
		}
	};

	const findUsage = async (id: number) => {
		const lessons = await db
			.select()
			.from(schema.lesson)
			.where(eq(schema.lesson.videoId, id));
		return {
			inLessons: lessons,
			totalCount: lessons.length,
		};
	};
	return {
		list,
		get,
		create,
		update,
		destroy,
		findUsage,
	};
};
export const DrizzlePGAdapter = (
	db: DrizzleDatabase,
	schema: DefaultSchema = defaultSchema
) => {
	return {
		course: createCourseRepo(db, schema),
		module: createModuleRepo(db, schema),
		lesson: createLessonRepo(db, schema),
		video: createVideoRepo(db, schema),
	};
};

export const createCoursesDBAdapter = (db: DrizzleDatabase) => {
	return {
		adapter: DrizzlePGAdapter(db),
		schema: defaultSchema,
	};
};

export interface DBAdapter {
	course: CourseCRUD;
	module: ModuleCRUD;
	lesson: LessonCRUD;
	video: VideoCRUD;
}
