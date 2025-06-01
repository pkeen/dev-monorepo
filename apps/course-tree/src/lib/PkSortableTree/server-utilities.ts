import { UiCourseDisplay, CourseDisplay } from "@pete_keen/courses/validators";
import { CourseTreeItem, FlattenedCourseTreeItem } from "./components/types";

export function courseDisplayToUi(course: CourseDisplay): UiCourseDisplay {
	return {
		...course,
		slots: course.slots.map((slot, i) => {
			const topLevelClientId = slot.id
				? `slot-${slot.id}`
				: `new-slot-${i}`;

			const moduleSlots = slot.moduleSlots?.map((lessonSlot, j) => ({
				...lessonSlot,
				clientId: lessonSlot.id
					? `module-slot-${lessonSlot.id}`
					: `new-module-slot-${j}`,
			}));

			return {
				...slot,
				clientId: topLevelClientId,
				moduleSlots,
			};
		}),
	};
}

export function courseDisplayToTree(course: CourseDisplay): CourseTreeItem[] {
	return course.slots.map((slot, i) => {
		return {
			id: slot.id,
			order: slot.order,
			moduleId: slot.moduleId,
			lessonId: slot.lessonId,
			type: slot.moduleId ? "module" : "lesson",
			name: slot.display.name,
			clientId: `${i}`,
			children:
				slot.moduleSlots?.map((lessonSlot, j) => ({
					id: lessonSlot.id,
					order: lessonSlot.order,
					moduleId: lessonSlot.moduleId,
					lessonId: lessonSlot.lessonId,
					type: "lesson",
					name: lessonSlot.display.name,
					clientId: `${i}-${j}`,
					children: [],
				})) || [],
		};
	});
}
