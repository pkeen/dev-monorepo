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
export type ModuleSlotDTO = z.infer<typeof moduleSlotDTO>;
export const moduleDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional().nullable(),
	isPublished: z.boolean().optional(),
	slots: z.array(moduleSlotDTO).default([]),
});
export type ModuleDTO = z.infer<typeof moduleDTO>;

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
		id: z.number(),
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

// // course slots
// export const courseSlotDTO = z.object({
// 	id: z.number(),
// 	courseId: z.number(),
// 	moduleId: z.number().nullable(),
// 	lessonId: z.number().nullable(),
// 	order: z.number(),
// });
// // .refine(
// // 	(data) =>
// // 		(data.moduleId && !data.lessonId) ||
// // 		(!data.moduleId && data.lessonId),
// // 	{
// // 		message:
// // 			"Each slot must have either a lessonId or moduleId, but not both.",
// // 		path: ["moduleId"], // optional: set a path to highlight
// // 	}
// // );
// export type CourseSlot = z.infer<typeof courseSlotDTO>;

// export const courseDTO = z.object({
// 	id: z.number(),
// 	userId: z.string(),
// 	title: z.string(),
// 	description: z.string(),
// 	isPublished: z.boolean().optional(),
// 	slots: z.array(courseSlotDTO).default([]),
// });
// export type Course = z.infer<typeof courseDTO>;

// /*
//  ***** Outline *****
//  */
// export const courseSlotOutlineDTO = courseSlotDTO.extend({
// 	moduleId: z.number().nullable(),
// 	lessonId: z.number().nullable(),
// 	content: z.object({
// 		id: z.number(),
// 		name: z.string(),
// 		isPublished: z.boolean().optional(),
// 	}),
// });
// export type CourseSlotOutline = z.infer<typeof courseSlotOutlineDTO>;

// export const courseOutlineDTO = courseDTO.extend({
// 	slots: z.array(courseSlotOutlineDTO).default([]),
// });
// export type CourseOutline = z.infer<typeof courseOutlineDTO>;

// /*
//  ***** Create types *****
//  */

// export const createCourseDTO = courseDTO
// 	.extend({
// 		slots: z
// 			.array(courseSlotDTO.omit({ id: true, courseId: true }))
// 			.default([]),
// 	})
// 	.omit({ id: true });
// export type CreateCourseDTO = z.infer<typeof createCourseDTO>;

// /*
//  ****** Edit types *****
//  */

// export const courseSlotUpsertDTO = courseSlotDTO.extend({
// 	id: z.number().optional(),
// });
// export type CourseSlotUpsert = z.infer<typeof courseSlotUpsertDTO>;

// export const editCourseDTO = courseDTO.extend({
// 	slots: z.array(courseSlotUpsertDTO).default([]),
// });
// export type EditCourseDTO = z.infer<typeof editCourseDTO>;

// /*
//  * UI Edit Course Specific
//  */
// export const uiCourseSlotDTO = courseSlotDTO.extend({
// 	id: z.number().optional(),
// 	clientId: z.string(),
// 	content: z.object({
// 		id: z.number(),
// 		name: z.string(),
// 		isPublished: z.boolean().optional(),
// 	}),
// });
// export type UiCourseSlot = z.infer<typeof uiCourseSlotDTO>;

// export const uiCourseDTO = courseDTO.extend({
// 	slots: z.array(uiCourseSlotDTO).default([]),
// });
// export type UiCourse = z.infer<typeof uiCourseDTO>;

// /*
//  * UI Create Course
//  */

// export const uiCourseSlotCreateDTO = uiCourseSlotDTO.omit({
// 	id: true,
// 	courseId: true,
// });
// export type UiCourseSlotCreate = z.infer<typeof uiCourseSlotCreateDTO>;

// export const uiCourseCreateDTO = courseDTO
// 	.extend({
// 		slots: z.array(uiCourseSlotCreateDTO).default([]),
// 	})
// 	.omit({ id: true });
// export type UiCourseCreate = z.infer<typeof uiCourseCreateDTO>;

// /*
//  * Course Deep
//  */

// export const lessonOutlineDTO = z.object({
// 	id: z.number(),
// 	name: z.string(),
// 	isPublished: z.boolean().optional(),
// });
// export type LessonOutline = z.infer<typeof lessonOutlineDTO>;

// export const deepModuleSlotOutlineDTO = z.object({
// 	id: z.number(),
// 	order: z.number(),
// 	content: lessonOutlineDTO,
// });
// export type DeepModuleSlotOutline = z.infer<typeof deepModuleSlotOutlineDTO>;

// export const deepModuleSlotOutlineWithClientIdsDTO =
// 	deepModuleSlotOutlineDTO.extend({
// 		clientId: z.string(),
// 	});
// export type DeepModuleSlotOutlineWithClientIds = z.infer<
// 	typeof deepModuleSlotOutlineWithClientIdsDTO
// >;

