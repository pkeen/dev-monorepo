"use server";
import { courses } from "@/courses";
import { ModuleOutline, ModuleWithSlots } from "@pete_keen/courses/validators";

export const editModule = async (input: ModuleOutline) => {
	const convertToModuleWithSlots = (
		module: ModuleOutline
	): ModuleWithSlots => {
		const moduleWithSlots: ModuleWithSlots = {
			id: module.id,
			name: module.name,
			description: module.description,
			isPublished: module.isPublished,
			slots: module.slots.map((slot) => ({
				id: slot.id,
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
