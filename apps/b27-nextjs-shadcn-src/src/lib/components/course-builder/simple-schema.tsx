import { z } from "zod";

export const moduleSlotSchema = z.object({
	id: z.number(),
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});

export const moduleSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(moduleSlotSchema).optional(),
});

export const moduleSlotWithLessonOutline = moduleSlotSchema.extend({
	lesson: z.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		isPublished: z.boolean().optional(),
	}),
});

export const moduleOutlineSchema = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	lessonSlots: z.array(moduleSlotWithLessonOutline).optional(),
});

export const createModuleSchema = moduleSchema.omit({ id: true });
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