// export const deepModuleOutlineDTO = z.object({
// 	id: z.number(),
// 	name: z.string(),
// 	isPublished: z.boolean(),
// 	slots: z.array(deepModuleSlotOutlineDTO),
// });
// export type DeepModuleOutline = z.infer<typeof deepModuleOutlineDTO>;

// export const deepModuleOutlineWithClientIdsDTO = deepModuleOutlineDTO.extend({
// 	clientId: z.string(),
// });
// export type DeepModuleOutlineWithClientIds = z.infer<
// 	typeof deepModuleOutlineWithClientIdsDTO
// >;

// // Union type: either a lesson or a module
// export const deepCourseSlotOutlineDTO = z.object({
// 	id: z.number(),
// 	courseId: z.number(),
// 	order: z.number(),
// 	moduleId: z.number().nullable(),
// 	lessonId: z.number().nullable(),
// 	content: z.union([
// 		lessonOutlineDTO.extend({ type: z.literal("lesson") }),
// 		deepModuleOutlineDTO.extend({ type: z.literal("module") }),
// 	]),
// });
// export type CourseSlotDeepOutline = z.infer<typeof deepCourseSlotOutlineDTO>;

// export const UIDeepCourseSlotOutlineDTO = z.object({
// 	clientId: z.string(),
// 	content: z.union([
// 		lessonOutlineDTO.extend({ type: z.literal("lesson") }),
// 		deepModuleOutlineWithClientIdsDTO.extend({ type: z.literal("module") }),
// 	]),
// 	id: z.number().optional(),
// 	courseId: z.number(),
// 	order: z.number(),
// 	moduleId: z.number().nullable(),
// 	lessonId: z.number().nullable(),
// });
// export type UIDeepCourseSlotOutline = z.infer<
// 	typeof UIDeepCourseSlotOutlineDTO
// >;

// export const courseDeepOutlineDTO = courseDTO.extend({
// 	slots: z.array(deepCourseSlotOutlineDTO).default([]),
// });
// export type CourseDeepOutline = z.infer<typeof courseDeepOutlineDTO>;

// export const UIDeepCourseDTO = courseDTO.extend({
// 	slots: z.array(UIDeepCourseSlotOutlineDTO).default([]),
// });
// export type UIDeepCourse = z.infer<typeof UIDeepCourseDTO>;

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

/*
 * NEW COURSE TYPES
 */

export const moduleSlotDeepDisplay = z.object({
	id: z.number(),
	lessonId: z.number(),
	order: z.number(),
	content: z.object({
		// id: z.number(),
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type ModuleSlotDeepDisplay = z.infer<typeof moduleSlotDeepDisplay>;

export const slotDeepDisplay = z
	.object({
		id: z.number(),
		courseId: z.number(),
		moduleId: z.number().nullable(),
		lessonId: z.number().nullable(),
		order: z.number(),
		content: z.union([
			z.object({
				type: z.literal("lesson"),
				id: z.number(),
				name: z.string(),
				isPublished: z.boolean().optional(),
			}),
			z.object({
				type: z.literal("module"),
				id: z.number(),
				name: z.string(),
				isPublished: z.boolean().optional(),
				moduleSlots: z.array(moduleSlotDeepDisplay).default([]),
			}),
		]),
	})
	.superRefine((data, ctx) => {
		const bothNull = data.moduleId === null && data.lessonId === null;
		const bothSet = data.moduleId !== null && data.lessonId !== null;

		if (bothNull || bothSet) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"You must provide either a moduleId or lessonId, but not both or neither.",
				path: ["moduleId"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"You must provide either a moduleId or lessonId, but not both or neither.",
				path: ["lessonId"],
			});
		}
	});
export type SlotDeepDisplay = z.infer<typeof slotDeepDisplay>;

export const courseDeepDisplay = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(slotDeepDisplay).default([]),
});
export type CourseDeepDisplay = z.infer<typeof courseDeepDisplay>;

export const uiModuleSlotDeep = moduleSlotDeepDisplay.extend({
	clientId: z.string(),
});
export type UiModuleSlotDeep = z.infer<typeof uiModuleSlotDeep>;

export const uiSlotDeep = z
	.object({
		id: z.number(),
		courseId: z.number(),
		moduleId: z.number().nullable(),
		lessonId: z.number().nullable(),
		order: z.number(),
		clientId: z.string(),
		content: z.union([
			z.object({
				type: z.literal("lesson"),
				id: z.number(),
				name: z.string(),
				isPublished: z.boolean().optional(),
			}),
			z.object({
				type: z.literal("module"),
				id: z.number(),
				name: z.string(),
				isPublished: z.boolean().optional(),
				moduleSlots: z.array(uiModuleSlotDeep).default([]).optional(),
			}),
		]),
	})
	.superRefine((data, ctx) => {
		if (
			(data.moduleId === null && data.lessonId === null) ||
			(data.moduleId !== null && data.lessonId !== null)
		) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"You must provide either a moduleId or lessonId, not both or neither.",
				path: ["moduleId"],
			});
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				message:
					"You must provide either a moduleId or lessonId, not both or neither.",
				path: ["lessonId"],
			});
		}
	});

