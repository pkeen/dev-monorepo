"use server";
import { courses } from "@/courses";
import {
	EditModuleUpsertSlots,
    UiModule,
    UiModuleSlot,
} from "@pete_keen/courses/validators";

export const editModule = async (input: UiModule) => {
	const convertToModuleWithSlots = (
		module: UiModule
	): EditModuleUpsertSlots => {
		const moduleWithSlots: EditModuleUpsertSlots = {
			id: module.id,
			name: module.name,
			description: module.description,
			isPublished: module.isPublished,
			slots: module.slots.map((slot: UiModuleSlot) => ({
				id: slot.id || undefined,
				moduleId: slot.moduleId,
				lessonId: slot.lessonId,
				order: slot.order,
			})),
		};
		return moduleWithSlots;
	};

	try {
		const module = await courses.module.updateWithSlots(
			convertToModuleWithSlots(input)
		);
		return module;
	} catch (error) {
		console.error(error);
		throw error;
	}
};
