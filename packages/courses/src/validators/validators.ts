import { z } from "zod";

export const moduleDTO = z.object({
	id: z.number(),
	name: z.string(),
	description: z.string().optional(),
	isPublished: z.boolean().optional(),
});

export type Module = z.infer<typeof moduleDTO>;
export const createModuleDTO = moduleDTO.omit({ id: true });
export type CreateModuleDTO = z.infer<typeof createModuleDTO>;

export const upsertModuleSlotDTO = z.object({
	id: z.number().optional(), // <-- now optional for new slots
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});
export type UpsertModuleSlot = z.infer<typeof upsertModuleSlotDTO>;

export const moduleSlotDTO = z.object({
	id: z.number(),
	moduleId: z.number(),
	lessonId: z.number(),
	order: z.number(),
});

export const moduleUpsertSlotsDTO = moduleDTO.extend({
	slots: z.array(upsertModuleSlotDTO).default([]),
});
export type ModuleUpsertSlots = z.infer<typeof moduleUpsertSlotsDTO>;

export type ModuleSlot = z.infer<typeof moduleSlotDTO>;

export const moduleWithSlotsDTO = moduleDTO.extend({
	slots: z.array(moduleSlotDTO).default([]),
});

export type ModuleWithSlots = z.infer<typeof moduleWithSlotsDTO>;

export const moduleSlotWithOutlineDTO = moduleSlotDTO.extend({
	lesson: z.object({
		id: z.number(),
		name: z.string(),
		description: z.string().optional(),
		isPublished: z.boolean().optional(),
	}),
});

export type ModuleSlotWithOutline = z.infer<typeof moduleSlotWithOutlineDTO>;

export const moduleOutlineDTO = moduleDTO.extend({
	slots: z.array(moduleSlotWithOutlineDTO).default([]),
});

export type ModuleOutline = z.infer<typeof moduleOutlineDTO>;