export type UiSlotDeep = z.infer<typeof uiSlotDeep>;

export const uiCourseDeep = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(uiSlotDeep).default([]).optional(),
});
export type UiCourseDeep = z.infer<typeof uiCourseDeep>;

/*
 * Data Transfer Objects
 */

/*
 * Basic DTO
 */
// Step 1: Create a base object (without refinement)
const baseCourseSlotDTO = z.object({
	id: z.number(),
	courseId: z.number(),
	moduleId: z.number().nullable(),
	lessonId: z.number().nullable(),
	order: z.number(),
	moduleSlots: z.array(moduleSlotDTO).default([]).optional(),
});

export const courseSlotDTO = baseCourseSlotDTO.superRefine((data, ctx) => {
	const hasModuleId = data.moduleId !== null;
	const hasLessonId = data.lessonId !== null;

	if (hasModuleId === hasLessonId) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message:
				"You must provide either a moduleId or lessonId, but not both or neither.",
			path: ["moduleId"],
		});
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message:
				"You must provide either a moduleId or lessonId, but not both or neither.",
			path: ["lessonId"],
		});
	}

	if (!hasModuleId && data.moduleSlots && data.moduleSlots.length > 0) {
		ctx.addIssue({
			code: z.ZodIssueCode.custom,
			message: "moduleSlots should only be present when moduleId is set.",
			path: ["moduleSlots"],
		});
	}
});
export type CourseSlotDTO = z.infer<typeof courseSlotDTO>;

export const courseDTO = z.object({
	id: z.number(),
	userId: z.string(),
	title: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(courseSlotDTO).default([]),
});
export type CourseDTO = z.infer<typeof courseDTO>;

/**
 * Update DTO
 */
export const moduleSlotUpsertDTO = moduleSlotDTO.omit({ id: true });
export type ModuleSlotUpsertDTO = z.infer<typeof moduleSlotUpsertDTO>;

export const courseSlotUpsertDTO = baseCourseSlotDTO.extend({
	id: baseCourseSlotDTO.shape.id.optional(),
	moduleSlots: z.array(moduleSlotUpsertDTO).default([]).optional(),
});
export type CourseSlotUpsertDTO = z.infer<typeof courseSlotUpsertDTO>;

export const editCourseDTO = courseDTO.extend({
	id: courseDTO.shape.id, // required
	slots: z.array(courseSlotUpsertDTO).optional(),
});
export type EditCourseDTO = z.infer<typeof editCourseDTO>;

export const newCourseDTO = courseDTO.omit({ id: true }).extend({
	slots: z.array(courseSlotUpsertDTO).optional(),
});
export type NewCourseDTO = z.infer<typeof newCourseDTO>;

/**
 * DISPLAY TYPES
 */

export const moduleSlotDisplay = moduleSlotDTO.extend({
	display: z.object({
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type ModuleSlotDisplay = z.infer<typeof moduleSlotDisplay>;

export const courseSlotDisplay = baseCourseSlotDTO.extend({
	moduleSlots: z.array(moduleSlotDisplay).default([]).optional(),
	display: z.object({
		name: z.string(),
		isPublished: z.boolean().optional(),
	}),
});
export type CourseSlotDisplay = z.infer<typeof courseSlotDisplay>;

export const courseDisplay = courseDTO.extend({
	slots: z.array(courseSlotDisplay).default([]),
});
export type CourseDisplay = z.infer<typeof courseDisplay>;

/**
 * UI TYPES
 */

export const uiModuleSlotDisplay = moduleSlotDisplay.extend({
	clientId: z.string(),
	id: moduleSlotDisplay.shape.id.optional(),
});
export type UiModuleSlotDisplay = z.infer<typeof uiModuleSlotDisplay>;

export const uiCourseSlotDisplay = courseSlotDisplay.extend({
	clientId: z.string(),
	id: courseSlotDisplay.shape.id.optional(),
	moduleSlots: z.array(uiModuleSlotDisplay).default([]).optional(),
});
export type UiCourseSlotDisplay = z.infer<typeof uiCourseSlotDisplay>;

export const uiCourseDisplay = courseDisplay.extend({
	slots: z.array(uiCourseSlotDisplay).default([]).optional(),
});
export type UiCourseDisplay = z.infer<typeof uiCourseDisplay>;
