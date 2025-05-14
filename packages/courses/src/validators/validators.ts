import { z } from "zod";

/*
 ************ Modules ************
 */

/*
 ******** GET types ************
 */
export const moduleSlotDTO = z.object({
	id: z.number(),
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});
export type ModuleSlot = z.infer<typeof moduleSlotDTO>;
export const moduleDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional().nullable(),
	isPublished: z.boolean().optional(),
	slots: z.array(moduleSlotDTO).default([]),
});
export type Module = z.infer<typeof moduleDTO>;

/*
 ****** Create types ******
 */
export const createModuleDTO = moduleDTO
	.extend({
		slots: z
			.array(moduleSlotDTO.omit({ id: true, moduleId: true }))
			.default([]),
	})
	.omit({ id: true });
export type CreateModuleDTO = z.infer<typeof createModuleDTO>;

/*
 ******* Edit types *******
 */
export const upsertModuleSlotDTO = moduleSlotDTO.extend({
	id: z.number().optional(), // <-- now optional for new slots
});
export type UpsertModuleSlot = z.infer<typeof upsertModuleSlotDTO>;

export const editModuleDTO = moduleDTO.extend({
	slots: z.array(upsertModuleSlotDTO).default([]),
});
export type EditModuleDTO = z.infer<typeof editModuleDTO>;

/*
 ******** Module Outline ********
 */
export const moduleSlotOutlineDTO = moduleSlotDTO.extend({
	moduleId: z.number().optional(),
	lessonId: z.number().optional(),
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

export const uiModuleSlotCreateDTO = uiModuleSlotDTO.omit({
	id: true,
	moduleId: true,
});
export type UiModuleSlotCreate = z.infer<typeof uiModuleSlotCreateDTO>;

export const uiModuleCreateDTO = createModuleDTO.extend({
	description: z.string().optional(),
	slots: z.array(uiModuleSlotCreateDTO).default([]),
});
export type UiModuleCreate = z.infer<typeof uiModuleCreateDTO>;

/*
 ****************** Course ******************
 */

/*
 ***** Get types *****
 */

// course slots
export const courseSlotDTO = z.object({
	id: z.number(),
	courseId: z.number(),
	moduleId: z.number().nullable(),
	lessonId: z.number().nullable(),
	order: z.number(),
});
export type CourseSlot = z.infer<typeof courseSlotDTO>;

export const courseDTO = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(courseSlotDTO).default([]),
});
export type Course = z.infer<typeof courseDTO>;

/*
 ***** Outline *****
 */
export const courseSlotOutlineDTO = courseSlotDTO.extend({
	moduleId: z.number().optional(),
	lessonId: z.number().optional(),
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
 ***** Create types *****
 */

export const createCourseDTO = courseDTO
	.extend({
		slots: z
			.array(courseSlotDTO.omit({ id: true, courseId: true }))
			.default([]),
	})
	.omit({ id: true });
export type CreateCourseDTO = z.infer<typeof createCourseDTO>;

/*
 ****** Edit types *****
 */

export const courseSlotUpsertDTO = courseSlotDTO.extend({
	id: z.number().optional(),
});
export type CourseSlotUpsert = z.infer<typeof courseSlotUpsertDTO>;

export const editCourseDTO = courseDTO.extend({
	slots: z.array(courseSlotUpsertDTO).default([]),
});
export type EditCourseDTO = z.infer<typeof editCourseDTO>;

/*
 * UI Edit Course Specific
 */
export const uiCourseSlotDTO = courseSlotDTO.extend({
	id: z.number().optional(),
	clientId: z.string(),
	content: z.object({
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type UiCourseSlot = z.infer<typeof uiCourseSlotDTO>;

export const uiCourseDTO = courseDTO.extend({
	slots: z.array(uiCourseSlotDTO).default([]),
});
export type UiCourse = z.infer<typeof uiCourseDTO>;

/*
 * UI Create Course
 */

export const uiCourseSlotCreateDTO = uiCourseSlotDTO.omit({
	id: true,
	courseId: true,
});
export type UiCourseSlotCreate = z.infer<typeof uiCourseSlotCreateDTO>;

export const uiCourseCreateDTO = courseDTO
	.extend({
		slots: z.array(uiCourseSlotCreateDTO).default([]),
	})
	.omit({ id: true });
export type UiCourseCreate = z.infer<typeof uiCourseCreateDTO>;

/*
 ************* Lesson ************
 */

export const lessonDTO = z.object({
	id: z.number(),
	name: z.string(),
	isPublished: z.boolean().optional(),
	excerpt: z.string().optional().nullable(),
	content: z.string().optional().nullable(),
	videoId: z.number().optional().nullable(),
});
export type Lesson = z.infer<typeof lessonDTO>;
export const createLessonDTO = lessonDTO.omit({ id: true });
export type CreateLessonDTO = z.infer<typeof createLessonDTO>;
export const editLessonDTO = lessonDTO;
export type EditLessonDTO = z.infer<typeof editLessonDTO>;

/*
 * ************* Video *************
 */
export const videoProviderSchema = z.enum([
	"r2",
	"youtube",
	"vimeo",
	"mux",
	"bunny",
]);
export type VideoProvider = z.infer<typeof videoProviderSchema>;
export const videoProviderLabels: Record<VideoProvider, string> = {
	r2: "R2",
	youtube: "YouTube",
	vimeo: "Vimeo",
	mux: "Mux",
	bunny: "Bunny",
};

export const videoDTO = z.object({
	id: z.number(),
	provider: videoProviderSchema,
	url: z.string(),
	title: z.string(),
	thumbnailUrl: z.string(),
	// isPublished: z.boolean().optional(),
	order: z.number(),
	createdAt: z.date().optional(),
	updatedAt: z.date().optional(),
});
export type Video = z.infer<typeof videoDTO>;
export const createVideoDTO = videoDTO.omit({ id: true });
export type CreateVideoDTO = z.infer<typeof createVideoDTO>;
export const editVideoDTO = videoDTO;
export type EditVideoDTO = z.infer<typeof editVideoDTO>;
