import { z } from "zod";

/*
 ****** Modules ******
 */

export const moduleDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
});

export type Module = z.infer<typeof moduleDTO>;
export const createModuleDTO = moduleDTO.omit({ id: true });
export type CreateModuleDTO = z.infer<typeof createModuleDTO>;

/*
 * Module Slots
 */

export const moduleSlotDTO = z.object({
	id: z.number(),
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});
export type ModuleSlot = z.infer<typeof moduleSlotDTO>;

/*
 * Upsert Module Slots
 */

export const upsertModuleSlotDTO = z.object({
	id: z.number().optional(), // <-- now optional for new slots
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});
export type UpsertModuleSlot = z.infer<typeof upsertModuleSlotDTO>;

export const moduleUpsertSlotsDTO = moduleDTO.extend({
	slots: z.array(upsertModuleSlotDTO).default([]),
});
export type ModuleUpsertSlots = z.infer<typeof moduleUpsertSlotsDTO>;

/*
 * Module Outline
 */

export const moduleSlotWithOutlineDTO = moduleSlotDTO.extend({
	lesson: z.object({
		id: z.number(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type ModuleSlotWithOutline = z.infer<typeof moduleSlotWithOutlineDTO>;

export const moduleOutlineDTO = moduleDTO.extend({
	slots: z.array(moduleSlotWithOutlineDTO).default([]),
});
export type ModuleOutline = z.infer<typeof moduleOutlineDTO>;

/*
 ****** Lesson ******
 */

export const lessonDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
});
export type Lesson = z.infer<typeof lessonDTO>;
export const createLessonDTO = lessonDTO.omit({ id: true });
export type CreateLessonDTO = z.infer<typeof createLessonDTO>;

/*
 ****** Course ******
 */

export const courseDTO = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
});
export type Course = z.infer<typeof courseDTO>;
export const createCourseDTO = courseDTO.omit({ id: true });
export type CreateCourseDTO = z.infer<typeof createCourseDTO>;

/*
 * Course Slot
 */
export const courseSlotDTO = z.object({
	id: z.number(),
	courseId: z.number(),
	moduleId: z.number().optional(),
	lessonId: z.number().optional(),
	order: z.number(),
});

export type CourseSlot = z.infer<typeof courseSlotDTO>;

/*
 * Upsert
 */

export const courseSlotUpsertDTO = courseSlotDTO.extend({
	id: z.number().optional(),
});
export type CourseSlotUpsert = z.infer<typeof courseSlotUpsertDTO>;

export const courseUpsertSlotsDTO = courseDTO.extend({
	slots: z.array(courseSlotUpsertDTO).default([]),
});
export type CourseUpsertSlots = z.infer<typeof courseUpsertSlotsDTO>;

/*
 * Outline
 */

export const courseSlotOutlineDTO = courseSlotDTO.extend({
	content: z.object({
		id: z.number(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});

export type CourseSlotOutline = z.infer<typeof courseSlotOutlineDTO>;

export const courseOutlineDTO = courseDTO.extend({
	slots: z.array(courseSlotOutlineDTO).default([]),
});
export type CourseOutline = z.infer<typeof courseOutlineDTO>;
