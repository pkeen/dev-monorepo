import { UiCourseDisplay, CourseDisplay } from "@pete_keen/courses/validators";

export function courseDisplayToUi(course: CourseDisplay): UiCourseDisplay {
	return {
		...course,
		slots: course.slots.map((slot, i) => {
			const topLevelClientId = slot.id ? `slot-${i}` : `new-slot-${i}`;

			// Transform moduleSlots if present
			const moduleSlots = slot.moduleSlots?.map((lessonSlot, j) => ({
				...lessonSlot,
				clientId: lessonSlot.id
					? `module-slot-${i}-${j}`
					: `new-module-slot-${i}-${j}`,
			}));

			return {
				...slot,
				clientId: topLevelClientId,
				moduleSlots, // might be undefined, and that’s fine
			};
		}),
	};
}
