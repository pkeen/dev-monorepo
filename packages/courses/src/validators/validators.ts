import { z } from "zod";

/*
 ****** Modules ******
 */

export const moduleDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional().nullable(),
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
export const upsertModuleSlotDTO = moduleSlotDTO.extend({
	id: z.number().optional(), // <-- now optional for new slots
});
export type UpsertModuleSlot = z.infer<typeof upsertModuleSlotDTO>;

export const editModuleUpsertSlotsDTO = moduleDTO.extend({
	slots: z.array(upsertModuleSlotDTO).default([]),
});
export type EditModuleUpsertSlots = z.infer<typeof editModuleUpsertSlotsDTO>;

/*
 * Module Outline
 */
export const moduleSlotOutlineDTO = moduleSlotDTO.extend({
	content: z.object({
		id: z.number(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type ModuleSlotOutline = z.infer<typeof moduleSlotOutlineDTO>;

export const moduleOutlineDTO = moduleDTO.extend({
	slots: z.array(moduleSlotOutlineDTO).default([]),
	description: z.string().optional(),
});
export type ModuleOutline = z.infer<typeof moduleOutlineDTO>;

/*
 * UI Module Outline
 */
export const uiModuleSlotDTO = upsertModuleSlotDTO.extend({
	clientId: z.string(),
	content: z.object({
		id: z.number().optional(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type UiModuleSlot = z.infer<typeof uiModuleSlotDTO>;
export const uiModuleDTO = moduleDTO.extend({
	slots: z.array(uiModuleSlotDTO).default([]),
	description: z.string().optional(),
});
export type UiModule = z.infer<typeof uiModuleDTO>;

/*
 ****** Lesson ******
 */

export const lessonDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional().nullable(),
	isPublished: z.boolean().optional(),
});
export type Lesson = z.infer<typeof lessonDTO>;
export const createLessonDTO = lessonDTO.omit({ id: true });
export type CreateLessonDTO = z.infer<typeof createLessonDTO>;

/*
 ****************** Course ******************
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
	moduleId: z.number().optional().nullable(),
	lessonId: z.number().optional().nullable(),
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

export const editCourseUpsertSlotsDTO = courseDTO.extend({
	slots: z.array(courseSlotUpsertDTO).default([]),
});
export type EditCourseUpsertSlots = z.infer<typeof editCourseUpsertSlotsDTO>;

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

/*
 * UI Edit Course Specific
 */
export const uiCourseSlotDTO = courseSlotDTO.extend({
	id: z.number().optional(),
	clientId: z.string(),
	content: z.object({
		id: z.number().optional(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type UiCourseSlot = z.infer<typeof uiCourseSlotDTO>;

export const uiCourseDTO = courseDTO.extend({
	slots: z.array(uiCourseSlotDTO).default([]),
});
export type UiCourse = z.infer<typeof uiCourseDTO>;
