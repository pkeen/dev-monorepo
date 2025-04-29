import { z } from "zod";

export const moduleSlotSchema = z.object({
	id: z.string(),
	moduleId: z.string(),
	lessonId: z.string(),
	order: z.number(),
});

export const moduleSchema = z.object({
	id: z.string(),
	name: z.string(),
	description: z.string(),
	isPublished: z.boolean().optional(),
	slots: z.array(moduleSlotSchema).optional(),
});

export const createModuleSchema = moduleSchema.omit({ id: true });
export type CreateModuleInput = z.infer<typeof createModuleSchema>;
