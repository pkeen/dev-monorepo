import { z } from "zod";

// A Lesson is always a leaf node
export const lessonSchema = z.object({
	id: z.string(),
	type: z.literal("lesson"),
	data: z.object({
		name: z.string(),
		description: z.string(),
		isPublished: z.boolean().optional(),
	}),
});

// A Module can contain *slots* recursively
export const moduleSchema: z.ZodType<any> = z.lazy(() =>
	z.object({
		id: z.string(),
		type: z.literal("module"),
		data: z.object({
			name: z.string(),
			description: z.string(),
			isPublished: z.boolean().optional(),
			slots: z.array(slotSchema).optional(), // Here's the recursion
		}),
	})
);

// Now define Slot as Module OR Lesson
export const slotSchema = z.union([lessonSchema, moduleSchema]);

// Full Course Schema
export const courseSchema = z.object({
	title: z.string().min(3).max(256),
	description: z.string().max(10000),
	isPublished: z.boolean(),
	slots: z.array(slotSchema),
});

export type SlotPath =
	| `slots.${number}`
	| `slots.${number}.data.slots.${number}`
	| `slots.${number}.data.slots.${number}.data.slots.${number}`; // deeper if needed

export type CourseFormValues = z.infer<typeof courseSchema>;
